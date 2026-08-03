import { ExpandedFashionContext, StylistIntent } from './StylistInterfaces';
import { FashionRequest, FashionRequestType, EnginePriority } from '../../engine';

export interface StructuredPromptPayload {
  systemPrompt: string;
  developerPrompt: string;
  userPrompt: string;
  contextInjection: Record<string, any>;
  memoryInjection: string[];
  styleDNAInjection: Record<string, any>;
}

export class PromptOrchestrator {
  private static instance: PromptOrchestrator | null = null;

  private constructor() {}

  public static getInstance(): PromptOrchestrator {
    if (!PromptOrchestrator.instance) {
      PromptOrchestrator.instance = new PromptOrchestrator();
    }
    return PromptOrchestrator.instance;
  }

  public orchestrate(context: ExpandedFashionContext): {
    structuredPrompt: StructuredPromptPayload;
    fashionEngineRequest: FashionRequest;
  } {
    const systemPrompt = `You are LOOK VISION's Lead AI Stylist & Fashion Intelligence Director.
You operate above the Unified Fashion Intelligence Core to curate bespoke, high-fashion styling advice, wardrobe optimization, and trend recommendations.
Maintain an ultra-refined, confident, and professional tone aligned with luxury fashion standards.`;

    const developerPrompt = `Target Intent: ${context.intent}
User Archetype: ${context.styleDNA.archetype}
Primary Vibe: ${context.vibePreset || context.styleDNA.primaryVibe}
Color Palette: ${(context.colors || context.styleDNA.colorPalette).join(', ')}
Risk Tolerance: ${context.styleDNA.riskTolerance}
Occasion: ${context.occasion || 'General'}
Season: ${context.season || 'Current'}
Wardrobe Count: ${context.wardrobeItems.length}`;

    const userPrompt = context.rawInput || `Provide fashion intelligence analysis for intent ${context.intent}.`;

    const contextInjection = {
      userId: context.userId,
      sessionId: context.sessionId,
      weather: context.weatherInfo,
      upcomingEventsCount: context.upcomingEvents?.length || 0,
      hasImagePayload: !!context.imageUrl,
      hasVideoPayload: !!context.videoUrl
    };

    const memoryInjection = context.recentHistory.map(
      msg => `[${msg.role.toUpperCase()} @ ${msg.timestamp.split('T')[1]?.slice(0, 5) || ''}]: ${msg.content}`
    );

    const styleDNAInjection = {
      archetype: context.styleDNA.archetype,
      vibe: context.styleDNA.primaryVibe,
      colors: context.styleDNA.colorPalette,
      fitPreference: context.styleDNA.fitPreference,
      brandAffinity: context.styleDNA.brandAffinity
    };

    const structuredPrompt: StructuredPromptPayload = {
      systemPrompt,
      developerPrompt,
      userPrompt,
      contextInjection,
      memoryInjection,
      styleDNAInjection
    };

    const fashionEngineRequest = this.buildFashionEngineRequest(context);

    return {
      structuredPrompt,
      fashionEngineRequest
    };
  }

  private buildFashionEngineRequest(context: ExpandedFashionContext): FashionRequest {
    const requestType: FashionRequestType = this.mapIntentToRequestType(context.intent);
    const priority: EnginePriority = this.getPriorityForIntent(context.intent);

    return {
      id: `req_stylist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: requestType,
      context: {
        userId: context.userId,
        items: context.wardrobeItems,
        vibePreset: context.vibePreset || context.styleDNA.primaryVibe,
        occasion: context.occasion,
        season: context.season,
        weather: context.weatherInfo?.condition,
        colors: context.colors || context.styleDNA.colorPalette,
        prompt: context.rawInput,
        metadata: {
          sessionId: context.sessionId,
          intent: context.intent,
          budget: context.budget,
          imageUrl: context.imageUrl,
          videoUrl: context.videoUrl
        }
      },
      payload: {
        imageUrl: context.imageUrl,
        videoUrl: context.videoUrl,
        budget: context.budget
      },
      priority,
      timeoutMs: 8000,
      useCache: true
    };
  }

  private mapIntentToRequestType(intent: StylistIntent): FashionRequestType {
    switch (intent) {
      case 'OUTFIT':
        return 'OUTFIT_RECOMMENDATION';
      case 'WARDROBE':
        return 'WARDROBE_ANALYSIS';
      case 'SHOPPING':
      case 'MARKETPLACE':
        return 'MARKETPLACE_RANKING';
      case 'TREND':
        return 'TREND_PREDICTION';
      case 'COLOR':
        return 'COLOR_INTELLIGENCE';
      case 'TRY_ON':
      case 'VIDEO':
        return 'VIRTUAL_TRY_ON';
      case 'IMAGE':
        return 'AI_CREATION_ENHANCEMENT';
      case 'COMMUNITY':
        return 'COMMUNITY_SCORING';
      case 'STYLE_ADVICE':
      case 'GENERAL':
      default:
        return 'FASHION_SEARCH';
    }
  }

  private getPriorityForIntent(intent: StylistIntent): EnginePriority {
    switch (intent) {
      case 'OUTFIT':
      case 'TRY_ON':
      case 'IMAGE':
        return 'CRITICAL';
      case 'WARDROBE':
      case 'SHOPPING':
      case 'COLOR':
        return 'HIGH';
      default:
        return 'NORMAL';
    }
  }
}

export const promptOrchestrator = PromptOrchestrator.getInstance();
