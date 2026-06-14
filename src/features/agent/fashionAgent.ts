import { WardrobeItem } from '../../types';
import { AgentPlanner, OutfitPlan } from './agentPlanner';
import { AgentMemoryBridge } from './agentMemoryBridge';
import { AgentPolicies } from './agentPolicies';
import { ContextCollector, ContextProfile } from '../context/contextCollector';

export interface ActionProposal {
  id: string;
  type: 'wash' | 'rotate' | 'wear' | 'purchase_gaps' | 'style';
  title: string;
  description: string;
  targetItemIds: string[];
  confidence: number;
  policyApproved: boolean;
  userApproved?: 'approved' | 'rejected' | 'pending';
}

export interface StylingBriefs {
  dailyBrief: {
    title: string;
    body: string;
    tone: string;
    temperatureImpact: string;
    repetitionWarning?: string;
  };
  weeklyBrief: {
    summary: string;
    varietyScore: number; // 0-100
    fatigueRisk: 'Low' | 'Medium' | 'High';
    recommendedTheme: string;
  };
}

export class FashionAgent {
  /**
   * Monitor the closet wardrobe items and inspect for overused or neglected items.
   */
  static monitorWardrobe(wardrobe: WardrobeItem[]) {
    const overused = wardrobe.filter(item => (item.wearCount || 0) >= 8);
    const unused = wardrobe.filter(item => !item.wearCount || item.wearCount === 0);
    const inClutterGroup = wardrobe.filter(item => item.status === 'Worn/Wash');

    return {
      overusedCount: overused.length,
      unusedCount: unused.length,
      unwashedCount: inClutterGroup.length,
      totalCount: wardrobe.length
    };
  }

  /**
   * Detect repetitive use patterns in past outfits.
   */
  static detectRepetition(wardrobe: WardrobeItem[]): string | undefined {
    const sorted = [...wardrobe]
      .filter(x => x.lastUsed)
      .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime());

    if (sorted.length < 2) return undefined;

    // If same item or same item name is used twice continuously within past 3 days
    const recent = sorted.slice(0, 3);
    const wearFreq: Record<string, number> = {};
    recent.forEach(r => {
      wearFreq[r.title] = (wearFreq[r.title] || 0) + 1;
    });

    const repetitiveItem = Object.keys(wearFreq).find(k => wearFreq[k] >= 2);
    if (repetitiveItem) {
      return `You have styled "${repetitiveItem}" repeatedly in active succession. Let's swap this with fresh alternatives to avoid fiber fatigue.`;
    }
    return undefined;
  }

  /**
   * Generates proactive daily styling details and weekly advice summaries.
   */
  static generateBriefs(wardrobe: WardrobeItem[], context: ContextProfile): StylingBriefs {
    const repetitionWarning = this.detectRepetition(wardrobe);
    const activeOuterwear = wardrobe.filter(item => item.category === 'Outerwear');
    const recommendedOuter = activeOuterwear.length > 0 ? activeOuterwear[0].title : 'Light layers';

    // Heuristics based on weather
    let tempComment = "Comfortable baseline";
    if (context.weatherSummary.toLowerCase().includes('cool') || context.priorityWeights.layering > 0.6) {
      tempComment = `We recommend layering with "${recommendedOuter}" as thermal priorities are high.`;
    }

    const dayBrief = {
      title: `Curated Styling for ${context.occasion}`,
      body: `Today's agenda covers ${context.occasion} with a physical energy load of ${context.energyLevel}/10. Keep your attire functional yet composed.`,
      tone: context.energyLevel > 6 ? "High Energetic & Dynamic" : "Relaxed & Minimalist Composition",
      temperatureImpact: tempComment,
      repetitionWarning
    };

    const varietyScore = Math.max(20, Math.min(100, 100 - (wardrobe.filter(x => (x.wearCount || 0) > 6).length * 10)));
    const fatigueRisk = varietyScore < 60 ? 'Medium' as const : (varietyScore < 40 ? 'High' as const : 'Low' as const);

    const weekBrief = {
      summary: `Your closet variety index is currently at ${varietyScore}%. Let's prioritize wearing unrotated garments.`,
      varietyScore,
      fatigueRisk,
      recommendedTheme: context.traveling ? "Packable High-Utility Neutrals" : "Relaxed Technical Modernism"
    };

    return {
      dailyBrief: dayBrief,
      weeklyBrief: weekBrief
    };
  }

  /**
   * Prepares actionable, structured styling or washing recommendations.
   */
  static prepareProposals(wardrobe: WardrobeItem[], context: ContextProfile): ActionProposal[] {
    const proposals: ActionProposal[] = [];

    // Proposal 1: Laundry recommendation
    const dirtyItems = wardrobe.filter(item => item.status === 'Worn/Wash');
    if (dirtyItems.length > 0) {
      proposals.push({
        id: 'prop-laundry',
        type: 'wash',
        title: 'Perform Circular Laundry Care',
        description: `Release ${dirtyItems.length} soiled garments (e.g., "${dirtyItems[0].title}") back into available circulation.`,
        targetItemIds: dirtyItems.map(item => item.id),
        confidence: 0.95,
        policyApproved: AgentPolicies.verifyProposal('wash', dirtyItems, context),
        userApproved: 'pending'
      });
    }

    // Proposal 2: Diversification rotation recommendation
    const unusedItems = wardrobe.filter(item => !item.wearCount || item.wearCount === 0);
    if (unusedItems.length > 0 && wardrobe.length > 2) {
      const targetUnused = unusedItems.slice(0, 2);
      proposals.push({
        id: 'prop-rotation',
        type: 'rotate',
        title: 'Activate Back-Drawer Wardrobe Assets',
        description: `Incorporate "${targetUnused.map(x => x.title).join(', ')}" to optimize total wear distribution.`,
        targetItemIds: targetUnused.map(item => item.id),
        confidence: 0.88,
        policyApproved: AgentPolicies.verifyProposal('rotate', targetUnused, context),
        userApproved: 'pending'
      });
    }

    // Proposal 3: Outfit planning based on calendar agenda
    const possibleOutfit = wardrobe.filter(x => x.status === 'In Closet').slice(0, 2);
    if (possibleOutfit.length >= 2) {
      proposals.push({
        id: 'prop-outfit',
        type: 'style',
        title: `Pre-compose Outfit for ${context.occasion}`,
        description: `Coordinate a look featuring "${possibleOutfit[0].title}" matched with "${possibleOutfit[1].title}".`,
        targetItemIds: possibleOutfit.map(item => item.id),
        confidence: 0.90,
        policyApproved: AgentPolicies.verifyProposal('style', possibleOutfit, context),
        userApproved: 'pending'
      });
    }

    return proposals;
  }
}
