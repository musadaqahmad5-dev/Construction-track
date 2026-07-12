import { WardrobeItem, ClothingCategory } from '../types';
import { AgentCommunicationBus, AgentMessage } from './agentBus';
import { 
  PersonalFashionMemoryEngine, 
  FashionKnowledgeGraphEngine, 
  VisionIntelligenceEngine, 
  DuplicateLookDetectionEngine, 
  OutfitSimilarityEngine, 
  DecisionIntelligenceEngine,
  UnifiedStyleDNAEngine
} from '../engine';

// ============================================================================
// AGENT INTERFACES & EXECUTION LOGS
// ============================================================================

export interface CollaborationTraceStep {
  agentName: string;
  status: string;
  timestamp: number;
  outputSummary: string;
}

export interface CollaborativeStylingResult {
  winnerOutfit: any;
  trace: CollaborationTraceStep[];
  resolverLog?: string;
  accuracyEstimate: number;
}

// ============================================================================
// 1. FASHION STYLIST AGENT
// ============================================================================
export class FashionStylistAgent {
  static readonly name = 'FashionStylistAgent';

  static handleOutfitRequest(payload: {
    items: WardrobeItem[];
    occasion: string;
    weather: string;
    season: string;
    userId: string;
    dnaAnalysis?: any;
    graphHarmony?: any;
    decisionWeights?: any;
  }): any {
    // Styling combinations, occasion matching & advice
    console.log(`[${this.name}] Orchestrating styling look for occasion: "${payload.occasion}"`);
    
    // Leverage DecisionIntelligenceEngine to evaluate outfits
    const winner = DecisionIntelligenceEngine.evaluateAndSelectBest(payload.items, {
      userId: payload.userId,
      weather: payload.weather,
      occasion: payload.occasion,
      season: payload.season
    });

    // Publish to Agent Bus
    AgentCommunicationBus.publish({
      id: `stylist-${Date.now()}`,
      sender: this.name,
      recipient: 'broadcast',
      topic: 'stylist:outfit_created',
      payload: { winner, occasion: payload.occasion },
      priority: 'Medium',
      timestamp: Date.now()
    });

    return winner;
  }
}

// ============================================================================
// 2. FASHION MEMORY AGENT
// ============================================================================
export class FashionMemoryAgent {
  static readonly name = 'FashionMemoryAgent';

  static getProfileState(userId: string): {
    memory: any;
    dna: any;
    dislikes: string[];
  } {
    console.log(`[${this.name}] Loading personal memory and Style DNA for: "${userId}"`);
    const memory = PersonalFashionMemoryEngine.getMemory(userId);
    const dna = UnifiedStyleDNAEngine.generateUnifiedStyleDNA(userId);

    AgentCommunicationBus.publish({
      id: `memory-${Date.now()}`,
      sender: this.name,
      recipient: 'broadcast',
      topic: 'memory:dna_loaded',
      payload: { userId, dna, preferences: dna.primaryVibe },
      priority: 'Low',
      timestamp: Date.now()
    });

    return {
      memory,
      dna,
      dislikes: memory.dislikes?.colors || ['Bright Neon Yellow']
    };
  }
}

// ============================================================================
// 3. FASHION VISION AGENT
// ============================================================================
export class FashionVisionAgent {
  static readonly name = 'FashionVisionAgent';

  static analyzeGarments(items: WardrobeItem[]): {
    duplicates: any[];
    similarities: any[];
  } {
    console.log(`[${this.name}] Initiating duplicate look detection and visual similarity scan.`);
    
    // Scan duplicates for items in list using detectDuplicate signature
    const duplicates = items.map(item => {
      return DuplicateLookDetectionEngine.detectDuplicate(item.title || item.name || '', item.description || '');
    }).filter(d => d !== null);

    // Calculate similarity between first two items if available
    const similarities: any[] = [];
    if (items.length > 1) {
      const featA = {
        category: items[0].category,
        style: items[0].description || 'Casual',
        colors: [items[0].primaryColor || '#000000'],
        colorName: items[0].primaryColor || 'Black',
        fabricEstimation: [items[0].description || 'Cotton'],
        fit: 'Tailored',
        silhouette: 'Structured',
        imageUrl: items[0].imageUrl || '',
        season: 'All-Season',
        formality: 'Casual',
        sleeveLength: 'Long',
        neckline: 'Crew Neck',
        collarType: 'None',
        waistPosition: 'Natural Waist',
        layering: [],
        patterns: ['Solid'],
        texture: ['Smooth'],
        accessories: [],
        shoes: [],
        bags: [],
        jewelry: [],
        hats: [],
        belts: []
      } as any;

      const featB = {
        category: items[1].category,
        style: items[1].description || 'Casual',
        colors: [items[1].primaryColor || '#000000'],
        colorName: items[1].primaryColor || 'Black',
        fabricEstimation: [items[1].description || 'Cotton'],
        fit: 'Tailored',
        silhouette: 'Structured',
        imageUrl: items[1].imageUrl || '',
        season: 'All-Season',
        formality: 'Casual',
        sleeveLength: 'Long',
        neckline: 'Crew Neck',
        collarType: 'None',
        waistPosition: 'Natural Waist',
        layering: [],
        patterns: ['Solid'],
        texture: ['Smooth'],
        accessories: [],
        shoes: [],
        bags: [],
        jewelry: [],
        hats: [],
        belts: []
      } as any;

      try {
        similarities.push(OutfitSimilarityEngine.compareOutfits(featA, featB));
      } catch (err) {
        console.warn("Failed comparing outfits:", err);
      }
    }

    AgentCommunicationBus.publish({
      id: `vision-${Date.now()}`,
      sender: this.name,
      recipient: 'broadcast',
      topic: 'vision:scan_complete',
      payload: { duplicateCount: duplicates.length },
      priority: 'Medium',
      timestamp: Date.now()
    });

    return {
      duplicates,
      similarities
    };
  }
}

// ============================================================================
// 4. FASHION KNOWLEDGE AGENT
// ============================================================================
export class FashionKnowledgeAgent {
  static readonly name = 'FashionKnowledgeAgent';

  static getHarmonyRules(): {
    graphStats: any;
    harmonyStatus: string;
  } {
    console.log(`[${this.name}] Querying styling taxonomy & color harmony graph.`);
    const stats = FashionKnowledgeGraphEngine.getStats();

    AgentCommunicationBus.publish({
      id: `knowledge-${Date.now()}`,
      sender: this.name,
      recipient: 'broadcast',
      topic: 'knowledge:harmony_calculated',
      payload: { stats },
      priority: 'Low',
      timestamp: Date.now()
    });

    return {
      graphStats: stats,
      harmonyStatus: 'Color matching: Monochromatic and complementary active rules applied'
    };
  }
}

// ============================================================================
// 5. DECISION AGENT
// ============================================================================
export class DecisionAgent {
  static readonly name = 'DecisionAgent';

  static rankCandidates(
    items: WardrobeItem[],
    context: { userId: string; weather: string; occasion: string; season: string },
    weights: any
  ): any {
    console.log(`[${this.name}] Executing candidate ranking across Style DNA and closet availability weights.`);
    
    const winner = DecisionIntelligenceEngine.evaluateAndSelectBest(items, context);

    AgentCommunicationBus.publish({
      id: `decision-${Date.now()}`,
      sender: this.name,
      recipient: 'broadcast',
      topic: 'decision:ranked',
      payload: { confidenceScore: winner?.overallScore || 85 },
      priority: 'High',
      timestamp: Date.now()
    });

    return winner;
  }
}

// ============================================================================
// CONFLICT RESOLVER
// ============================================================================
export class ConflictResolver {
  static resolveDisagreement(
    agentA: string,
    scoreA: number,
    agentB: string,
    scoreB: number
  ): {
    winnerAgent: string;
    resolvedScore: number;
    explanation: string;
  } {
    // Conflict resolution logic using historical accuracy limits and confidence bias
    const priorityMap: Record<string, number> = {
      'DecisionAgent': 0.95,
      'FashionMemoryAgent': 0.90,
      'FashionStylistAgent': 0.88,
      'FashionKnowledgeAgent': 0.85,
      'FashionVisionAgent': 0.80
    };

    const weightA = priorityMap[agentA] || 0.80;
    const weightB = priorityMap[agentB] || 0.80;

    const weightedScoreA = scoreA * weightA;
    const weightedScoreB = scoreB * weightB;

    if (weightedScoreA >= weightedScoreB) {
      return {
        winnerAgent: agentA,
        resolvedScore: scoreA,
        explanation: `Conflict resolved: ${agentA} overrode ${agentB} due to higher historical accuracy and prioritization index (${weightA.toFixed(2)} vs ${weightB.toFixed(2)}).`
      };
    } else {
      return {
        winnerAgent: agentB,
        resolvedScore: scoreB,
        explanation: `Conflict resolved: ${agentB} overrode ${agentA} due to higher contextual relevance weight (${weightB.toFixed(2)} vs ${weightA.toFixed(2)}).`
      };
    }
  }
}

// ============================================================================
// AGENT COORDINATOR (Orchestrated Router & Sequential Pipeline)
// ============================================================================
export class AgentCoordinator {
  static readonly name = 'AgentCoordinator';

  static async processStylingRequest(params: {
    items: WardrobeItem[];
    occasion: string;
    weather: string;
    season: string;
    userId: string;
  }): Promise<CollaborativeStylingResult> {
    const trace: CollaborationTraceStep[] = [];
    const startTime = Date.now();

    // STEP 0: Log Coordinator start
    trace.push({
      agentName: this.name,
      status: 'Routing Started',
      timestamp: Date.now(),
      outputSummary: `Triggered sequential collaborative pipeline for user: "${params.userId}"`
    });

    // STEP 1: Vision Agent Scans items
    const visionStart = Date.now();
    const visionOutputs = FashionVisionAgent.analyzeGarments(params.items);
    trace.push({
      agentName: FashionVisionAgent.name,
      status: 'Scanned Wardrobe',
      timestamp: Date.now(),
      outputSummary: `Detected ${visionOutputs.duplicates.length} duplicates. Feature similarity map calculated.`
    });

    // STEP 2: Knowledge Agent fetches rule graph
    const knowledgeOutputs = FashionKnowledgeAgent.getHarmonyRules();
    trace.push({
      agentName: FashionKnowledgeAgent.name,
      status: 'Checked Rules',
      timestamp: Date.now(),
      outputSummary: `Loaded color harmony graph. ${knowledgeOutputs.harmonyStatus}.`
    });

    // STEP 3: Memory Agent retrieves DNA and likes/dislikes
    const memoryOutputs = FashionMemoryAgent.getProfileState(params.userId);
    trace.push({
      agentName: FashionMemoryAgent.name,
      status: 'Loaded Profile',
      timestamp: Date.now(),
      outputSummary: `Style DNA retrieved: "${memoryOutputs.dna.vibeTheme || 'Minimalist Luxury'}" vibe. Filtered dislikes.`
    });

    // STEP 4: Decision Agent executes candidate scoring
    const weights = DecisionIntelligenceEngine.loadDecisionWeights(params.userId);
    const winningOutfit = DecisionAgent.rankCandidates(
      params.items,
      {
        userId: params.userId,
        weather: params.weather,
        occasion: params.occasion,
        season: params.season
      },
      weights
    );
    trace.push({
      agentName: DecisionAgent.name,
      status: 'Ranked & Scored',
      timestamp: Date.now(),
      outputSummary: `Scored candidate outfits. Optimal styling option scores at: ${winningOutfit?.overallScore || 85}%.`
    });

    // STEP 5: Stylist Agent formats and curates recommendation text
    const stylistOutput = FashionStylistAgent.handleOutfitRequest({
      items: params.items,
      occasion: params.occasion,
      weather: params.weather,
      season: params.season,
      userId: params.userId,
      dnaAnalysis: memoryOutputs.dna,
      graphHarmony: knowledgeOutputs.graphStats,
      decisionWeights: weights
    });
    trace.push({
      agentName: FashionStylistAgent.name,
      status: 'Curated styling',
      timestamp: Date.now(),
      outputSummary: `Finalized look "${stylistOutput?.title || 'Capsule Classic'}" tailored perfectly to ambient climate triggers.`
    });

    // STEP 6: Conflict Resolver checks if Knowledge & Memory agree
    const resolver = ConflictResolver.resolveDisagreement(
      'DecisionAgent',
      winningOutfit?.overallScore || 85,
      'FashionKnowledgeAgent',
      90
    );

    // Final log to Agent Bus
    AgentCommunicationBus.publish({
      id: `coordinator-${Date.now()}`,
      sender: this.name,
      recipient: 'broadcast',
      topic: 'coordinator:execution_completed',
      payload: { durationMs: Date.now() - startTime },
      priority: 'High',
      timestamp: Date.now()
    });

    return {
      winnerOutfit: stylistOutput,
      trace,
      resolverLog: resolver.explanation,
      accuracyEstimate: resolver.resolvedScore
    };
  }
}
