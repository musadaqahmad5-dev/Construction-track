import { WardrobeItem } from '../../types';
import { OutfitPlan, AgentPlanner } from '../agent/agentPlanner';
import { RotationEngine } from './rotationEngine';

export class WeekPlanner {
  private static STORAGE_KEY = 'fashion_companion_weekly_plans';

  /**
   * Retrieves active weekly outfits plans.
   */
  static getWeeklyPlans(): OutfitPlan[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Generates and stores fresh proposed plans for the week.
   */
  static bootstrapWeeklyPlans(wardrobe: WardrobeItem[], weatherLabelString: string): OutfitPlan[] {
    const existing = this.getWeeklyPlans();
    if (existing.length > 0) return existing;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const occasions = [
      'Workspace Sync',
      'Cardio Fitness Outing',
      'Informal Cafe Lunch',
      'Corporate Presentation',
      'Lounging & Recovery',
      'Social Club Dinner',
      'Weekend Errand Run'
    ];

    const proposals = AgentPlanner.generateWeeklyProposals(wardrobe, days, occasions, weatherLabelString);
    this.savePlans(proposals);
    return proposals;
  }

  /**
   * Saves planning state.
   */
  static savePlans(plans: OutfitPlan[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));
  }

  /**
   * Approves or rejects a day's styling plan.
   */
  static setUserDecision(planId: string, decision: 'approved' | 'rejected'): OutfitPlan[] {
    const plans = this.getWeeklyPlans();
    const target = plans.find(p => p.id === planId);
    if (target) {
      target.status = decision;
    }
    this.savePlans(plans);
    return plans;
  }

  /**
   * Regenerates a single day's plan with un-fatigued assets using RotationEngine.
   */
  static regenerateDayPlan(planId: string, wardrobe: WardrobeItem[]): OutfitPlan[] {
    const plans = this.getWeeklyPlans();
    const index = plans.findIndex(p => p.id === planId);
    if (index === -1) return plans;

    const currentPlan = plans[index];
    const categoryFocus = wardrobe.find(w => currentPlan.itemIds.includes(w.id))?.category || 'Casual';

    // RotationEngine retrieves the least used item
    const fallbackItem = RotationEngine.getOptimalRotationAlternative(wardrobe, categoryFocus, currentPlan.itemIds);
    
    if (fallbackItem) {
      plans[index] = {
        ...currentPlan,
        itemIds: [fallbackItem.id],
        notes: `Regenerated utilizing Rotation Engine target: "${fallbackItem.title}" to reduce wardrobe wear fatigue.`
      };
      this.savePlans(plans);
    }

    return plans;
  }
}
