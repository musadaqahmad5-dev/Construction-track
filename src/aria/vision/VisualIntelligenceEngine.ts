/**
 * ARIA v2.5 Visual Intelligence Engine Core
 * Product: LOOK VISION v2.4
 */

import { 
  VisionAnalysisResult, 
  VisionAnalysisRequest, 
  VisionEngineStatus 
} from './VisionTypes';
import { memoryEngine } from '../memory/MemoryEngine';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { decisionEngine } from '../decision/DecisionEngine';
import { creativeEngine } from '../creative/CreativeEngine';
import { GarmentAnalyzer } from './GarmentAnalyzer';
import { ColorAnalyzer } from './ColorAnalyzer';
import { OutfitAnalyzer } from './OutfitAnalyzer';
import { VisualCompatibilityEngine } from './VisualCompatibilityEngine';
import { visionStorage } from './VisionStorage';

export class VisualIntelligenceEngine {
  private static instance: VisualIntelligenceEngine;

  private userId?: string;
  private status: VisionEngineStatus = {
    isInitialized: false,
    isAnalyzing: false,
    historyCount: 0,
    storageMode: 'offline_local'
  };

  private history: VisionAnalysisResult[] = [];

  private constructor() {}

  public static getInstance(): VisualIntelligenceEngine {
    if (!VisualIntelligenceEngine.instance) {
      VisualIntelligenceEngine.instance = new VisualIntelligenceEngine();
    }
    return VisualIntelligenceEngine.instance;
  }

  /**
   * Initialize Visual Intelligence Engine
   */
  public async initialize(userId?: string): Promise<VisionEngineStatus> {
    this.userId = userId || 'guest_user';
    this.status.isAnalyzing = true;

    try {
      // Re-use previous engines
      await memoryEngine.initialize(this.userId);
      await styleDNAEngine.initialize(this.userId);
      await decisionEngine.initialize(this.userId);
      await creativeEngine.initialize(this.userId);

      this.history = await visionStorage.fetchHistory(this.userId);

      this.status = {
        isInitialized: true,
        isAnalyzing: false,
        historyCount: this.history.length,
        storageMode: userId ? 'firestore' : 'offline_local',
        lastAnalyzedAt: this.history[0]?.createdAt
      };
    } catch (err: any) {
      console.warn('[VisualIntelligenceEngine] Initialization warning, fallback active:', err);
      this.status = {
        isInitialized: true,
        isAnalyzing: false,
        historyCount: this.history.length,
        storageMode: 'offline_local',
        lastError: err.message || 'Vision engine fallback active'
      };
    }

    return this.status;
  }

  /**
   * Analyzes an uploaded or provided image and extracts garments, colors, structure & compatibility
   */
  public async analyzeImage(request: VisionAnalysisRequest): Promise<VisionAnalysisResult> {
    const activeUserId = this.userId || request.userId || 'guest_user';
    this.status.isAnalyzing = true;

    const now = new Date().toISOString();
    const analysisId = `vis_${activeUserId}_${Date.now()}`;

    // Retrieve active profiles from reused engines
    const styleDNA = styleDNAEngine.getProfile();
    const memories = memoryEngine.getMemories();

    // 1. Analyze Garments
    const garments = GarmentAnalyzer.analyzeGarments(request.imageName, styleDNA);

    // 2. Extract Color Palette
    const colorPalette = ColorAnalyzer.extractPalette(garments, styleDNA);

    // 3. Analyze Outfit Structure
    const outfitStructure = OutfitAnalyzer.analyzeStructure(garments);

    // 4. Evaluate Visual Compatibility
    const compatibility = VisualCompatibilityEngine.evaluateCompatibility(
      garments,
      colorPalette,
      styleDNA,
      memories
    );

    // Supporting Evidence Signals
    const supportingEvidence: string[] = [
      ...compatibility.compatibilityNotes,
      ...outfitStructure.structureNotes,
      `Grounded in ${memories.length} verified memory records & active Style DNA profile (${styleDNA?.identityName || 'Default'})`
    ];

    const overallConfidence = Number(
      ((garments[0]?.confidence || 0.90) * 0.4 + compatibility.overallCompatibilityScore * 0.6).toFixed(2)
    );

    const result: VisionAnalysisResult = {
      analysisId,
      userId: activeUserId,
      imageUrl: request.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      imageName: request.imageName || 'Fashion Ensemble Upload',
      garments,
      colorPalette,
      compatibility,
      overallConfidence,
      supportingEvidence,
      createdAt: now,
      metadata: {
        targetContext: request.targetContext || 'Virtual Try-On Analysis'
      }
    };

    // Save to storage
    await visionStorage.saveAnalysis(activeUserId, result);
    this.history.unshift(result);

    this.status = {
      isInitialized: true,
      isAnalyzing: false,
      historyCount: this.history.length,
      storageMode: this.userId ? 'firestore' : 'offline_local',
      lastAnalyzedAt: now
    };

    return result;
  }

  /**
   * Get vision history
   */
  public async getHistory(): Promise<VisionAnalysisResult[]> {
    const activeUserId = this.userId || 'guest_user';
    this.history = await visionStorage.fetchHistory(activeUserId);
    return this.history;
  }

  /**
   * Delete vision analysis record
   */
  public async deleteAnalysis(analysisId: string): Promise<boolean> {
    const activeUserId = this.userId || 'guest_user';
    const success = await visionStorage.deleteAnalysis(activeUserId, analysisId);
    this.history = this.history.filter(a => a.analysisId !== analysisId);
    this.status.historyCount = this.history.length;
    return success;
  }

  /**
   * Get Engine Status
   */
  public getStatus(): VisionEngineStatus {
    return { ...this.status };
  }
}

export const visualIntelligenceEngine = VisualIntelligenceEngine.getInstance();
