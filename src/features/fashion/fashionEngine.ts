import { WardrobeItem, OutfitSuggestion, ClothingCategory } from '../../types';

/**
 * AI Fashion Engine - Intelligent coordination and styling recommendations.
 */
export class FashionEngine {
  /**
   * Generates custom styling combinations and coordination ideas for a wardrobe item.
   * Connects to backend Express routes proxying Gemini API with deterministic fallback.
   */
  static async generateStylingStrategy(
    title: string,
    category: ClothingCategory,
    description: string
  ): Promise<string> {
    try {
      console.log(`[AI] Generating styling strategy for ${title} (${category}) via server pipeline`);
      const response = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      const data = await response.json();
      return data.strategy;
    } catch (err) {
      console.error("[FashionEngine Fallback] Failed fetching custom strategy, using fallback preset.", err);
      return `**AI STYLING CARD (DETERMINISTIC FALLBACK)**
- **Palette**: Neutral contrasts paired with deep accessory accents.
- **Silhouette**: Balanced layers. Match tighter fits with cozy outer shells.
- **Occasion Suitability**: Adaptive smart-casual or professional workspace environment.
- *Gemini unavailable. Operating under deterministic design defaults.*`;
    }
  }

  /**
   * Analyzes an uploaded outfit image to extract clothing metadata (Task 3 Visual Analysis layer).
   */
  static async analyzeOutfitVisual(base64Image: string): Promise<{ dominantColors: string[]; materialGuess: string; styleTags: string[]; confidence: number }> {
    try {
      console.log(`[AI] Dispatching base64 image streams to vision analyzer API`);
      const response = await fetch('/api/ai/analyze-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image })
      });

      if (!response.ok) {
        throw new Error(`HTTP status error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error("[FashionEngine Fallback] Vision analysis failed.", err);
      return {
        dominantColors: ['Pitch Black', 'Minimalist White'],
        materialGuess: 'Classic cotton fabric',
        styleTags: ['Casual', 'Everyday Fit'],
        confidence: 0.5
      };
    }
  }
}

