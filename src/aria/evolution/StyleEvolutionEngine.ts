/**
 * ARIA v2.5 Style Evolution Engine Core Orchestrator
 * Main orchestrator for Personal Fashion Intelligence, Evolution Tracking, and Feedback Learning.
 * Product: LOOK VISION v2.4
 */

import {
  StyleEvolutionSnapshot,
  StyleEvolutionTimeline,
  UserFeedbackEvent,
  FeedbackType,
  RecommendationScoreRequest,
  RecommendationConfidenceResult,
  IntelligenceSummary
} from './StyleEvolutionTypes';
import { styleEvolutionTracker } from './StyleEvolutionTracker';
import { ConfidenceScoringEngine } from './ConfidenceScoringEngine';
import { feedbackLearningLoop } from './FeedbackLearningLoop';
import { recommendationIntelligenceEngine } from './RecommendationIntelligenceEngine';
import { styleEvolutionStorage } from './StyleEvolutionStorage';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { PersonalFashionMemoryEngine } from '../../engine/personalMemory';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class StyleEvolutionEngine {
  private static instance: StyleEvolutionEngine;
  private userId?: string;
  private summaryCache: IntelligenceSummary | null = null;

  private constructor() {}

  public static getInstance(): StyleEvolutionEngine {
    if (!StyleEvolutionEngine.instance) {
      StyleEvolutionEngine.instance = new StyleEvolutionEngine();
    }
    return StyleEvolutionEngine.instance;
  }

  /**
   * Initializes the Style Evolution Engine for active user
   */
  public async initialize(userId: string): Promise<IntelligenceSummary> {
    this.userId = userId || 'guest_user';

    // 1. Fetch existing intelligence summary or compute initial summary
    let summary = await styleEvolutionStorage.fetchIntelligenceSummary(this.userId);
    if (!summary) {
      summary = await this.computeIntelligenceSummary();
    }

    this.summaryCache = summary;

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'StyleEvolutionEngine',
        eventName: 'STYLE_EVOLUTION_ENGINE_INITIALIZED',
        category: 'Learning',
        payload: `Initialized Style Evolution Engine for user ${this.userId}. Overall confidence: ${summary.overallConfidence}, evolutions: ${summary.totalEvolutions}`,
        latencyMs: 8,
        status: 'Success'
      });
    } catch (_) {}

    return summary;
  }

  /**
   * Computes up-to-date intelligence summary
   */
  public async computeIntelligenceSummary(): Promise<IntelligenceSummary> {
    const activeUid = this.userId || 'guest_user';
    const profile = styleDNAEngine.getProfile();
    const memory = PersonalFashionMemoryEngine.getMemory(activeUid);
    const feedbackHistory = await styleEvolutionStorage.fetchFeedbackHistory(activeUid);
    const timeline = await styleEvolutionTracker.getEvolutionTimeline(activeUid);

    const overallConfidence = profile?.overallConfidence || 0.7;
    const topColors = (memory.favColors || []).slice(0, 5);
    const topGarments = (memory.favGarmentTypes || []).slice(0, 5);
    const topBrands = (memory.favBrands || []).slice(0, 5);
    const dislikedColors = (memory.dislikes?.colors || []).slice(0, 5);
    const dislikedGarments = (memory.dislikes?.garments || []).slice(0, 5);

    const summary: IntelligenceSummary = {
      userId: activeUid,
      overallConfidence,
      totalFeedbackProcessed: feedbackHistory.length,
      totalEvolutions: timeline.totalEvolutions,
      lastCalculatedAt: new Date().toISOString(),
      primaryIdentityName: profile?.identityName || 'Quiet Luxury DNA',
      topColors,
      topGarments,
      topBrands,
      dislikedColors,
      dislikedGarments
    };

    this.summaryCache = summary;
    await styleEvolutionStorage.saveIntelligenceSummary(activeUid, summary);

    return summary;
  }

  /**
   * Processes feedback learning event
   */
  public async recordFeedback(
    feedbackType: FeedbackType,
    attributes: {
      colors?: string[];
      garments?: string[];
      brands?: string[];
      materials?: string[];
      styleVibe?: string;
      formality?: number;
      category?: string;
    },
    itemId?: string,
    userNote?: string
  ): Promise<UserFeedbackEvent> {
    const activeUid = this.userId || 'guest_user';
    const event = await feedbackLearningLoop.processFeedback(
      activeUid,
      feedbackType,
      attributes,
      itemId,
      userNote
    );

    // Refresh intelligence summary
    await this.computeIntelligenceSummary();

    return event;
  }

  /**
   * Evaluates recommendation confidence score
   */
  public evaluateRecommendation(
    request: RecommendationScoreRequest
  ): RecommendationConfidenceResult {
    const result = recommendationIntelligenceEngine.evaluateRecommendation(request);

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'StyleEvolutionEngine',
        eventName: 'RECOMMENDATION_SCORE_GENERATED',
        category: 'Prediction',
        payload: `Generated recommendation score ${result.recommendationScore}% (${result.recommendationLevel}) for user ${request.userId}`,
        latencyMs: 15,
        status: 'Success'
      });
    } catch (_) {}

    return result;
  }

  /**
   * Gets evolution timeline history
   */
  public async getEvolutionTimeline(): Promise<StyleEvolutionTimeline> {
    const activeUid = this.userId || 'guest_user';
    return await styleEvolutionTracker.getEvolutionTimeline(activeUid);
  }

  /**
   * Returns current Intelligence Summary
   */
  public getIntelligenceSummary(): IntelligenceSummary | null {
    return this.summaryCache;
  }

  /**
   * Formats intelligence context for Gemini AI prompt enrichment
   */
  public getPromptFormattedIntelligence(): string {
    const s = this.summaryCache;
    if (!s) return "DYNAMIC INTELLIGENCE: Initializing learning loops...";

    const lines = [
      `DYNAMIC INTELLIGENCE SUMMARY (Confidence: ${Math.round(s.overallConfidence * 100)}%, Total Feedback: ${s.totalFeedbackProcessed}):`,
      `• Primary Identity: "${s.primaryIdentityName}"`,
      s.topColors.length > 0 ? `• High Affinity Colors: ${s.topColors.join(', ')}` : '',
      s.topGarments.length > 0 ? `• High Affinity Garments: ${s.topGarments.join(', ')}` : '',
      s.topBrands.length > 0 ? `• High Affinity Brands: ${s.topBrands.join(', ')}` : '',
      s.dislikedColors.length > 0 ? `• Negative Filter (Disliked Colors): ${s.dislikedColors.join(', ')}` : '',
      s.dislikedGarments.length > 0 ? `• Negative Filter (Disliked Silhouettes): ${s.dislikedGarments.join(', ')}` : ''
    ].filter(Boolean);

    return lines.join('\n');
  }
}

export const styleEvolutionEngine = StyleEvolutionEngine.getInstance();
