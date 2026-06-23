import { GoogleGenAI, Type } from '@google/genai';
import { WardrobeItem, ClothingCategory } from '../../types';
import { WeatherAdapter } from './weatherAdapter';
import { ProfileEngine } from './profileEngine';
import { FashionPromptBuilder } from './fashionPromptBuilder';
import { OutfitReasoner, OutfitRecommendationResult } from './outfitReasoner';

// Interfaces for Visual analysis (Task 3)
export interface GarmentVisionResult {
  name?: string;
  category: ClothingCategory;
  primaryColor: string;
  secondaryColor?: string;
  pattern?: string;
  material?: string;
  season?: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Season';
  formality?: 'Casual' | 'Semi-formal' | 'Formal';
  description?: string;
  confidence: number;
}

export class FashionAI {
  private static aiClient: any = null;

  /**
   * Lazily instantiates the Gemini API Client.
   * Ensures that missing keys do NOT crash the app on module load time.
   */
  private static getAI(): any {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI runs in deterministic offline/fallback mode.");
      return null;
    }
    
    if (!this.aiClient) {
      try {
        this.aiClient = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI. Fallback enabled.", err);
        return null;
      }
    }
    return this.aiClient;
  }

  /**
   * Full Recommendation Pipeline (Task 2)
   * Flow: Collect -> Score -> Rank -> Explain -> Suggest
   */
  static async recommendOutfit(
    wardrobe: WardrobeItem[],
    condition: string,
    tempRange: string,
    vibe: string,
    agenda: string
  ): Promise<OutfitRecommendationResult> {
    // 1. Adapter Layer - Weather translation
    const weatherCtx = WeatherAdapter.adapt(condition, tempRange);

    // 2. Profile Layer - Style patterns extraction (Favorite colors, fatigue metrics, vibes)
    const styleMemory = ProfileEngine.extractStyleMemory(wardrobe, vibe);

    // Determine fallback results first so we are always ready
    const fallbackResult = OutfitReasoner.reason(wardrobe, weatherCtx, styleMemory, agenda);

    // 3. Obtain AI Client
    const ai = this.getAI();
    if (!ai) {
      // If no API key is specified, fallback directly to deterministic matching engine
      return {
        ...fallbackResult,
        reasoning: `[Offline Fallback Mode] ${fallbackResult.reasoning}`
      };
    }

    try {
      // 4. Construct Prompt
      const { systemInstruction, prompt } = FashionPromptBuilder.buildRecommendationPrompt(
        wardrobe,
        weatherCtx,
        styleMemory,
        agenda
      );

      // 5. Query Gemini Flash (Highly efficient, perfect for text orchestration)
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty text returned from Gemini API");
      }

      // 6. Parse result and structure safely
      const parsed = JSON.parse(responseText.trim());
      
      return {
        todaySuggestion: Array.isArray(parsed.todaySuggestion) ? parsed.todaySuggestion : fallbackResult.todaySuggestion,
        tomorrowSuggestion: Array.isArray(parsed.tomorrowSuggestion) ? parsed.tomorrowSuggestion : fallbackResult.tomorrowSuggestion,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : fallbackResult.confidence,
        reasoning: typeof parsed.reasoning === 'string' ? parsed.reasoning : fallbackResult.reasoning
      };

    } catch (err) {
      console.error("Gemini Outfit Recommendation failed. Falling back to OutfitReasoner.", err);
      return {
        ...fallbackResult,
        reasoning: `[AI Encountered Error - Fallback Mode] ${fallbackResult.reasoning}`
      };
    }
  }

  /**
   * AI Strategy Generator - Styling coordination tips for one garment.
   */
  static async generateStylingStrategy(
    title: string,
    category: string,
    description: string
  ): Promise<string> {
    const ai = this.getAI();
    if (!ai) {
      // Offline fallback
      return `**AI STYLING CARD (SKELETON - OFFLINE)**
- **Palette**: Pair "${title}" with soft neutral companion fabrics.
- **Silhouette**: Balance the outline geometry based on lightweight contrasts.
- **Occasion Suitability**: Excellent for a adaptive smart-casual layout.
- [Offline] Configure your Gemini API secret key to enable advanced style strategies.`;
    }

    try {
      const { systemInstruction, prompt } = FashionPromptBuilder.buildSingleGarmentStrategyPrompt(
        title,
        category,
        description
      );

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction }
      });

      return response.text?.trim() || "No advice formulated.";
    } catch (err) {
      console.error("Gemini Single Strategy generation failed.", err);
      return `**Styling tips for ${title}:**
- Coordinate with subtle, high-contrast separates.
- Match texture weights to control outline folds.
- [Error] Failed to connect to Gemini servers. Custom tips are limited.`;
    }
  }

  /**
   * Task 3 & Phase 4B: Vision image understanding interface.
   * Utilizes Gemini 3.5 Flash in multi-modal mode to parse uploaded clothing.
   */
  static async analyzeOutfitVisual(base64ImagePure: string): Promise<GarmentVisionResult> {
    console.log("[AI VISION] Processing base64 image for design and tag extraction of length: ", base64ImagePure?.length || 0);
    
    const ai = this.getAI();
    if (!ai) {
      throw new Error("Gemini API key is not defined, cannot run server-side vision model.");
    }

    try {
      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImagePure
        }
      };

      const textPart = {
        text: `Analyze the uploaded garment image and respond in JSON with detailed parameters. Be objective, elegant, and professional.
          Return parameters as specified in the schema:
          - name: a polite title for the garment (like "Camel Overcoat" or "Silk Crewneck")
          - category: must be EXACTLY one of: Casual, Formal, Sportswear, Outerwear, Accessories
          - primaryColor: must be or map to one of: Pitch Black, Minimalist White, Oatmeal Beige, Olive Drab, Dry Sage, Warm Rust, Navy Blue, Silver Gray, Crimson Red, Mustard Yellow, Forest Green
          - secondaryColor: coordinating or contrast color
          - pattern: e.g. Solid, Striped, Plaid, Patterned, Knit
          - material: structural material (e.g. Wool Blend, Cotton Terry, Linens, Denim, Acetate, Technical GoreTex)
          - season: must be EXACTLY one of: Spring, Summer, Autumn, Winter, All-Season
          - formality: must be EXACTLY one of: Casual, Semi-formal, Formal
          - description: 1-2 sentences describing its design, shape, and visual highlights.
          - confidence: value between 0.0 and 1.0`
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { 
                type: Type.STRING, 
                description: "Must be EXACTLY one of: Casual, Formal, Sportswear, Outerwear, Accessories" 
              },
              primaryColor: { 
                type: Type.STRING, 
                description: "One of standard shades: Pitch Black, Minimalist White, Oatmeal Beige, Olive Drab, Dry Sage, Warm Rust, Navy Blue, Silver Gray, etc." 
              },
              secondaryColor: { type: Type.STRING },
              pattern: { type: Type.STRING },
              material: { type: Type.STRING },
              season: { 
                type: Type.STRING, 
                description: "Must be EXACTLY one of: Spring, Summer, Autumn, Winter, All-Season" 
              },
              formality: { 
                type: Type.STRING, 
                description: "Must be EXACTLY one of: Casual, Semi-formal, Formal" 
              },
              description: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ["name", "category", "primaryColor", "season", "formality", "confidence"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response string returned from Gemini Vision model");
      }

      console.log("[AI VISION RESULT] Parsed raw output:", responseText);
      const parsed = JSON.parse(responseText.trim());

      return {
        name: parsed.name || 'Sartorial Apparel',
        category: (parsed.category || 'Casual') as ClothingCategory,
        primaryColor: parsed.primaryColor || 'Oatmeal Beige',
        secondaryColor: parsed.secondaryColor || 'Minimalist White',
        pattern: parsed.pattern || 'Solid',
        material: parsed.material || 'Cotton Rib',
        season: (parsed.season || 'All-Season') as any,
        formality: (parsed.formality || 'Casual') as any,
        description: parsed.description || 'Automatically extracted via vision understanding.',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85
      };

    } catch (err: any) {
      console.error("[FashionAI.analyzeOutfitVisual] Error querying Gemini Multi-modal:", err);
      throw err; // Allow client to leverage robust offline fallback
    }
  }
}
