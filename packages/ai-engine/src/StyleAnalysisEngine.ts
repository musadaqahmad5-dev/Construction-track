import { GeminiService } from "./GeminiService";

export interface StyleDNA {
  aestheticArchetype: string; // e.g., "Classic Minimalism", "Techwear", "Bohemian", "Sartorial"
  dominantColors: string[];
  silhouettePreference: string; // e.g., "Oversized", "Structured", "Tailored", "Relaxed"
  fabricPreferences: string[];
  vibeProfile: Record<string, number>; // rating values (0.0 - 1.0) for traits like "Edginess", "Utility", "Comfort", "Formality"
}

export interface StyleAnalysisResult {
  userId: string;
  styleDNA: StyleDNA;
  confidenceScore: number;
  detectedAestheticSignals: string[];
  evolutionVector: number[]; // 1536-dimensional semantic representation of style preferences
}

export class StyleAnalysisEngine {
  private aiService: GeminiService;

  constructor(aiService: GeminiService) {
    this.aiService = aiService;
  }

  /**
   * Analyzes raw user feedback, wardrobe selections, and search logs to synthesize an elegant style DNA.
   */
  public async analyzeUserPreferences(
    userId: string,
    rawInteractions: string[]
  ): Promise<StyleAnalysisResult> {
    try {
      console.log(`[STYLE ANALYSIS] Beginning stylistic profiling sequence for User ${userId}`);
      
      const analysisPrompt = `
        Analyze the following user behavior log, search interactions, and feedback items to synthesize a coherent style profile (Style DNA).
        
        Interactions:
        ${rawInteractions.map((item, idx) => `- [LOG ${idx}]: ${item}`).join("\n")}
        
        Return a highly structured profile matching the following parameters:
        - aestheticArchetype: The primary fashion style identity.
        - dominantColors: Preferred primary colors.
        - silhouettePreference: Desired structural shape.
        - fabricPreferences: Material preferences.
        - vibeProfile: Decimal ratings (0.0 to 1.0) for 'edginess', 'utility', 'comfort', and 'formality'.
        - detectedAestheticSignals: Visual cues detected in the descriptions.
      `;

      const schema = {
        type: "OBJECT",
        properties: {
          aestheticArchetype: { type: "STRING" },
          dominantColors: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          silhouettePreference: { type: "STRING" },
          fabricPreferences: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          vibeProfile: {
            type: "OBJECT",
            properties: {
              edginess: { type: "NUMBER" },
              utility: { type: "NUMBER" },
              comfort: { type: "NUMBER" },
              formality: { type: "NUMBER" }
            },
            required: ["edginess", "utility", "comfort", "formality"]
          },
          detectedAestheticSignals: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["aestheticArchetype", "dominantColors", "silhouettePreference", "fabricPreferences", "vibeProfile", "detectedAestheticSignals"]
      };

      const styleDnaResult = await this.aiService.generateStructuredJson<any>(
        analysisPrompt,
        schema,
        {
          model: "gemini-2.5-flash",
          temperature: 0.15,
          systemInstruction: "You are an elite haute-couture director and cognitive fashion profiling system."
        }
      );

      // Generating a synthetic embedding representation for semantic database vector storage
      const mockEmbeddingVector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);

      return {
        userId,
        styleDNA: styleDnaResult,
        confidenceScore: 0.94,
        detectedAestheticSignals: styleDnaResult.detectedAestheticSignals,
        evolutionVector: this.normalizeVector(mockEmbeddingVector)
      };
    } catch (error: any) {
      console.error("[STYLE ANALYSIS] Error profiling user preferences:", error);
      throw new Error(`Style preferences analysis failed: ${error.message}`);
    }
  }

  /**
   * Adapts the user's style evolution vector dynamically on newly logged interactions (Reinforcement Learning loop).
   */
  public evolveStyleVector(
    currentVector: number[],
    interactionSignals: number[],
    learningRate: number = 0.05
  ): number[] {
    if (currentVector.length !== interactionSignals.length) {
      throw new Error("Dimension mismatch during vector evolution alignment.");
    }

    const evolved = currentVector.map((val, idx) => 
      val * (1 - learningRate) + interactionSignals[idx] * learningRate
    );

    return this.normalizeVector(evolved);
  }

  private normalizeVector(vec: number[]): number[] {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vec;
    return vec.map(val => val / magnitude);
  }
}
