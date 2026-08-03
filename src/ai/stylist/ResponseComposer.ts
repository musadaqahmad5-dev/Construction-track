import {
  StylistResponse,
  StylistRequest,
  ExpandedFashionContext,
  StylistAction,
  StylistRecommendation
} from './StylistInterfaces';
import { EvaluatedReasoning } from './FashionReasoningEngine';
import { FashionResponse } from '../../engine';

export class ResponseComposer {
  private static instance: ResponseComposer | null = null;

  private constructor() {}

  public static getInstance(): ResponseComposer {
    if (!ResponseComposer.instance) {
      ResponseComposer.instance = new ResponseComposer();
    }
    return ResponseComposer.instance;
  }

  public compose(
    request: StylistRequest,
    context: ExpandedFashionContext,
    reasoning: EvaluatedReasoning,
    fashionEngineResponse?: FashionResponse
  ): StylistResponse {
    const actions = this.buildActions(context, reasoning.rankedRecommendations);
    const followUpQuestions = this.buildFollowUpQuestions(context);

    const metadata: Record<string, any> = {
      userId: request.userId,
      sessionId: context.sessionId,
      processedAt: new Date().toISOString(),
      archetype: context.styleDNA.archetype,
      vibePreset: context.vibePreset,
      weather: context.weatherInfo,
      rawInputLength: request.rawInput.length,
      ...request.metadata
    };

    return {
      id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      requestId: request.id,
      timestamp: new Date().toISOString(),
      confidence: reasoning.overallConfidence,
      intent: context.intent,
      summary: reasoning.primarySummary,
      recommendations: reasoning.rankedRecommendations,
      actions,
      followUpQuestions,
      metadata,
      fashionEngineResponse,
      reasoningDetails: reasoning.reasoningDetails
    };
  }

  private buildActions(context: ExpandedFashionContext, recommendations: StylistRecommendation[]): StylistAction[] {
    const actions: StylistAction[] = [];
    const topRec = recommendations[0];

    switch (context.intent) {
      case 'TRY_ON':
      case 'VIDEO':
        actions.push({
          id: `act_vto_${Date.now()}`,
          type: 'OPEN_TRY_ON',
          label: 'Launch Virtual Fitting Studio',
          payload: { imageUrl: context.imageUrl || topRec?.imageUrl || '' }
        });
        actions.push({
          id: `act_save_${Date.now()}`,
          type: 'SAVE_OUTFIT',
          label: 'Save Look to Canvas',
          payload: { recommendationId: topRec?.id }
        });
        break;

      case 'WARDROBE':
        actions.push({
          id: `act_wardrobe_${Date.now()}`,
          type: 'NAVIGATE',
          label: 'Open Digital Closet',
          payload: { view: 'wardrobe' }
        });
        actions.push({
          id: `act_add_${Date.now()}`,
          type: 'ADD_TO_WARDROBE',
          label: 'Add New Garment',
          payload: {}
        });
        break;

      case 'SHOPPING':
      case 'MARKETPLACE':
        actions.push({
          id: `act_shop_${Date.now()}`,
          type: 'SEARCH_MARKETPLACE',
          label: 'Explore Marketplace Listings',
          payload: { query: context.rawInput || context.styleDNA.primaryVibe }
        });
        break;

      case 'COLOR':
        actions.push({
          id: `act_preset_${Date.now()}`,
          type: 'APPLY_PRESET',
          label: 'Apply Color Palette',
          payload: { colors: context.colors || context.styleDNA.colorPalette }
        });
        break;

      case 'IMAGE':
        actions.push({
          id: `act_studio_${Date.now()}`,
          type: 'NAVIGATE',
          label: 'Open AI Creation Studio',
          payload: { view: 'studio', prompt: context.rawInput }
        });
        break;

      case 'COMMUNITY':
        actions.push({
          id: `act_comm_${Date.now()}`,
          type: 'NAVIGATE',
          label: 'Explore Creator Feed',
          payload: { view: 'community' }
        });
        break;

      case 'OUTFIT':
      case 'STYLE_ADVICE':
      default:
        actions.push({
          id: `act_vto_${Date.now()}`,
          type: 'OPEN_TRY_ON',
          label: 'Preview on Digital Twin',
          payload: { recommendationId: topRec?.id }
        });
        actions.push({
          id: `act_save_${Date.now()}`,
          type: 'SAVE_OUTFIT',
          label: 'Save Outfit',
          payload: { item: topRec }
        });
        break;
    }

    return actions;
  }

  private buildFollowUpQuestions(context: ExpandedFashionContext): string[] {
    switch (context.intent) {
      case 'OUTFIT':
        return [
          'Would you like me to adjust this look for a different weather forecast?',
          'Should I match footwear options from your digital closet?',
          'Would you like a higher-risk avant-garde alternative?'
        ];
      case 'WARDROBE':
        return [
          'Would you like a detailed gap analysis for your seasonal closet?',
          'Should I curate 3 new capsule outfits from existing items?'
        ];
      case 'SHOPPING':
      case 'MARKETPLACE':
        return [
          'Should I filter recommendations within a strict budget limit?',
          'Would you like verified sustainable brand alternatives?'
        ];
      case 'TRY_ON':
        return [
          'Would you like to analyze pose tracking alignment in 3D?',
          'Should I generate a cinematic video movement vector?'
        ];
      case 'COLOR':
        return [
          'Would you like triadic or complementary contrast suggestions?',
          'Should I map this palette to luxury footwear options?'
        ];
      default:
        return [
          'Would you like to refine this based on a specific occasion?',
          'Should I save this combination to your Style DNA profile?'
        ];
    }
  }
}

export const responseComposer = ResponseComposer.getInstance();
