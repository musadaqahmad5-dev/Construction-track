/**
 * ARIA v2.5 Contextual Outfit Decision Engine Orchestrator
 * Product: LOOK VISION v2.4
 * 
 * Contextual personal fashion decision engine evaluating user context, wardrobe state,
 * style evolution, and environmental factors to produce intelligent, explainable outfit decisions.
 */

import { 
  FashionRecommendation, 
  DecisionQueryRequest, 
  DecisionEngineStatus,
  ContextProfile,
  DecisionFeedbackActionType,
  RecommendationMetrics,
  OutfitComposition
} from './DecisionTypes';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { feedbackLearningLoop } from '../evolution/FeedbackLearningLoop';
import { RecommendationEngine } from './RecommendationEngine';
import { DecisionContextBuilder } from './DecisionContextBuilder';
import { decisionHistoryManager } from './DecisionHistory';
import { decisionStorage } from './DecisionStorage';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';
import { WardrobeSynergyEngine } from './WardrobeSynergyEngine';

export class DecisionEngine {
  private static instance: DecisionEngine;

  private userId: string = 'guest_user';
  private status: DecisionEngineStatus = {
    isInitialized: false,
    isProcessing: false,
    historyCount: 0,
    storageMode: 'offline_local'
  };

  private metrics: RecommendationMetrics = {
    userId: 'guest_user',
    totalDecisionsGenerated: 0,
    totalAccepted: 0,
    totalRejected: 0,
    totalModified: 0,
    acceptanceRate: 0.0,
    averageConfidence: 0.85,
    averageLatencyMs: 140,
    lastUpdated: new Date().toISOString()
  };

  private constructor() {}

  public static getInstance(): DecisionEngine {
    if (!DecisionEngine.instance) {
      DecisionEngine.instance = new DecisionEngine();
    }
    return DecisionEngine.instance;
  }

  /**
   * Initialize Decision Engine and restore metrics + history
   */
  public async initialize(userId?: string): Promise<DecisionEngineStatus> {
    this.userId = userId || 'guest_user';
    this.status.isProcessing = true;

    try {
      // Initialize core engines
      await memoryEngine.initialize(this.userId);
      await styleDNAEngine.initialize(this.userId);

      const history = await decisionHistoryManager.loadHistory(this.userId);
      this.metrics = await decisionStorage.fetchRecommendationMetrics(this.userId);

      this.status = {
        isInitialized: true,
        isProcessing: false,
        historyCount: history.length,
        storageMode: this.userId && this.userId !== 'guest_user' ? 'firestore' : 'offline_local',
        lastGeneratedAt: history[0]?.createdAt,
        metrics: this.metrics
      };

      EnterpriseObservabilityEngine.logTrace({
        engine: 'DecisionEngine',
        eventName: 'DECISION_ENGINE_INITIALIZED',
        category: 'Execution',
        payload: `Contextual Outfit Decision Engine online for user ${this.userId}. History count: ${history.length}`,
        latencyMs: 12,
        status: 'Success'
      });
    } catch (err: any) {
      console.warn('[DecisionEngine] Initialization warning, local fallback active:', err);
      this.status = {
        isInitialized: true,
        isProcessing: false,
        historyCount: decisionHistoryManager.getHistory().length,
        storageMode: 'offline_local',
        lastError: err.message || 'Local decision engine mode',
        metrics: this.metrics
      };
    }

    return this.status;
  }

  /**
   * Evaluates user context to build a ContextProfile (Task 1)
   */
  public evaluateContext(request?: DecisionQueryRequest): ContextProfile {
    const wardrobeCount = WardrobeSynergyEngine.getActiveWardrobeItems().length;
    return DecisionContextBuilder.buildContextProfile(request, wardrobeCount, this.userId);
  }

  /**
   * Generates new contextual recommendation with 8-factor scoring, reasoning, and wardrobe synergy (Tasks 1 - 4 & 6)
   */
  public async generateRecommendation(request?: DecisionQueryRequest): Promise<FashionRecommendation> {
    const startTime = performance.now();
    const activeUserId = this.userId || request?.userId || 'guest_user';
    this.status.isProcessing = true;

    // Retrieve active state from reused systems
    const memories = memoryEngine.getMemories();
    const styleDNA = styleDNAEngine.getProfile();

    // Generate recommendation using Contextual Decision Engine Pipeline
    const recommendation = RecommendationEngine.generateRecommendation(
      activeUserId,
      styleDNA,
      memories,
      request
    );

    // Persist recommendation
    await decisionHistoryManager.addRecommendation(activeUserId, recommendation);

    const latencyMs = Math.round(performance.now() - startTime);

    // Update Metrics
    this.metrics.totalDecisionsGenerated += 1;
    this.metrics.averageLatencyMs = Math.round((this.metrics.averageLatencyMs * 0.8) + (latencyMs * 0.2));
    this.metrics.averageConfidence = Number(((this.metrics.averageConfidence * 0.8) + (recommendation.confidence * 0.2)).toFixed(2));
    this.metrics.lastUpdated = new Date().toISOString();

    await decisionStorage.saveRecommendationMetrics(activeUserId, this.metrics);

    this.status = {
      isInitialized: true,
      isProcessing: false,
      historyCount: decisionHistoryManager.getHistory().length,
      storageMode: this.userId && this.userId !== 'guest_user' ? 'firestore' : 'offline_local',
      lastGeneratedAt: recommendation.createdAt,
      metrics: this.metrics
    };

    // Telemetry trace log
    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'DecisionEngine',
        eventName: 'DECISION_RECOMMENDATION_GENERATED',
        category: 'Prediction',
        payload: `Generated recommendation '${recommendation.title}' (Score: ${Math.round(recommendation.overallScore * 100)}/100, Confidence: ${Math.round(recommendation.confidence * 100)}%, Owned Ratio: ${Math.round((recommendation.reasoning?.ownedItemRatio || 1) * 100)}%)`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return recommendation;
  }

  /**
   * Records user feedback (accepted, rejected, modified) and feeds into FeedbackLearningLoop (Task 5)
   */
  public async recordDecisionFeedback(
    decisionId: string,
    actionType: DecisionFeedbackActionType,
    userNotes?: string,
    modifiedComposition?: OutfitComposition
  ): Promise<boolean> {
    const activeUserId = this.userId || 'guest_user';
    const history = decisionHistoryManager.getHistory();
    const decisionIndex = history.findIndex(r => r.recommendationId === decisionId);

    if (decisionIndex < 0) {
      console.warn(`[DecisionEngine] Decision ${decisionId} not found in history`);
      return false;
    }

    const decision = history[decisionIndex];
    decision.status = actionType;

    // Update Metrics (Task 5 & 6)
    if (actionType === 'accepted') {
      this.metrics.totalAccepted += 1;
    } else if (actionType === 'rejected') {
      this.metrics.totalRejected += 1;
    } else if (actionType === 'modified') {
      this.metrics.totalModified += 1;
      if (modifiedComposition && decision.reasoning) {
        decision.reasoning.outfitComposition = modifiedComposition;
      }
    }

    const totalActions = this.metrics.totalAccepted + this.metrics.totalRejected + this.metrics.totalModified;
    this.metrics.acceptanceRate = totalActions > 0 
      ? Number((this.metrics.totalAccepted / totalActions).toFixed(2)) 
      : 0.0;
    this.metrics.lastUpdated = new Date().toISOString();

    // Persist updated decision & metrics
    await decisionHistoryManager.addRecommendation(activeUserId, decision);
    await decisionStorage.saveRecommendationMetrics(activeUserId, this.metrics);

    // Feed signal into FeedbackLearningLoop (Task 5)
    try {
      const feedbackType = actionType === 'accepted' 
        ? 'rec_accepted' 
        : actionType === 'rejected' 
        ? 'rec_rejected' 
        : 'rec_accepted';

      const topColor = decision.reasoning?.outfitComposition.top?.color;
      const topCategory = decision.category || 'Outfit Recommendation';

      await feedbackLearningLoop.processFeedback(
        activeUserId,
        feedbackType,
        {
          colors: topColor ? [topColor] : undefined,
          category: topCategory,
          formality: decision.contextProfile?.formalityRequirement
        },
        decisionId,
        userNotes || `User marked recommendation as ${actionType}`
      );
    } catch (err) {
      console.warn('[DecisionEngine] Closed-loop feedback learning warning:', err);
    }

    // Telemetry trace log
    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'DecisionEngine',
        eventName: 'DECISION_FEEDBACK_PROCESSED',
        category: 'Learning',
        payload: `Recorded feedback '${actionType}' for decision ${decisionId}. Acceptance rate now: ${Math.round(this.metrics.acceptanceRate * 100)}%`,
        latencyMs: 10,
        status: 'Success'
      });
    } catch (_) {}

    return true;
  }

  /**
   * Get metrics summary
   */
  public getMetrics(): RecommendationMetrics {
    return { ...this.metrics };
  }

  /**
   * Get history of recommendations
   */
  public async getHistory(): Promise<FashionRecommendation[]> {
    const activeUserId = this.userId || 'guest_user';
    return await decisionHistoryManager.loadHistory(activeUserId);
  }

  /**
   * Delete recommendation from history
   */
  public async deleteRecommendation(recommendationId: string): Promise<boolean> {
    const activeUserId = this.userId || 'guest_user';
    const success = await decisionHistoryManager.deleteRecommendation(activeUserId, recommendationId);
    this.status.historyCount = decisionHistoryManager.getHistory().length;
    return success;
  }

  /**
   * Get Engine Status
   */
  public getStatus(): DecisionEngineStatus {
    return { 
      ...this.status,
      metrics: { ...this.metrics }
    };
  }
}

export const decisionEngine = DecisionEngine.getInstance();
