/**
 * ARIA Experience Controller
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 * 
 * Manages frontend ARIA user journeys, state synchronization, and execution routing.
 */

import {
  ARIAExperienceState,
  ARIAConversationMessage,
  ARIARecommendationCard,
  ARIAVisualInsight,
  ARIAOutfitResult,
  ARIAExperienceTelemetry
} from './ARIAExperienceTypes';
import { ariaService } from '../../services/ariaService';
import { ariaRuntime } from '../../aria/runtime/ARIARuntime';
import { ARIAResponse, ARIAIntent } from '../../aria/orchestrator/ARIAOrchestratorTypes';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class ARIAExperienceController {
  private static instance: ARIAExperienceController;

  private state: ARIAExperienceState = {
    isInitialized: false,
    isProcessing: false,
    activeTab: 'CHAT',
    conversationHistory: [],
    totalInteractions: 0
  };

  private listeners: Set<(state: ARIAExperienceState) => void> = new Set();

  private constructor() {}

  public static getInstance(): ARIAExperienceController {
    if (!ARIAExperienceController.instance) {
      ARIAExperienceController.instance = new ARIAExperienceController();
    }
    return ARIAExperienceController.instance;
  }

  public subscribe(listener: (state: ARIAExperienceState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private updateState(partial: Partial<ARIAExperienceState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  /**
   * Initializes experience runtime layer
   */
  public async initializeExperience(userId = 'guest_user'): Promise<void> {
    if (this.state.isInitialized) return;

    this.updateState({ isProcessing: true });
    await ariaRuntime.initialize(userId);

    const welcomeMsg: ARIAConversationMessage = {
      id: `msg_init_${Date.now()}`,
      sender: 'ARIA',
      text: 'Greetings. I am ARIA (Autonomous Fashion Intelligence). How may I elevate your sartorial vision today?',
      timestamp: new Date().toISOString()
    };

    this.updateState({
      isInitialized: true,
      isProcessing: false,
      conversationHistory: [welcomeMsg]
    });

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'ARIAExperienceController',
        eventName: 'EXPERIENCE_INITIALIZED',
        category: 'Execution',
        payload: `ARIA Experience Controller initialized for user "${userId}"`,
        latencyMs: 10,
        status: 'Success'
      });
    } catch (_) {}
  }

  /**
   * Handles general conversational user message
   */
  public async sendMessage(userPrompt: string, userId = 'guest_user'): Promise<ARIAResponse> {
    const startTime = performance.now();
    const userMsgId = `msg_user_${Date.now()}`;
    const userMsg: ARIAConversationMessage = {
      id: userMsgId,
      sender: 'USER',
      text: userPrompt,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...this.state.conversationHistory, userMsg];
    this.updateState({
      isProcessing: true,
      conversationHistory: updatedHistory,
      errorMessage: undefined
    });

    try {
      const response = await ariaService.sendARIARequest({
        userPrompt,
        userId
      });

      const ariaMsg: ARIAConversationMessage = {
        id: `msg_aria_${Date.now()}`,
        sender: 'ARIA',
        text: response.summary,
        timestamp: new Date().toISOString(),
        intent: response.intent,
        responsePayload: response,
        reasoningTraces: response.reasoningTraces,
        confidenceReport: response.confidenceReport
      };

      const latencyMs = Math.round(performance.now() - startTime);

      this.updateState({
        isProcessing: false,
        conversationHistory: [...updatedHistory, ariaMsg],
        rawLastResponse: response,
        totalInteractions: this.state.totalInteractions + 1
      });

      this.logTelemetry({
        traceId: response.responseId,
        actionName: 'SEND_MESSAGE',
        intent: response.intent,
        latencyMs,
        confidenceScore: response.confidenceReport.finalConfidence,
        activeEngines: response.reasoningTraces.map((t) => t.engineName),
        timestamp: new Date().toISOString(),
        success: true
      });

      return response;
    } catch (err: any) {
      const errorText = err?.message || 'Error processing ARIA request';
      this.updateState({
        isProcessing: false,
        errorMessage: errorText
      });
      throw err;
    }
  }

  /**
   * Journey 1 & 3: Request Outfit Recommendation
   */
  public async requestOutfitRecommendation(
    userPrompt: string,
    occasion = 'Daily Executive',
    weatherContext = 'Mild',
    userId = 'guest_user'
  ): Promise<ARIARecommendationCard> {
    this.updateState({ isProcessing: true });
    const response = await ariaService.getStyleRecommendation(userPrompt, occasion, weatherContext);

    const rec = response.recommendation;
    const card: ARIARecommendationCard = {
      title: rec?.title || 'Sartorial Luxury Ensemble',
      outfitItems: rec?.suggestedItems && rec.suggestedItems.length > 0 ? rec.suggestedItems : ['Custom Tailored Blazer', 'Pleated Trousers', 'Silk Shirt'],
      styleReasoning: response.reasoningTraces.map((t) => `${t.engineName}: ${t.reasoningSummary}`),
      confidenceScore: response.confidenceReport.finalConfidence,
      matchFactors: [
        { factorName: 'Style DNA Harmony', score: response.confidenceReport.styleDNAMatch },
        { factorName: 'Visual Composition', score: response.confidenceReport.visualHarmony || 90 },
        { factorName: 'Civilization Evidence', score: response.confidenceReport.knowledgeEvidence },
        { factorName: 'Agent Consensus', score: response.confidenceReport.agentConsensus }
      ],
      occasion,
      weatherContext
    };

    this.updateState({
      isProcessing: false,
      currentRecommendation: card,
      rawLastResponse: response,
      activeTab: 'RECOMMENDATIONS',
      totalInteractions: this.state.totalInteractions + 1
    });

    return card;
  }

  /**
   * Journey 2: Analyze Fashion Image
   */
  public async analyzeFashionImage(
    imageName: string,
    imageUrl?: string,
    userPrompt?: string,
    userId = 'guest_user'
  ): Promise<ARIAVisualInsight> {
    this.updateState({ isProcessing: true });
    const response = await ariaService.analyzeFashionImage(imageName, imageUrl, userPrompt);

    const vis = response.visionAnalysis;
    const insight: ARIAVisualInsight = {
      imageName,
      detectedGarments: vis?.garments
        ? vis.garments.map((g) => ({
            item: g.name,
            category: g.category,
            confidence: Math.round(g.confidence * 100)
          }))
        : [{ item: 'Tailored Coat', category: 'Outerwear', confidence: 95 }],
      dominantColors: vis?.outfitProfile?.colorHarmony?.dominantColors
        ? vis.outfitProfile.colorHarmony.dominantColors.map((c) => c.hex)
        : ['#0F0F1A', '#312E81', '#E0E7FF'],
      materials: vis?.garments ? vis.garments.map((g) => g.material) : ['Wool Blend', 'Silk Touch'],
      silhouette: vis?.outfitProfile?.silhouette?.shoulderStructure || 'Structured Architectural',
      visualConfidence: response.confidenceReport.finalConfidence,
      styleVibe: vis?.visualEmbedding?.aestheticTag || 'Contemporary Elegance'
    };

    this.updateState({
      isProcessing: false,
      currentVisualAnalysis: insight,
      rawLastResponse: response,
      activeTab: 'VISION',
      totalInteractions: this.state.totalInteractions + 1
    });

    return insight;
  }

  /**
   * Journey 3: Generate Fashion Concept & Studio Result
   */
  public async generateFashionConcept(
    userPrompt: string,
    occasion = 'Editorial',
    season = 'Autumn/Winter',
    userId = 'guest_user'
  ): Promise<ARIAOutfitResult> {
    this.updateState({ isProcessing: true });
    const response = await ariaService.generateOutfitConcept(userPrompt, occasion, season);

    const concept = response.concept;
    const result: ARIAOutfitResult = {
      conceptTitle: concept?.title || 'Sartorial Avant-Garde Concept',
      description: concept?.description || 'Bespoke conceptual fashion synthesis.',
      aestheticTheme: concept?.aestheticTheme || 'Modern Minimalist',
      colorPalette: concept?.colorPalette || ['#09090b', '#4c1d95', '#e0e7ff'],
      stylingNotes: concept?.stylingDirections || ['Layer structured wool coat over silk knit.'],
      capsuleSuggestions: response.capsule?.corePieces ? response.capsule.corePieces.map((p) => `${p.category}: ${p.description}`) : ['Core Blazer', 'Essential Trousers', 'Silk Shirt'],
      confidenceScore: response.confidenceReport.finalConfidence
    };

    this.updateState({
      isProcessing: false,
      currentOutfitResult: result,
      rawLastResponse: response,
      activeTab: 'STUDIO',
      totalInteractions: this.state.totalInteractions + 1
    });

    return result;
  }

  /**
   * Journey 4: Load Style Passport
   */
  public loadStylePassport(): void {
    this.updateState({
      activeTab: 'PASSPORT'
    });
  }

  public getExperienceState(): ARIAExperienceState {
    return this.state;
  }

  private logTelemetry(telemetry: ARIAExperienceTelemetry): void {
    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'ARIAExperienceController',
        eventName: 'EXPERIENCE_ACTION_LOGGED',
        category: 'Execution',
        payload: `Action: ${telemetry.actionName} (Intent: ${telemetry.intent}, Latency: ${telemetry.latencyMs}ms, Confidence: ${telemetry.confidenceScore}%)`,
        latencyMs: telemetry.latencyMs,
        status: telemetry.success ? 'Success' : 'Failure'
      });
    } catch (_) {}
  }
}

export const ariaExperienceController = ARIAExperienceController.getInstance();
