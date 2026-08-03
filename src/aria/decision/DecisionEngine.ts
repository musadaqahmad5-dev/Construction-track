/**
 * ARIA v2.5 Decision Intelligence Core Engine
 * Product: LOOK VISION v2.4
 */

import { 
  FashionRecommendation, 
  DecisionQueryRequest, 
  DecisionEngineStatus 
} from './DecisionTypes';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { RecommendationEngine } from './RecommendationEngine';
import { decisionHistoryManager } from './DecisionHistory';

export class DecisionEngine {
  private static instance: DecisionEngine;

  private userId?: string;
  private status: DecisionEngineStatus = {
    isInitialized: false,
    isProcessing: false,
    historyCount: 0,
    storageMode: 'offline_local'
  };

  private constructor() {}

  public static getInstance(): DecisionEngine {
    if (!DecisionEngine.instance) {
      DecisionEngine.instance = new DecisionEngine();
    }
    return DecisionEngine.instance;
  }

  /**
   * Initialize Decision Engine
   */
  public async initialize(userId?: string): Promise<DecisionEngineStatus> {
    this.userId = userId || 'guest_user';
    this.status.isProcessing = true;

    try {
      // Re-use MemoryEngine & StyleDNAEngine
      await memoryEngine.initialize(this.userId);
      await styleDNAEngine.initialize(this.userId);

      const history = await decisionHistoryManager.loadHistory(this.userId);

      this.status = {
        isInitialized: true,
        isProcessing: false,
        historyCount: history.length,
        storageMode: userId ? 'firestore' : 'offline_local',
        lastGeneratedAt: history[0]?.createdAt
      };
    } catch (err: any) {
      console.warn('[DecisionEngine] Initialization error, local fallback active:', err);
      this.status = {
        isInitialized: true,
        isProcessing: false,
        historyCount: decisionHistoryManager.getHistory().length,
        storageMode: 'offline_local',
        lastError: err.message || 'Decision engine fallback active'
      };
    }

    return this.status;
  }

  /**
   * Generates new recommendation using Memory + Style DNA + Request context
   */
  public async generateRecommendation(request?: DecisionQueryRequest): Promise<FashionRecommendation> {
    const activeUserId = this.userId || request?.userId || 'guest_user';
    this.status.isProcessing = true;

    // Retrieve active state from reused systems
    const memories = memoryEngine.getMemories();
    const styleDNA = styleDNAEngine.getProfile();

    const recommendation = RecommendationEngine.generateRecommendation(
      activeUserId,
      styleDNA,
      memories,
      request
    );

    await decisionHistoryManager.addRecommendation(activeUserId, recommendation);

    this.status = {
      isInitialized: true,
      isProcessing: false,
      historyCount: decisionHistoryManager.getHistory().length,
      storageMode: this.userId ? 'firestore' : 'offline_local',
      lastGeneratedAt: recommendation.createdAt
    };

    return recommendation;
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
    return { ...this.status };
  }
}

export const decisionEngine = DecisionEngine.getInstance();
