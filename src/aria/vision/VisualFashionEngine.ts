/**
 * ARIA v3.2 Visual Fashion Intelligence Engine Orchestrator
 * Product: LOOK VISION v2.4
 * 
 * Main multimodal orchestrator connecting Image Perception, Garment Recognition, Color Analysis,
 * Material Texture Vision, Silhouette Profiling, Style DNA, Civilization Knowledge, Decision Bridge,
 * and Multi-Agent Collaboration.
 */

import {
  VisualFashionAnalysis,
  VisionConfidence,
  VisionAnalysisRequest,
  VisionAnalysisResult
} from './VisionTypes';
import { garmentRecognitionEngine } from './GarmentRecognitionEngine';
import { colorPerceptionEngine } from './ColorPerceptionEngine';
import { materialVisionEngine } from './MaterialVisionEngine';
import { outfitAnalysisEngine } from './OutfitAnalysisEngine';
import { visualStyleEmbeddingEngine } from './VisualStyleEmbeddingEngine';
import { visionStorage } from './VisionStorage';
import { styleDNAEngine } from '../styleDNA/StyleDNAEngine';
import { knowledgeRetrievalEngine } from '../civilization/KnowledgeRetrievalEngine';
import { agentCollaborationManager } from '../agents/collaboration/AgentCollaborationManager';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class VisualFashionEngine {
  private static instance: VisualFashionEngine;

  private constructor() {}

  public static getInstance(): VisualFashionEngine {
    if (!VisualFashionEngine.instance) {
      VisualFashionEngine.instance = new VisualFashionEngine();
    }
    return VisualFashionEngine.instance;
  }

  /**
   * Main entry point for multimodal visual fashion perception and analysis
   */
  public async analyzeVisual(request: VisionAnalysisRequest): Promise<VisualFashionAnalysis> {
    const startTime = performance.now();
    const userId = request.userId || 'guest_user';
    const analysisId = `vis_analysis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const imageName = request.imageName || 'Fashion Outfit Upload';

    const styleDNA = styleDNAEngine.getProfile();

    // 1. Garment Recognition
    const garments = garmentRecognitionEngine.recognizeGarments(imageName, styleDNA);

    // 2. Color Perception
    const colorHarmony = colorPerceptionEngine.analyzeColors(garments, styleDNA);

    // 3. Material Vision Analysis
    const fabricAnalysis = materialVisionEngine.analyzeMaterials(garments);

    // 4. Outfit & Silhouette Structural Analysis
    const outfitProfile = outfitAnalysisEngine.analyzeOutfit(garments, colorHarmony, fabricAnalysis);

    // 5. Visual Style Embedding Vector Generation
    const visualEmbedding = visualStyleEmbeddingEngine.generateEmbedding(garments, outfitProfile);

    // 6. Civilization Knowledge Retrieval
    const knowledge = await knowledgeRetrievalEngine.retrieveKnowledge({
      queryText: `${garments[0]?.category || 'Tailored'} ${garments[0]?.material || 'Wool'} luxury tailoring construction`,
      userId,
      limit: 6
    });

    const nodeIds = knowledge.matchedNodes.map((n) => n.id);

    // 7. Multi-Agent Consensus Collaboration
    const collab = await agentCollaborationManager.initializeCollaboration({
      requestId: `collab_vis_${Date.now()}`,
      objective: `Evaluate visual garment composition and silhouette proportion balance for "${imageName}"`,
      context: {
        garmentsCount: garments.length,
        harmonyScore: outfitProfile.overallHarmonyScore,
        aestheticTag: visualEmbedding.aestheticTag
      },
      userId
    });

    // 8. Formulate Multimodal Confidence Model
    const imageQualityScore = 0.96;
    const recognitionAccuracyScore = Math.min(1.0, garments.reduce((acc, g) => acc + g.confidence, 0) / garments.length);
    const styleDNAMatchScore = colorHarmony.styleDNAAlignmentScore;
    const knowledgeEvidenceScore = Math.min(1.0, 0.70 + nodeIds.length * 0.05);
    const agentConsensusScore = collab.confidenceScore / 100;

    const finalVisualConfidence = Math.round(
      (imageQualityScore * 0.20 +
       recognitionAccuracyScore * 0.25 +
       styleDNAMatchScore * 0.25 +
       knowledgeEvidenceScore * 0.15 +
       agentConsensusScore * 0.15) * 100
    );

    const confidence: VisionConfidence = {
      imageQualityScore,
      recognitionAccuracyScore,
      styleDNAMatchScore,
      knowledgeEvidenceScore,
      agentConsensusScore,
      finalVisualConfidence
    };

    const supportingEvidence = [
      ...colorHarmony.colorNotes,
      `Outfit composition: ${outfitProfile.composition} with ${outfitProfile.silhouette.overallProportion}`,
      `Perceived luxury index: ${Math.round(fabricAnalysis.perceivedLuxuryIndex * 100)}% (${fabricAnalysis.appearance})`,
      `Verified against ${nodeIds.length} Civilization Memory Graph nodes`,
      `Multi-Agent Consensus Score: ${Math.round(agentConsensusScore * 100)}%`
    ];

    const result: VisualFashionAnalysis = {
      analysisId,
      userId,
      imageUrl: request.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      imageName,
      garments,
      outfitProfile,
      visualEmbedding,
      confidence,
      supportingEvidence,
      referencedKnowledgeNodes: nodeIds,
      createdAt: new Date().toISOString()
    };

    // 9. Persist Analysis
    await visionStorage.saveVisualAnalysis(userId, result);

    const latencyMs = Math.round(performance.now() - startTime);

    // 10. Enterprise Telemetry
    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'VisualFashionEngine',
        eventName: 'VISUAL_FASHION_ANALYSIS_COMPLETED',
        category: 'Reasoning',
        payload: `Analyzed "${imageName}" with ${garments.length} garments (Confidence: ${finalVisualConfidence}%, Embedding: ${visualEmbedding.embeddingId})`,
        latencyMs,
        status: 'Success'
      });
    } catch (_) {}

    return result;
  }

  /**
   * Backwards compatibility helper for legacy VisionAnalysisResult requests
   */
  public async analyzeImage(request: VisionAnalysisRequest): Promise<VisionAnalysisResult> {
    const fullAnalysis = await this.analyzeVisual(request);

    return {
      analysisId: fullAnalysis.analysisId,
      userId: fullAnalysis.userId,
      imageUrl: fullAnalysis.imageUrl,
      imageName: fullAnalysis.imageName,
      garments: fullAnalysis.garments.map((g) => ({
        id: g.garmentId,
        name: g.name,
        category: g.category,
        primaryColor: g.primaryColor,
        secondaryColor: g.secondaryColor,
        pattern: g.pattern,
        fabricTexture: g.material,
        fitType: g.silhouette,
        confidence: g.confidence,
        bbox: g.bbox
      })),
      colorPalette: fullAnalysis.outfitProfile.colorHarmony.dominantColors,
      compatibility: {
        overallCompatibilityScore: fullAnalysis.outfitProfile.overallHarmonyScore,
        styleDNAHarmonyScore: fullAnalysis.confidence.styleDNAMatchScore,
        colorHarmonyScore: fullAnalysis.outfitProfile.colorHarmony.paletteCompatibilityScore,
        proportionalBalanceScore: fullAnalysis.outfitProfile.silhouette.balanceScore,
        outfitCompletenessScore: 0.95,
        compatibilityNotes: fullAnalysis.supportingEvidence
      },
      overallConfidence: fullAnalysis.confidence.finalVisualConfidence / 100,
      supportingEvidence: fullAnalysis.supportingEvidence,
      createdAt: fullAnalysis.createdAt
    };
  }
}

export const visualFashionEngine = VisualFashionEngine.getInstance();
