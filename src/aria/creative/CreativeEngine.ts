/**
 * ARIA v2.5 Creative Intelligence Engine Core
 * Product: LOOK VISION v2.4
 */

import { 
  CreativeConcept, 
  CreativeQueryRequest, 
  CreativeEngineStatus 
} from './CreativeTypes';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { decisionEngine } from '../decision/DecisionEngine';
import { CreativeConceptGenerator } from './CreativeConceptGenerator';
import { creativeHistoryManager } from './CreativeHistory';

export class CreativeEngine {
  private static instance: CreativeEngine;

  private userId?: string;
  private status: CreativeEngineStatus = {
    isInitialized: false,
    isGenerating: false,
    historyCount: 0,
    storageMode: 'offline_local'
  };

  private constructor() {}

  public static getInstance(): CreativeEngine {
    if (!CreativeEngine.instance) {
      CreativeEngine.instance = new CreativeEngine();
    }
    return CreativeEngine.instance;
  }

  /**
   * Initialize Creative Engine
   */
  public async initialize(userId?: string): Promise<CreativeEngineStatus> {
    this.userId = userId || 'guest_user';
    this.status.isGenerating = true;

    try {
      // Re-use MemoryEngine, StyleDNAEngine & DecisionEngine
      await memoryEngine.initialize(this.userId);
      await styleDNAEngine.initialize(this.userId);
      await decisionEngine.initialize(this.userId);

      const history = await creativeHistoryManager.loadHistory(this.userId);

      this.status = {
        isInitialized: true,
        isGenerating: false,
        historyCount: history.length,
        storageMode: userId ? 'firestore' : 'offline_local',
        lastGeneratedAt: history[0]?.createdAt
      };
    } catch (err: any) {
      console.warn('[CreativeEngine] Initialization warning, fallback active:', err);
      this.status = {
        isInitialized: true,
        isGenerating: false,
        historyCount: creativeHistoryManager.getHistory().length,
        storageMode: 'offline_local',
        lastError: err.message || 'Creative engine fallback active'
      };
    }

    return this.status;
  }

  /**
   * Generates new Creative Concept using Memory + Style DNA + Decision Intelligence
   */
  public async generateCreativeConcept(request?: CreativeQueryRequest): Promise<CreativeConcept> {
    const activeUserId = this.userId || request?.userId || 'guest_user';
    this.status.isGenerating = true;

    // Retrieve active state from reused systems
    const memories = memoryEngine.getMemories();
    const styleDNA = styleDNAEngine.getProfile();
    const decisions = await decisionEngine.getHistory();
    const latestDecision = decisions[0] || null;

    const concept = CreativeConceptGenerator.generateConcept(
      activeUserId,
      styleDNA,
      memories,
      latestDecision,
      request
    );

    await creativeHistoryManager.addConcept(activeUserId, concept);

    this.status = {
      isInitialized: true,
      isGenerating: false,
      historyCount: creativeHistoryManager.getHistory().length,
      storageMode: this.userId ? 'firestore' : 'offline_local',
      lastGeneratedAt: concept.createdAt
    };

    return concept;
  }

  /**
   * Get creative history
   */
  public async getHistory(): Promise<CreativeConcept[]> {
    const activeUserId = this.userId || 'guest_user';
    return await creativeHistoryManager.loadHistory(activeUserId);
  }

  /**
   * Delete concept
   */
  public async deleteConcept(creativeId: string): Promise<boolean> {
    const activeUserId = this.userId || 'guest_user';
    const success = await creativeHistoryManager.deleteConcept(activeUserId, creativeId);
    this.status.historyCount = creativeHistoryManager.getHistory().length;
    return success;
  }

  /**
   * Get Engine Status
   */
  public getStatus(): CreativeEngineStatus {
    return { ...this.status };
  }
}

export const creativeEngine = CreativeEngine.getInstance();
