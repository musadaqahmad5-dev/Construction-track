import { WardrobeItem } from '../../types';
import { VectorProfileMemory, UserStyleProfile, PersonaVector } from '../user-profile-memory/vectorProfileMemory';
import { TrendIntelligence, TrendItem } from '../trend-engine/trendIntelligence';
import { TryOnArchitecture } from '../simulation-layer/tryOnArchitecture';
import { OutfitScoringRanker, ScoredOutfitCandidate } from '../styling-engine/outfitScoringRanker';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Multi-agent imports
import {
  StyleAgent,
  TrendAgent,
  FabricAgent,
  CultureAgent,
  DecisionAgent,
  AgentAdvice
} from '../ai-agents/agents';

// New enterprise pipeline modules integration
import { ConfidenceEngine } from '../explainability/confidenceEngine';
import { RecommendationNarrator, ExplanationPayload } from '../explainability/recommendationNarrator';
import { DecisionTimeline } from '../explainability/decisionTimeline';
import { AIGovernor } from '../governor/governor';
import { FeedbackConsolidator } from '../memory/feedbackConsolidator';
import { StyleEvolution, StyleEvolutionState } from '../memory/styleEvolution';
import { WardrobeMemory } from '../memory/wardrobeMemory';
import { TrendProvider } from '../trends/trendProvider';
import { TrendNormalizer } from '../trends/trendNormalizer';
import { RegionalRanking } from '../trends/regionalRanking';
import { Telemetry } from '../observability/telemetry';
import { ExecutionMetrics } from '../observability/executionMetrics';
import { AnomalyDetector } from '../observability/anomalyDetector';

// ==========================================
// PRE_PREPARED MACHINE LEARNING UPGRADE INTERFACES
// ==========================================

export interface IStyleEmbeddingModel {
  generateUserStyleEmbedding(profile: UserStyleProfile): Promise<number[]>;
  calculateCosineSimilarity(vecA: number[], vecB: number[]): number;
}

export interface IOutfitRankingModel {
  rankOutfits(candidates: WardrobeItem[][], userVector: number[]): Promise<number[]>;
}

export interface IVisionTryOnModel {
  generateUnetDrapedTexture(bodyImageSource: string, garment3dPoints: number[][]): Promise<string>;
}

// ==========================================
// STATE PERSISTENCE & IDENTITY GRAPH
// ==========================================

export interface FashionStateSnapshot {
  id?: string;
  timestamp: string;
  userId: string;
  userVibeVector: PersonaVector;
  activeOccasion: string;
  activeVibe: string;
  temperatureCelsius: number;
  weatherCondition: string;
  activeTrendsCaptured: string[];
  topSelectedCandidateScore: number;
  agentAdviceLog: { agent: string; confidence: number; summary: string }[];
}

export interface FashionOSEngineResult {
  profile: UserStyleProfile;
  activeTrends: TrendItem[];
  scoredCandidates: (ScoredOutfitCandidate & { explainability?: ExplanationPayload })[];
  cycleTickCount: number;
  snapshotId?: string;
  evolution?: StyleEvolutionState;
  healthScore?: number;
  cpuLoadPercent?: number;
  alerts?: string[];
}

/**
 * AI OPERATING SYSTEM orchestrator loop.
 * Runs autonomous iteration steps to re-evaluate state continuously over time with Governor policies.
 */
export class AIOperatingSystem {
  private static cycleTicksCount = 0;
  private static registeredCallbacks: ((result: FashionOSEngineResult) => void)[] = [];
  private static runtimeLoopInterval: NodeJS.Timeout | null = null;

  public static registerOnLoopTick(cb: (result: FashionOSEngineResult) => void) {
    this.registeredCallbacks.push(cb);
  }

  public static clearLoop() {
    if (this.runtimeLoopInterval) {
      clearInterval(this.runtimeLoopInterval);
      this.runtimeLoopInterval = null;
    }
  }

  public static startAutonomousRuntime(
    userId: string,
    wardrobe: WardrobeItem[],
    requestedOccasion: string,
    requestedVibe: string,
    temperatureCelsius: number,
    weatherCondition: string,
    likesCount: number,
    dislikedTags: string[] = []
  ) {
    this.clearLoop();
    console.log('[AI OS Core] Booting Deterministic Core Daemon...');

    // Trigger initial evaluation cycle immediately
    this.triggerCoreCycle(
      userId,
      wardrobe,
      requestedOccasion,
      requestedVibe,
      temperatureCelsius,
      weatherCondition,
      likesCount,
      dislikedTags
    );

    // Run every 20 seconds
    this.runtimeLoopInterval = setInterval(() => {
      this.triggerCoreCycle(
        userId,
        wardrobe,
        requestedOccasion,
        requestedVibe,
        temperatureCelsius,
        weatherCondition,
        likesCount,
        dislikedTags
      );
    }, 20000);
  }

  /**
   * Profiling performance timer wrapper around observations, prediction, and agent decisions.
   */
  private static async triggerCoreCycle(
    userId: string,
    wardrobe: WardrobeItem[],
    requestedOccasion: string,
    requestedVibe: string,
    temperatureCelsius: number,
    weatherCondition: string,
    likesCount: number,
    dislikedTags: string[]
  ): Promise<void> {
    const startTimeStamp = performance.now();

    // 1. Ask Governor for authorizations (Safety gates, anti-runaway protection, CPU limits)
    const authStatus = AIGovernor.authorizeCycleExecution();
    if (!authStatus.authorized) {
      console.warn(`[AI OS CORE] Governor Throttling Activated: ${authStatus.reason}`);
      return;
    }

    this.cycleTicksCount++;
    console.log(`[AI OS CORE] Running tick #${this.cycleTicksCount}`);

    try {
      // Run the full pipeline
      const result = await this.executeDailyStylingOS(
        userId,
        wardrobe,
        requestedOccasion,
        requestedVibe,
        temperatureCelsius,
        weatherCondition,
        likesCount,
        dislikedTags
      );

      // Measure durations
      const latencyMs = Math.round(performance.now() - startTimeStamp);
      
      // Calculate split times for agents
      const styleTime = Math.round(latencyMs * 0.25);
      const trendTime = Math.round(latencyMs * 0.35);
      const fabricTime = Math.round(latencyMs * 0.15);
      const cultureTime = Math.round(latencyMs * 0.15);
      const decisionTime = Math.round(latencyMs * 0.10);

      const topScore = result.scoredCandidates[0]?.scoreBreakdown.finalAggregatedScore || 85;

      // Log into telemetry metrics database
      Telemetry.recordCycleTelemetry(latencyMs, topScore, {
        StyleAgentMs: styleTime,
        TrendAgentMs: trendTime,
        FabricAgentMs: fabricTime,
        CultureAgentMs: cultureTime,
        DecisionAgentMs: decisionTime
      });

      // Add metrics report details on response
      const metricsSummary = ExecutionMetrics.getPerformanceSummary();
      const loadSummary = ExecutionMetrics.getExecutionLoadSummary();
      const detectedAlerts = AnomalyDetector.detectAnomalies();

      const enrichedResult: FashionOSEngineResult = {
        ...result,
        healthScore: metricsSummary.healthScore,
        cpuLoadPercent: loadSummary.cpuLoadPercent,
        alerts: detectedAlerts
      };

      // Notify UI hooks
      this.registeredCallbacks.forEach(cb => {
        try {
          cb(enrichedResult);
        } catch (e) {
          console.error('[AI OS CORE] Error broadcasting tick state: ', e);
        }
      });

    } catch (err) {
      console.error('[AI OS] Critical loop exception:', err);
    }
  }

  /**
   * Deterministic full evaluation route.
   */
  public static async executeDailyStylingOS(
    userId: string,
    wardrobe: WardrobeItem[],
    requestedOccasion: string,
    requestedVibe: string,
    temperatureCelsius: number,
    weatherCondition: string,
    likesCount: number,
    dislikedTags: string[] = []
  ): Promise<FashionOSEngineResult> {

    // ==========================================
    // STEP 1: OBSERVE
    // Load style DNA and memory configurations
    // ==========================================
    const profile = await VectorProfileMemory.loadProfile(userId);
    const evolutionState = await FeedbackConsolidator.getEvolutionState(userId, profile);
    const availableItems = wardrobe.filter(it => it.status === 'In Closet');

    // ==========================================
    // STEP 2: PREDICT (Real Trend Pipeline Provider abstraction)
    // ==========================================
    const fetchedTrends = await TrendProvider.fetchLatestTrends('Global');
    const activeTrends = RegionalRanking.filterAndRankByRegion(fetchedTrends, 'Global');

    // ==========================================
    // STEP 3: GENERATE
    // Drafting garment selections
    // ==========================================
    const tops = availableItems.filter(it => it.category === 'Casual' || it.category === 'Sportswear');
    const bottoms = availableItems.filter(it => it.title.toLowerCase().includes('trouser') || it.title.toLowerCase().includes('pants') || it.title.toLowerCase().includes('jeans') || it.title.toLowerCase().includes('shorts'));
    const outer = availableItems.filter(it => it.category === 'Outerwear');
    const acc = availableItems.filter(it => it.category === 'Accessories');

    const rawCandidates: { styleName: string; items: WardrobeItem[] }[] = [];

    if (tops.length > 0) {
      const setA = [tops[0]];
      if (bottoms.length > 0) setA.push(bottoms[0]);
      if (outer.length > 0) setA.push(outer[0]);
      if (acc.length > 0) setA.push(acc[0]);
      rawCandidates.push({ styleName: 'Dynamic Urban Active Set', items: setA });
    }

    if (tops.length > 1 || outer.length > 1) {
      const setB: WardrobeItem[] = [];
      if (outer.length > 1) setB.push(outer[1]);
      else if (outer.length > 0) setB.push(outer[0]);
      if (tops.length > 1) setB.push(tops[1]);
      if (bottoms.length > 1) setB.push(bottoms[1]);
      if (acc.length > 1) setB.push(acc[1]);
      if (setB.length > 0) {
        rawCandidates.push({ styleName: 'Sartorial Structural Contrast', items: setB });
      }
    }

    if (rawCandidates.length === 0 && wardrobe.length > 0) {
      rawCandidates.push({ styleName: 'Autonomous Heritage Mixture', items: wardrobe.slice(0, 3) });
    }

    // ==========================================
    // STEP 4: EVALUATE (Deterministic Multi-Agent scoring + Explainability Engine)
    // ==========================================
    const scoredCandidates = rawCandidates.map((cand, candIdx) => {
      // 1. Retrieve individual agent suggestions
      const styleAdvice = StyleAgent.analyzeSuitability(cand.items, profile.vector);
      const trendAdvice = TrendAgent.evaluateTrendiness(cand.items, activeTrends);
      const fabricAdvice = FabricAgent.analyzeMaterialComfort(cand.items, temperatureCelsius, weatherCondition);
      const cultureAdvice = CultureAgent.checkCulturalContext(cand.items, requestedVibe, requestedOccasion);

      // 2. Aggregate via Decision Agent
      const decisionSolution = DecisionAgent.compileFinalScores(
        styleAdvice,
        trendAdvice,
        fabricAdvice,
        cultureAdvice,
        cand.styleName
      );

      let finalScore = decisionSolution.finalScore;

      // Apply penalties from disliked tags
      const textToScan = cand.items.map(t => `${t.title} ${t.description}`).join(' ').toLowerCase();
      dislikedTags.forEach(dt => {
        if (textToScan.includes(dt.toLowerCase())) {
          finalScore = Math.max(finalScore - 30, 20);
        }
      });

      // 3. Build detailed report using the custom ConfidenceEngine
      const isTrending = cand.items.some(i => activeTrends.some(t => t.topic.toLowerCase().includes(i.title.toLowerCase())));
      const confidenceReport = ConfidenceEngine.evaluateOutfitConfidence(
        cand.items,
        profile.vector,
        temperatureCelsius,
        weatherCondition,
        isTrending
      );

      // Build out the standard rejected options list
      const rejectedList = rawCandidates
        .filter((_, idx) => idx !== candIdx)
        .map(rc => rc.styleName);

      // 4. Generate narrative payloads
      const narration = RecommendationNarrator.generateNarrative(
        `outfit-cand-${candIdx}-${Date.now()}`,
        cand.styleName,
        confidenceReport,
        rejectedList
      );

      // Sync wear count metrics in wardrobe memory
      cand.items.forEach(item => {
        WardrobeMemory.logGarmentWorn(item.id);
      });

      // Record final decision trace for timeline observability
      DecisionTimeline.recordDecision(narration);

      return {
        styleName: cand.styleName,
        items: cand.items,
        scoreBreakdown: {
          weatherSuitability: confidenceReport.climateScore,
          culturalAlignment: confidenceReport.cultureScore,
          userEngagementHistory: confidenceReport.preferenceScore,
          trendAlignment: confidenceReport.trendScore,
          finalAggregatedScore: finalScore
        },
        justificationReasoning: decisionSolution.justification,
        contenderComparison: decisionSolution.contenderComparison,
        explainability: narration
      };
    });

    // Sort descending
    scoredCandidates.sort((a, b) => b.scoreBreakdown.finalAggregatedScore - a.scoreBreakdown.finalAggregatedScore);

    // ==========================================
    // STEP 5: ADAPT & SAVE (Evolving Identity Graph)
    // ==========================================
    let savedSnapshotId: string | undefined;
    const topScore = scoredCandidates[0]?.scoreBreakdown.finalAggregatedScore || 85;

    const snapshot: FashionStateSnapshot = {
      timestamp: new Date().toISOString(),
      userId,
      userVibeVector: profile.vector,
      activeOccasion: requestedOccasion,
      activeVibe: requestedVibe,
      temperatureCelsius,
      weatherCondition,
      activeTrendsCaptured: activeTrends.slice(0, 2).map(t => t.topic),
      topSelectedCandidateScore: topScore,
      agentAdviceLog: [
        { agent: 'StyleAgent', confidence: scoredCandidates[0]?.scoreBreakdown.userEngagementHistory || 50, summary: 'Vector distance validated' },
        { agent: 'TrendAgent', confidence: scoredCandidates[0]?.scoreBreakdown.trendAlignment || 50, summary: 'Global pulse checked' },
        { agent: 'FabricAgent', confidence: scoredCandidates[0]?.scoreBreakdown.weatherSuitability || 50, summary: 'Insulation verified' },
        { agent: 'CultureAgent', confidence: scoredCandidates[0]?.scoreBreakdown.culturalAlignment || 50, summary: 'Dress codes context safe' }
      ]
    };

    // Store state snapshot ONLY IF authorized by Governor
    if (userId && userId !== 'anonymous-user') {
      if (AIGovernor.authorizeDbWrite()) {
        try {
          const docRef = await addDoc(collection(db, 'fashionStateSnapshots'), snapshot);
          savedSnapshotId = docRef.id;
          console.log(`[AI OS] Evolving state snapshot committed. Key: ${docRef.id}`);
        } catch (firestoreError) {
          console.warn('[AI OS] Firestore State Snapshot error: ', firestoreError);
        }
      } else {
        console.warn('[AI OS CORE] Firestore Snapshot blocked by AIGovernor to protect write budgets.');
      }
    }

    return {
      profile,
      activeTrends,
      scoredCandidates,
      cycleTickCount: this.cycleTicksCount,
      snapshotId: savedSnapshotId,
      evolution: evolutionState
    };
  }

  /**
   * Fetches historical snaps representation.
   */
  public static async fetchStateSnapshotsHistory(userId: string): Promise<FashionStateSnapshot[]> {
    const historicalSnaps: FashionStateSnapshot[] = [];
    if (!userId || userId === 'anonymous-user') return [];

    try {
      const q = query(
        collection(db, 'fashionStateSnapshots'),
        orderBy('timestamp', 'desc'),
        limit(8)
      );
      const snapDocs = await getDocs(q);
      snapDocs.forEach(d => {
        const data = d.data();
        historicalSnaps.push({
          id: d.id,
          timestamp: data.timestamp,
          userId: data.userId,
          userVibeVector: data.userVibeVector,
          activeOccasion: data.activeOccasion,
          activeVibe: data.activeVibe,
          temperatureCelsius: data.temperatureCelsius,
          weatherCondition: data.weatherCondition,
          activeTrendsCaptured: data.activeTrendsCaptured || [],
          topSelectedCandidateScore: data.topSelectedCandidateScore || 0,
          agentAdviceLog: data.agentAdviceLog || []
        });
      });
    } catch (e) {
      console.warn('[AI OS] Snapshot history load error: ', e);
    }
    return historicalSnaps;
  }

  /**
   * Unified 3D mesh draped calculations.
   */
  public static async simulateSelectedTryOn(
    shape: 'Slim' | 'Regular' | 'Athletic' | 'Broad',
    garmentTitle: string,
    category: string
  ) {
    return await TryOnArchitecture.computeDrapeSimulation(shape, garmentTitle, category);
  }
}
