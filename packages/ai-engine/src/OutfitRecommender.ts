import { GeminiService } from "./GeminiService";
import { StyleDNA } from "./StyleAnalysisEngine";

export interface Garment {
  id: string;
  name: string;
  category: "top" | "bottom" | "outerwear" | "footwear" | "accessory";
  color: string;
  material: string;
  silhouette: string;
  tags: string[];
}

export interface RecommendedOutfit {
  id: string;
  name: string;
  components: Garment[];
  hauteAestheticJustification: string;
  stylingDirectives: string[];
  cohesivenessScore: number;
}

export class OutfitRecommender {
  private aiService: GeminiService;

  constructor(aiService: GeminiService) {
    this.aiService = aiService;
  }

  /**
   * Generates highly curated outfit suggestions from an available pool of garments that aligns with the user's Style DNA.
   */
  public async orchestrateOutfitRecommendation(
    styleDna: StyleDNA,
    availableInventory: Garment[],
    occasion: string
  ): Promise<RecommendedOutfit[]> {
    try {
      console.log(`[OUTFIT RECOMMENDER] Assembling recommendations for occasion: "${occasion}"`);

      const inventoryContext = JSON.stringify(availableInventory, null, 2);
      const dnaContext = JSON.stringify(styleDna, null, 2);

      const curationPrompt = `
        As an Elite Digital Stylist and Sartorial Architect, synthesize exactly 2 coherent outfit recommendations for the occasion specified below.
        Use only garments present in the available inventory list.

        Occasion Target: "${occasion}"
        User Style DNA Profile:
        ${dnaContext}

        Available Inventory Pool:
        ${inventoryContext}

        Return a structured JSON output with an array of Recommended Outfits.
        Each outfit must contain:
        - name: Creative, atmospheric title (e.g. 'Neo-Metropolitan Nomad', 'Deconstructed Elegance')
        - components: List of full Garment objects matching the curated assembly
        - hauteAestheticJustification: High-concept styling description
        - stylingDirectives: Concrete tips on how to wear it (e.g., tucking directions, rolling sleeves)
        - cohesivenessScore: Metric rating (0.0 to 1.0) on coordinate flow
      `;

      const schema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            components: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  name: { type: "STRING" },
                  category: { type: "STRING" },
                  color: { type: "STRING" },
                  material: { type: "STRING" },
                  silhouette: { type: "STRING" }
                },
                required: ["id", "name", "category", "color", "material"]
              }
            },
            hauteAestheticJustification: { type: "STRING" },
            stylingDirectives: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            cohesivenessScore: { type: "NUMBER" }
          },
          required: ["name", "components", "hauteAestheticJustification", "stylingDirectives", "cohesivenessScore"]
        }
      };

      const rawResult = await this.aiService.generateStructuredJson<any[]>(
        curationPrompt,
        schema,
        {
          model: "gemini-2.5-pro",
          temperature: 0.25,
          systemInstruction: "You are the head creative stylist at AIStyleHub, known for pristine modern styling combinations."
        }
      );

      return rawResult.map(outfit => ({
        ...outfit,
        id: `outfit-${Math.random().toString(36).substr(2, 9)}`
      }));
    } catch (error: any) {
      console.error("[OUTFIT RECOMMENDER] Curation loop execution failed:", error);
      throw new Error(`Outfit recommendation pipeline failed: ${error.message}`);
    }
  }
}
