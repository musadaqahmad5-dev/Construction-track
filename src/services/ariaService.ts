/**
 * ARIA Frontend Service Bridge
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Architecture
 * 
 * Client-facing service layer connecting LOOK VISION React UI components
 * to the ARIA Runtime and ARIA Orchestrator ecosystem. Supports both local execution
 * and future backend API endpoints (/api/aria/request).
 */

import {
  ARIARequest,
  ARIAResponse,
  ARIAIntent,
  ARIAExecutionContext
} from '../aria/orchestrator/ARIAOrchestratorTypes';
import { ARIARuntime, ARIARuntimeHealth } from '../aria/runtime/ARIARuntime';
import { PreviewEnvironment } from '../aria/preview/PreviewEnvironment';
import { PreviewBootstrap } from '../aria/preview/PreviewBootstrap';
import { auth } from '../firebase';

export class ARIAServiceBridge {
  private static instance: ARIAServiceBridge;
  private isOnlineAPIPreferred = true;

  private constructor() {}

  public static getInstance(): ARIAServiceBridge {
    if (!ARIAServiceBridge.instance) {
      ARIAServiceBridge.instance = new ARIAServiceBridge();
    }
    return ARIAServiceBridge.instance;
  }

  /**
   * Primary entry point for sending arbitrary ARIA requests
   */
  public async sendARIARequest(
    payload: Partial<ARIARequest> & { userPrompt: string }
  ): Promise<ARIAResponse> {
    // Ensure preview bootstrap has run in preview environments
    if (PreviewEnvironment.isPreviewEnvironment()) {
      await PreviewBootstrap.initializePreviewRuntime();
    }

    let currentUser = null;
    try {
      currentUser = auth?.currentUser;
    } catch (_) {}

    const userId = payload.userId || currentUser?.uid || 'preview_user';

    const fullRequest: ARIARequest = {
      requestId: payload.requestId || `aria_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      intent: payload.intent,
      userPrompt: payload.userPrompt,
      imageUrl: payload.imageUrl,
      imageBase64: payload.imageBase64,
      imageName: payload.imageName,
      context: payload.context,
      options: payload.options,
      createdAt: new Date().toISOString()
    };

    // Skip API network call if explicitly in preview mode or if API is not available
    if (!PreviewEnvironment.isPreviewEnvironment() && this.isOnlineAPIPreferred && typeof fetch !== 'undefined') {
      try {
        const token = currentUser ? await currentUser.getIdToken().catch(() => 'guest-token') : 'guest-token';
        const res = await fetch('/api/aria/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(fullRequest)
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            return json.data as ARIAResponse;
          }
        }
      } catch (_) {
        // Fallback gracefully to local ARIA runtime
      }
    }

    // Direct client-side execution via ARIARuntime singleton
    return await ARIARuntime.getInstance().execute(fullRequest);
  }


  /**
   * Helper: Analyze Fashion Image with Vision Engine
   */
  public async analyzeFashionImage(
    imageName: string,
    imageUrl?: string,
    prompt?: string
  ): Promise<ARIAResponse> {
    return this.sendARIARequest({
      intent: 'IMAGE_ANALYSIS',
      userPrompt: prompt || `Analyze visual garments and color palette for image "${imageName}"`,
      imageName,
      imageUrl
    });
  }

  /**
   * Helper: Generate Bespoke Fashion Concept
   */
  public async generateOutfitConcept(
    userPrompt: string,
    occasion?: string,
    season?: string
  ): Promise<ARIAResponse> {
    return this.sendARIARequest({
      intent: 'STYLE_CREATION',
      userPrompt,
      context: {
        occasion: occasion || 'Bespoke Concept',
        season: season || 'Autumn/Winter'
      }
    });
  }

  /**
   * Helper: Get Contextual Style & Outfit Recommendation
   */
  public async getStyleRecommendation(
    userPrompt: string,
    occasion?: string,
    weatherContext?: string,
    temperatureC?: number
  ): Promise<ARIAResponse> {
    return this.sendARIARequest({
      intent: 'OUTFIT_RECOMMENDATION',
      userPrompt,
      context: {
        occasion: occasion || 'Daily Luxury',
        weatherContext: weatherContext || 'Mild',
        temperatureC: temperatureC ?? 20
      }
    });
  }

  /**
   * Helper: Predict Future Style Evolution
   */
  public async predictStyleEvolution(
    userPrompt: string,
    timeHorizonMonths = 6
  ): Promise<ARIAResponse> {
    return this.sendARIARequest({
      intent: 'STYLE_PREDICTION',
      userPrompt,
      context: {
        timeHorizonMonths
      }
    });
  }

  /**
   * Helper: Analyze Global & User Fashion Trends
   */
  public async analyzeTrends(
    userPrompt: string,
    timeHorizonMonths = 6
  ): Promise<ARIAResponse> {
    return this.sendARIARequest({
      intent: 'TREND_ANALYSIS',
      userPrompt,
      context: {
        timeHorizonMonths
      }
    });
  }

  /**
   * Helper: Optimize Modular Capsule Wardrobe
   */
  public async optimizeWardrobe(
    userPrompt: string,
    season?: string
  ): Promise<ARIAResponse> {
    return this.sendARIARequest({
      intent: 'WARDROBE_OPTIMIZATION',
      userPrompt,
      context: {
        season: season || 'Autumn/Winter'
      }
    });
  }

  /**
   * Returns current status of ARIA Runtime
   */
  public getRuntimeStatus() {
    return ARIARuntime.getInstance().getStatus();
  }

  /**
   * Returns health report of ARIA Runtime
   */
  public getRuntimeHealth(): ARIARuntimeHealth {
    return ARIARuntime.getInstance().getHealth();
  }
}

export const ariaService = ARIAServiceBridge.getInstance();
