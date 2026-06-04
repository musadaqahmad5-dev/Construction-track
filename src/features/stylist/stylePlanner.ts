import { WardrobeItem, DailyRecommendation, ClothingCategory } from '../../types';
import { WeatherAdapter } from '../ai/weatherAdapter';
import { ProfileEngine } from '../ai/profileEngine';
import { OutfitReasoner, OutfitRecommendationResult } from '../ai/outfitReasoner';

/**
 * Intelligent Stylist Planner - Decides what to wear today, tomorrow, and provides occasion coordination.
 */
export class StylePlanner {
  /**
   * Plans the ideal outfit recommendation based on weather, user vibe, and preferred agenda.
   * Calls the backend Express API for high-quality Gemini recommendations, with a structured fallback.
   */
  static async draftDailyRecommendation(
    userId: string,
    closetItems: WardrobeItem[],
    temperatureRange: string,
    weatherCondition: string,
    styleVibe: string = 'minimalist',
    agenda: string = 'casual'
  ): Promise<OutfitRecommendationResult> {
    try {
      console.log(`[AI] Drafting AI Recommendation from backend server. Vibe: ${styleVibe}, Agenda: ${agenda}`);
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardrobe: closetItems,
          condition: weatherCondition,
          tempRange: temperatureRange,
          vibe: styleVibe,
          agenda: agenda
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      const recommendation: OutfitRecommendationResult = await response.json();
      return recommendation;
    } catch (err) {
      console.error("[StylePlanner Fallback] AI model offline. Falling back to local OutfitReasoner.", err);
      // Run the local deterministic OutfitReasoner
      const weatherCtx = WeatherAdapter.adapt(weatherCondition, temperatureRange);
      const styleMemory = ProfileEngine.extractStyleMemory(closetItems, styleVibe);
      return OutfitReasoner.reason(closetItems, weatherCtx, styleMemory, agenda);
    }
  }

  /**
   * Evaluates color contrasts and fabric textures for matching combinations.
   */
  static evaluateClashRisk(item1: WardrobeItem, item2: WardrobeItem): { clash: boolean; reason: string } {
    const col1 = (item1.primaryColor || '').toLowerCase();
    const col2 = (item2.primaryColor || '').toLowerCase();

    const highlyClashingPairs = [
      ['rust', 'rust'],
      ['orange', 'red'],
      ['green', 'blue'],
      ['yellow', 'neon']
    ];

    const hasClash = highlyClashingPairs.some(([c1, c2]) => 
      (col1.includes(c1) && col2.includes(c2)) || (col1.includes(c2) && col2.includes(c1))
    );

    if (hasClash) {
      return {
        clash: true,
        reason: `Mismatched color interaction: pairing ${item1.primaryColor} and ${item2.primaryColor} risks an aesthetic clash. Consider balancing with a neutral shade.`
      };
    }

    return {
      clash: false,
      reason: "Colors are functionally compatible. No severe styling clashes are predicted."
    };
  }
}

