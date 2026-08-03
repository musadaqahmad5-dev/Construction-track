import { FashionResponse, EngineResult } from '../../engine';
import { ExpandedFashionContext, ReasoningDetails, StylistRecommendation } from './StylistInterfaces';

export interface EvaluatedReasoning {
  overallConfidence: number;
  rankedRecommendations: StylistRecommendation[];
  reasoningDetails: ReasoningDetails;
  primarySummary: string;
}

export class FashionReasoningEngine {
  private static instance: FashionReasoningEngine | null = null;

  private constructor() {}

  public static getInstance(): FashionReasoningEngine {
    if (!FashionReasoningEngine.instance) {
      FashionReasoningEngine.instance = new FashionReasoningEngine();
    }
    return FashionReasoningEngine.instance;
  }

  public reason(
    context: ExpandedFashionContext,
    engineResponse?: FashionResponse
  ): EvaluatedReasoning {
    const factorsAnalyzed: string[] = [
      `User Style Archetype: ${context.styleDNA.archetype}`,
      `Color Harmony Palette: ${(context.colors || context.styleDNA.colorPalette).join(', ')}`,
      `Intent Routing: ${context.intent}`
    ];

    if (context.weatherInfo) {
      factorsAnalyzed.push(`Weather Condition: ${context.weatherInfo.condition} (${context.weatherInfo.season})`);
    }

    if (context.occasion) {
      factorsAnalyzed.push(`Target Occasion: ${context.occasion}`);
    }

    const conflictResolutions: string[] = [];
    const engineContributionScores: Record<string, number> = {};

    let rawRecommendations: StylistRecommendation[] = [];

    if (engineResponse && engineResponse.engineResults) {
      Object.entries(engineResponse.engineResults).forEach(([engineName, res]: [string, EngineResult]) => {
        engineContributionScores[engineName] = res.success ? Math.round(res.confidence * 100) : 30;
        if (!res.success && res.error) {
          conflictResolutions.push(`Fallback applied for ${engineName}: ${res.error}`);
        }
      });

      rawRecommendations = this.extractRecommendationsFromEngineResponse(context, engineResponse);
    } else {
      conflictResolutions.push('Executed in fallback standalone reasoning mode');
    }

    if (rawRecommendations.length === 0) {
      rawRecommendations = this.generateDefaultRecommendations(context);
    }

    const deduplicated = this.removeDuplicateRecommendations(rawRecommendations);
    const ranked = this.rankRecommendations(deduplicated, context);

    const overallConfidence = engineResponse?.overallConfidence ?? 0.88;
    const topDriver = this.determineTopDriver(engineResponse, context);

    const reasoningDetails: ReasoningDetails = {
      factorsAnalyzed,
      conflictResolutions,
      topDriver,
      fallbackUsed: engineResponse ? !engineResponse.success : true,
      engineContributionScores
    };

    const primarySummary = this.buildExecutiveSummary(context, engineResponse, ranked, reasoningDetails);

    return {
      overallConfidence,
      rankedRecommendations: ranked,
      reasoningDetails,
      primarySummary
    };
  }

  private extractRecommendationsFromEngineResponse(
    context: ExpandedFashionContext,
    engineResponse: FashionResponse
  ): StylistRecommendation[] {
    const list: StylistRecommendation[] = [];

    const primary = engineResponse.primaryResult;
    if (primary) {
      if (primary.garmentRecommendations && Array.isArray(primary.garmentRecommendations)) {
        primary.garmentRecommendations.forEach((item: any, idx: number) => {
          list.push({
            id: item.id || `rec_garment_${idx}`,
            title: item.name || item.title || 'Curated Garment',
            category: item.type || item.category || 'Clothing',
            description: `${item.vibe || context.styleDNA.primaryVibe} piece crafted for ${context.occasion || 'all-day precision'}.`,
            score: 95 - idx * 3,
            tags: item.colors || context.colors || ['#05050a'],
            imageUrl: item.imageUrl,
            itemDetails: item,
            reasoning: `Matches your ${context.styleDNA.archetype} archetype and color contrast constraints.`
          });
        });
      }

      if (primary.selectedBest) {
        const item = primary.selectedBest;
        list.push({
          id: item.id || `rec_best_${Date.now()}`,
          title: item.name || 'Optimal Selection',
          category: item.category || 'Curated Outfit',
          description: `Highest strategic score based on current weather (${context.weatherInfo?.condition || 'Clear'}) and style DNA.`,
          score: 98,
          tags: item.tags || [context.styleDNA.primaryVibe],
          imageUrl: item.imageUrl,
          itemDetails: item,
          reasoning: 'Engine-verified top candidate for your active profile.'
        });
      }
    }

    return list;
  }

  private generateDefaultRecommendations(context: ExpandedFashionContext): StylistRecommendation[] {
    const palette = context.colors || context.styleDNA.colorPalette;
    return [
      {
        id: `rec_default_1_${Date.now()}`,
        title: `Bespoke ${context.vibePreset || context.styleDNA.primaryVibe} Ensemble`,
        category: 'Outfit Combination',
        description: `Tailored combination curated for ${context.occasion || 'daily elegance'} with strict color harmony.`,
        score: 94,
        tags: [context.styleDNA.archetype, context.styleDNA.primaryVibe, ...palette.slice(0, 2)],
        reasoning: `Synthesized to match your risk tolerance (${context.styleDNA.riskTolerance * 100}%) and archetype.`
      },
      {
        id: `rec_default_2_${Date.now()}`,
        title: 'Structured Monochromatic Layer',
        category: 'Outerwear / Accent',
        description: 'High-contrast jacket and accessories engineered for sleek, modern silhouette balancing.',
        score: 91,
        tags: ['Monochrome', 'Structured', 'Layering'],
        reasoning: 'Complements your brand affinities and fit preferences.'
      }
    ];
  }

  private removeDuplicateRecommendations(items: StylistRecommendation[]): StylistRecommendation[] {
    const seen = new Set<string>();
    return items.filter(item => {
      const key = `${item.title.toLowerCase()}_${item.category.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private rankRecommendations(items: StylistRecommendation[], context: ExpandedFashionContext): StylistRecommendation[] {
    return [...items].sort((a, b) => {
      let scoreA = a.score;
      let scoreB = b.score;

      if (a.tags.some(t => t.toLowerCase() === context.styleDNA.primaryVibe.toLowerCase())) scoreA += 3;
      if (b.tags.some(t => t.toLowerCase() === context.styleDNA.primaryVibe.toLowerCase())) scoreB += 3;

      return scoreB - scoreA;
    });
  }

  private determineTopDriver(engineResponse: FashionResponse | undefined, context: ExpandedFashionContext): string {
    if (engineResponse?.primaryResult?.selectedBest) {
      return 'Decision Intelligence Optimization Matrix';
    }
    if (context.intent === 'COLOR') {
      return 'Color Harmony Sub-Engine';
    }
    if (context.intent === 'TRY_ON' || context.intent === 'IMAGE') {
      return 'Vision & Creation Intelligence Engine';
    }
    return 'Unified Style DNA & Context Synthesizer';
  }

  private buildExecutiveSummary(
    context: ExpandedFashionContext,
    engineResponse: FashionResponse | undefined,
    recommendations: StylistRecommendation[],
    reasoning: ReasoningDetails
  ): string {
    const topRec = recommendations[0];
    const recTitle = topRec ? topRec.title : 'curated recommendations';
    const vibe = context.vibePreset || context.styleDNA.primaryVibe;
    const occasionText = context.occasion ? ` for your ${context.occasion.toLowerCase()}` : '';

    return `Based on your ${context.styleDNA.archetype} archetype and ${vibe} preferences, I have synthesized an optimized styling direction${occasionText}. Primary focus: ${recTitle}. Driven by ${reasoning.topDriver}.`;
  }
}

export const fashionReasoningEngine = FashionReasoningEngine.getInstance();
