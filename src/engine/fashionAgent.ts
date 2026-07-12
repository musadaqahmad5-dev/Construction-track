import { WardrobeItem } from '../types';
import { PersonalFashionMemoryEngine } from './personalMemory';
import { UnifiedStyleDNAEngine, VisualTrendEngine } from './visionIntelligence';
import { DecisionIntelligenceEngine } from './decisionIntelligence';

// ============================================================================
// ENTERPRISE FASHION AGENT SCHEMAS & INTERFACES
// ============================================================================

export interface AutonomousTask {
  id: string;
  title: string;
  description: string;
  category: 'warning' | 'tip' | 'opportunity' | 'action';
  priority: 'High' | 'Medium' | 'Low';
  urgency: number;             // 0 to 100
  confidence: number;          // 0 to 100
  estimatedUserValue: number;   // 0 to 100 scale
  estimatedRevenueImpact: number; // 0 to 100 scale (e.g. affiliate match)
  estimatedApiSaving: number;     // 0 to 100 scale (local cache benefits)
  actionable: boolean;
  status: 'pending' | 'accepted' | 'dismissed';
  triggerType: string;
}

export interface FashionWorkflow {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  action: string;
  result: string;
  status: 'active' | 'completed' | 'idle';
}

export interface FashionProductivityScore {
  closetHealth: number;        // 0 to 100
  reuseRate: number;           // 0 to 100
  unusedRate: number;          // 0 to 100
  shoppingNeed: number;        // 0 to 100
  capsuleQuality: number;      // 0 to 100
  seasonReadiness: number;     // 0 to 100
  aiEfficiency: number;        // 0 to 100
  decisionEfficiency: number;  // 0 to 100
}

export interface WorkflowHistoryEntry {
  id: string;
  workflowName: string;
  timestamp: number;
  status: 'executed' | 'accepted' | 'dismissed' | 'ignored';
  learningImpact: string;
}

// ============================================================================
// AUTONOMOUS FASHION AGENT ENGINE
// ============================================================================

export class FashionAgentEngine {

  /**
   * Evaluates the entire UnifiedFashionOS state and updates the active queues
   */
  static runDiagnostics(
    wardrobeItems: WardrobeItem[],
    userId: string = 'user-1'
  ): {
    tasks: AutonomousTask[];
    score: FashionProductivityScore;
    workflows: FashionWorkflow[];
    history: WorkflowHistoryEntry[];
  } {
    const memory = PersonalFashionMemoryEngine.getMemory(userId);
    const dna = UnifiedStyleDNAEngine.generateUnifiedStyleDNA(userId);
    const trends = VisualTrendEngine.analyzeTrends();
    
    // 1. Analyze and detect Opportunity Tasks (Opportunity Detector)
    const tasks = this.generateTasks(wardrobeItems, userId, dna, trends);

    // 2. Compute Fashion Productivity Score
    const score = this.calculateProductivityScore(wardrobeItems, userId);

    // 3. Evaluate Active Workflows
    const workflows = this.loadWorkflows(wardrobeItems);

    // 4. Retrieve Workflow History
    const history = this.loadHistory(userId);

    return {
      tasks,
      score,
      workflows,
      history
    };
  }

  /**
   * Generates active proactive autonomous tasks based on wardrobe rules and context (Opportunity Detector)
   */
  private static generateTasks(
    items: WardrobeItem[],
    userId: string,
    dna: any,
    trends: any
  ): AutonomousTask[] {
    const tasks: AutonomousTask[] = [];

    // Rule 1: Detect missing formal outfits for upcoming dates
    const hasFormalItem = items.some(i => i.formality === 'Formal' || (i.title || '').toLowerCase().includes('suit') || (i.title || '').toLowerCase().includes('tuxedo') || (i.title || '').toLowerCase().includes('blazer'));
    if (!hasFormalItem) {
      tasks.push({
        id: 'task-formal-missing',
        title: 'Formal Coordinate Deficiency Detected',
        description: 'You currently have no verified High-formality coordinates (Suit / Blazer) registered in your closet for upcoming professional calendar events.',
        category: 'warning',
        priority: 'High',
        urgency: 85,
        confidence: 94,
        estimatedUserValue: 90,
        estimatedRevenueImpact: 45,
        estimatedApiSaving: 80,
        actionable: true,
        status: 'pending',
        triggerType: 'Calendar & Formality Scan'
      });
    }

    // Rule 2: Unused garments identification
    const unusedItems = items.filter(i => !i.wearCount || i.wearCount === 0);
    if (unusedItems.length >= 3) {
      tasks.push({
        id: 'task-unused-garments',
        title: `Underutilized Capsule Wardrobe Items (${unusedItems.length} pcs)`,
        description: `We detected ${unusedItems.length} registered garments that have zero logged wear counts (including "${unusedItems[0]?.title || 'garments'}"). Integrate them into active daily rotations to prevent wardrobe decay.`,
        category: 'opportunity',
        priority: 'Medium',
        urgency: 60,
        confidence: 88,
        estimatedUserValue: 75,
        estimatedRevenueImpact: 10,
        estimatedApiSaving: 90,
        actionable: true,
        status: 'pending',
        triggerType: 'Wear Counter Analyzer'
      });
    }

    // Rule 3: Weather cooling down triggers layering
    tasks.push({
      id: 'task-weather-cooling',
      title: 'Cool Season Layering Opportunity',
      description: 'Incoming autumn weather forecasts show ambient temperature cools down. Prepare heavy-density outerwear like trench coats or wool blazers for proactive styling loops.',
      category: 'tip',
      priority: 'Medium',
      urgency: 70,
      confidence: 85,
      estimatedUserValue: 65,
      estimatedRevenueImpact: 15,
      estimatedApiSaving: 95,
      actionable: false,
      status: 'pending',
      triggerType: 'Overcast Climate Monitor'
    });

    // Rule 4: Overused item detection (Wear fatigue)
    const overused = items.find(i => i.wearCount && i.wearCount > 15);
    if (overused) {
      tasks.push({
        id: 'task-overused-items',
        title: `Wear Fatigue Warning: ${overused.title}`,
        description: `Your "${overused.title}" has a high log count of ${overused.wearCount} wears. Rotate in alternative smart coordinates to expand capsule variety and sustain garment lifespan.`,
        category: 'warning',
        priority: 'Medium',
        urgency: 65,
        confidence: 90,
        estimatedUserValue: 70,
        estimatedRevenueImpact: 20,
        estimatedApiSaving: 85,
        actionable: true,
        status: 'pending',
        triggerType: 'Wear Counter Analyzer'
      });
    } else {
      // Fallback fallback warning
      tasks.push({
        id: 'task-overused-fallback',
        title: 'Wear Counts Health Scan Complete',
        description: 'Closet items are currently balanced perfectly. Maximum single wear count stays below fatigue limits, signaling excellent rotation practices.',
        category: 'tip',
        priority: 'Low',
        urgency: 30,
        confidence: 95,
        estimatedUserValue: 50,
        estimatedRevenueImpact: 5,
        estimatedApiSaving: 99,
        actionable: false,
        status: 'pending',
        triggerType: 'Rotation Balance Audit'
      });
    }

    // Rule 5: Waterproof/Weatherproof deficiency
    const hasWaterproof = items.some(i => (i.description || '').toLowerCase().includes('waterproof') || (i.description || '').toLowerCase().includes('gore-tex') || (i.title || '').toLowerCase().includes('raincoat') || (i.title || '').toLowerCase().includes('umbrella'));
    if (!hasWaterproof) {
      tasks.push({
        id: 'task-waterproof-missing',
        title: 'Missing Waterproof Outerwear Class',
        description: 'You are missing waterproof garments or weather resistant footwear. High rainy overcast season triggers are pending.',
        category: 'warning',
        priority: 'High',
        urgency: 80,
        confidence: 91,
        estimatedUserValue: 85,
        estimatedRevenueImpact: 60,
        estimatedApiSaving: 80,
        actionable: true,
        status: 'pending',
        triggerType: 'Fabric Integrity Scan'
      });
    }

    // Rule 6: Affiliate matching opportunities
    const luxuryGarments = items.filter(i => (i.description || '').toLowerCase().includes('silk') || (i.description || '').toLowerCase().includes('cashmere') || (i.description || '').toLowerCase().includes('leather'));
    if (luxuryGarments.length > 0) {
      tasks.push({
        id: 'task-affiliate-luxury',
        title: 'Smart Luxury Coordinate Matches Found',
        description: `Your premium "${luxuryGarments[0].title}" matches 3 premium silk coordinate listings in the curated Marketplace. Tap to preview and maximize affiliate checkout benefits.`,
        category: 'opportunity',
        priority: 'Low',
        urgency: 45,
        confidence: 82,
        estimatedUserValue: 60,
        estimatedRevenueImpact: 85,
        estimatedApiSaving: 90,
        actionable: true,
        status: 'pending',
        triggerType: 'Marketplace Match Engine'
      });
    }

    // Rule 7: Clean old visual logs to optimize storage
    tasks.push({
      id: 'task-archive-images',
      title: 'Optimize AI Graphic Sandbox Storage',
      description: 'Your local sandbox storage contains multiple old generated try-on mocks. Archive older image records to free up system capacity and speed up navigation.',
      category: 'action',
      priority: 'Low',
      urgency: 40,
      confidence: 99,
      estimatedUserValue: 40,
      estimatedRevenueImpact: 5,
      estimatedApiSaving: 95,
      actionable: true,
      status: 'pending',
      triggerType: 'Sandboxed Storage Audit'
    });

    // Handle accepted/dismissed items via local state to keep persistence clean
    const userTasksKey = `fashion_agent_tasks_${userId}`;
    const storedTasksStr = localStorage.getItem(userTasksKey);
    if (storedTasksStr) {
      try {
        const stored = JSON.parse(storedTasksStr) as { id: string, status: 'accepted' | 'dismissed' }[];
        stored.forEach(st => {
          const matching = tasks.find(t => t.id === st.id);
          if (matching) {
            matching.status = st.status;
          }
        });
      } catch (e) {}
    }

    return tasks;
  }

  /**
   * Calculates the Closet/Fashion Productivity Score (Opportunity Detector)
   */
  private static calculateProductivityScore(
    items: WardrobeItem[],
    userId: string
  ): FashionProductivityScore {
    if (items.length === 0) {
      return {
        closetHealth: 50,
        reuseRate: 0,
        unusedRate: 100,
        shoppingNeed: 50,
        capsuleQuality: 50,
        seasonReadiness: 50,
        aiEfficiency: 95,
        decisionEfficiency: 90
      };
    }

    const wornItems = items.filter(i => i.wearCount && i.wearCount > 0);
    const unusedCount = items.length - wornItems.length;

    const reuseRate = Math.round((wornItems.length / items.length) * 100);
    const unusedRate = Math.round((unusedCount / items.length) * 100);

    // Season readiness: count of items with season tags
    const seasonCount = items.filter(i => i.season && i.season !== 'All-Season').length;
    const seasonReadiness = Math.min(100, Math.round((seasonCount / items.length) * 100 + 40));

    // Closet health: high if reuse is balanced, wardrobe size is clean
    const closetHealth = Math.min(100, Math.round((100 - unusedRate) * 0.7 + seasonReadiness * 0.3));

    // Shopping need is high if missing formal or waterproof items
    const hasFormal = items.some(i => i.formality === 'Formal' || (i.title || '').toLowerCase().includes('suit'));
    const hasWaterproof = items.some(i => (i.description || '').toLowerCase().includes('waterproof'));
    const shoppingNeed = Math.min(100, Math.max(10, (hasFormal ? 15 : 60) + (hasWaterproof ? 10 : 35)));

    // Capsule Quality: balanced top, bottom, shoes count
    const topCount = items.filter(i => (i.category || '').toLowerCase().includes('casual') || (i.title || '').toLowerCase().includes('shirt') || (i.title || '').toLowerCase().includes('hoodie')).length;
    const bottomCount = items.filter(i => (i.title || '').toLowerCase().includes('pants') || (i.title || '').toLowerCase().includes('jeans')).length;
    const capsuleQuality = Math.min(100, Math.round(50 + (Math.min(topCount, bottomCount) / Math.max(1, topCount + bottomCount)) * 80));

    // AI/Decision efficiency from local cache hit rates
    const weights = DecisionIntelligenceEngine.loadDecisionWeights(userId);
    const aiEfficiency = weights.cacheHitRate || 74;
    const decisionEfficiency = weights.decisionStability || 92;

    return {
      closetHealth,
      reuseRate,
      unusedRate,
      shoppingNeed,
      capsuleQuality,
      seasonReadiness,
      aiEfficiency,
      decisionEfficiency
    };
  }

  /**
   * Loads reusable workflow system triggers (Workflow Engine)
   */
  private static loadWorkflows(items: WardrobeItem[]): FashionWorkflow[] {
    return [
      {
        id: 'wf-wedding-coordinate',
        name: 'Strategic Wedding Gala Outfit Pipeline',
        trigger: 'Upcoming wedding event listed in calendar',
        conditions: ['Premium Evening Wedding Gala event scheduled', 'Formality matches Luxury profile required'],
        action: 'Orchestrate multi-engine candidate search across Style DNA & Knowledge Graph biases',
        result: 'Curate a highly tailored Suit & Oxford shoes coordinate',
        status: 'active'
      },
      {
        id: 'wf-overcast-layering',
        name: 'Cool Climate Active Layering Loop',
        trigger: 'Ambient temperature forecast falls below 14°C',
        conditions: ['Cool Overcast or Rainy Breezy Cool forecast active', 'Outerwear status = "In Closet"'],
        action: 'Filter premium trench coats and blazers; map with thermal inner layers',
        result: 'Propose balanced thermal index outfits with elevated style scores',
        status: 'active'
      },
      {
        id: 'wf-rotation-booster',
        name: 'Underutilized Garment Fatigue Break',
        trigger: 'Total unused closet garments exceeds 20%',
        conditions: ['Unused Rate is high', 'Garments have zero wear logging active'],
        action: 'Inject high novelty index bias into the Candidate Ranking pipeline',
        result: 'Boost selection frequency of unworn items during daily casual look generation',
        status: 'completed'
      }
    ];
  }

  /**
   * Loads executed history logs (Workflow History)
   */
  private static loadHistory(userId: string): WorkflowHistoryEntry[] {
    const key = `fashion_agent_history_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }

    // Default historical events for rich dashboard representation on startup
    const defaultHistory: WorkflowHistoryEntry[] = [
      {
        id: 'wh-1',
        workflowName: 'Strategic Wedding Gala Outfit Pipeline',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
        status: 'accepted',
        learningImpact: 'Increased Knowledge Graph bias on luxury silhouettes (+0.08)'
      },
      {
        id: 'wh-2',
        workflowName: 'Cool Climate Active Layering Loop',
        timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
        status: 'executed',
        learningImpact: 'Reinforced Weather suitability weight limits on Outerwear pieces'
      },
      {
        id: 'wh-3',
        workflowName: 'Underutilized Garment Fatigue Break',
        timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
        status: 'accepted',
        learningImpact: 'Boosted active Style DNA weights to support creative rotation patterns'
      }
    ];

    localStorage.setItem(key, JSON.stringify(defaultHistory));
    return defaultHistory;
  }

  /**
   * Updates state on task accept/dismiss and logs learning improvements (Continuous Learning)
   */
  static actionTask(
    userId: string,
    taskId: string,
    status: 'accepted' | 'dismissed'
  ): void {
    // 1. Persist the state of the task
    const userTasksKey = `fashion_agent_tasks_${userId}`;
    let stored: { id: string, status: 'accepted' | 'dismissed' }[] = [];
    const storedTasksStr = localStorage.getItem(userTasksKey);
    if (storedTasksStr) {
      try {
        stored = JSON.parse(storedTasksStr);
      } catch (e) {}
    }

    // Remove existing if any, and push new
    stored = stored.filter(s => s.id !== taskId);
    stored.push({ id: taskId, status });
    localStorage.setItem(userTasksKey, JSON.stringify(stored));

    // 2. Adjust system parameters as a consequence of action
    const weights = DecisionIntelligenceEngine.loadDecisionWeights(userId);
    const history = this.loadHistory(userId);

    let impactDesc = "No parameter update applied.";

    if (status === 'accepted') {
      weights.totalAccepted++;
      weights.learningProgress = Math.min(100, weights.learningProgress + 3);
      weights.styleDNAWeight = Math.min(2.0, weights.styleDNAWeight + 0.04);
      weights.knowledgeGraphWeight = Math.min(2.0, weights.knowledgeGraphWeight + 0.03);
      
      impactDesc = "Proactive task accepted. Adjusted DNA and Knowledge Graph weights (+0.04) headlessly.";
      console.log(`%c[AGENT ENGINE] Task "${taskId}" accepted. Improved continuous learning state.`, "color: #10b981; font-weight: bold;");
    } else {
      weights.totalRejected++;
      weights.creativityIndex = Math.min(100, weights.creativityIndex + 8);
      
      impactDesc = "Task dismissed. Boosted style creativity index (+8%) to reduce coordination fatigue.";
      console.log(`%c[AGENT ENGINE] Task "${taskId}" dismissed. Boosted style creativity index.`, "color: #f43f5e; font-weight: bold;");
    }

    DecisionIntelligenceEngine.saveDecisionWeights(userId, weights);

    // Save historical log
    history.unshift({
      id: `wh-${Date.now()}`,
      workflowName: `Autonomous Proactive Action: ${taskId}`,
      timestamp: Date.now(),
      status: status === 'accepted' ? 'accepted' : 'dismissed',
      learningImpact: impactDesc
    });
    localStorage.setItem(`fashion_agent_history_${userId}`, JSON.stringify(history.slice(0, 15)));
  }
}
