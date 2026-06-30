import { GeminiService } from "./GeminiService";
import { UserStyleProfile, StyleMemorySystem } from "../../memory-engine/src/StyleMemorySystem";
import { Garment, RecommendedOutfit, OutfitRecommender } from "./OutfitRecommender";
import { FashionTrend } from "./TrendDetector";

export interface StylistContext {
  profile: UserStyleProfile;
  occasion: string;
  season?: string;
  ambientTrends?: FashionTrend[];
  recentWornHistory?: any[]; // Episodic history analogues from memory engine
}

export interface StylingDecision {
  reasoningChain: string[]; // Step-by-step cognitive layout of styling choices
  cohesivenessMetrics: {
    colorHarmony: number; // 0.0 - 1.0
    silhouetteProportion: number; // 0.0 - 1.0
    textileContrast: number; // 0.0 - 1.0
    trendRelevance: number; // 0.0 - 1.0
  };
  highFashionJustification: string;
}

export interface InteractiveStylingSessionResult {
  sessionId: string;
  curatedOutfit: RecommendedOutfit;
  stylistDecision: StylingDecision;
  suggestedAccessoriesRationale: string;
  evolutionImpactEstimate: {
    vectorDeltaMagnitude: number;
    profileAestheticShift: Record<string, number>;
  };
}

export class AIStylistSystem {
  private aiService: GeminiService;
  private memorySystem: StyleMemorySystem;
  private recommender: OutfitRecommender;

  constructor(
    aiService: GeminiService,
    memorySystem: StyleMemorySystem,
    recommender: OutfitRecommender
  ) {
    this.aiService = aiService;
    this.memorySystem = memorySystem;
    this.recommender = recommender;
  }

  /**
   * 1. UNDERSTAND USER FASHION REQUEST & ANALYZE STYLE CONTEXT (Live Decision System)
   * 
   * Orchestrates style context by loading active profile preferences, matching trends,
   * querying episodic worn memories, and resolving styling conflicts.
   */
  public async processStylistConsultation(
    userId: string,
    userPrompt: string,
    availableInventory: Garment[],
    context: StylistContext
  ): Promise<InteractiveStylingSessionResult> {
    try {
      console.log(`[AI STYLIST CORE] Initializing live style consultation for User: ${userId}`);
      console.log(`[AI STYLIST CORE] User Ingress Intent: "${userPrompt}"`);

      // Resolve color conflicts: If the prompt requests a color explicitly but it's excluded in DNA,
      // prompt overrides DNA (user intent is supreme), but log a warning.
      const promptLower = userPrompt.toLowerCase();
      const styleDna = context.profile.preferences;
      
      const customizedExclusions = styleDna.excludedColors.filter(color => 
        !promptLower.includes(color.toLowerCase())
      );

      // Create tailored sub-context representing historical analogous choices
      const historicalCues = context.recentWornHistory && context.recentWornHistory.length > 0
        ? `User's historical worn ratings for similar scenarios:\n${JSON.stringify(context.recentWornHistory, null, 2)}`
        : "No matching historical analogues found in episodic memory store.";

      const trendCues = context.ambientTrends && context.ambientTrends.length > 0
        ? `Global design trends available for styling injection:\n${JSON.stringify(context.ambientTrends, null, 2)}`
        : "No trend data loaded.";

      // 2. DECISION FLOW & GENERATE SUGGESTIONS WITH SARTORIAL REASONING
      const dynamicReasoningPrompt = `
        You are the Head Director of Visual Styling & Creative Direction at AIStyleHub.
        Synthesize an elite, high-concept visual decision chain and select the absolute best outfit combination for:
        
        User Goal / Vibe: "${userPrompt}"
        Target Occasion: "${context.occasion}"
        
        Active Style DNA:
        - Archetypes: ${JSON.stringify(styleDna.archetypes)}
        - Colors: ${JSON.stringify(styleDna.dominantColors)}
        - Excluded Colors (AVOID these): ${JSON.stringify(customizedExclusions)}
        - Preferred Silhouettes: ${JSON.stringify(styleDna.favoredSilhouettes)}
        - Textile Choices: ${JSON.stringify(styleDna.textiles)}
        
        Contextual Episodic Memory:
        ${historicalCues}
        
        Market Context / Active Macro-Trends:
        ${trendCues}
        
        From the Available Wardrobe Inventory, curate ONE complete outfit that masterfully solves this request:
        Inventory:
        ${JSON.stringify(availableInventory, null, 2)}

        Provide your expert reasoning chain, styling decision metrics, and a full high-fashion justification.
      `;

      const schema = {
        type: "OBJECT",
        properties: {
          selectedOutfit: {
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
          },
          reasoningChain: {
            type: "ARRAY",
            items: { type: "STRING" }
          },
          cohesivenessMetrics: {
            type: "OBJECT",
            properties: {
              colorHarmony: { type: "NUMBER" },
              silhouetteProportion: { type: "NUMBER" },
              textileContrast: { type: "NUMBER" },
              trendRelevance: { type: "NUMBER" }
            },
            required: ["colorHarmony", "silhouetteProportion", "textileContrast", "trendRelevance"]
          },
          suggestedAccessoriesRationale: { type: "STRING" },
          evolutionImpactEstimate: {
            type: "OBJECT",
            properties: {
              vectorDeltaMagnitude: { type: "NUMBER" },
              profileAestheticShift: {
                type: "OBJECT",
                additionalProperties: { type: "NUMBER" }
              }
            },
            required: ["vectorDeltaMagnitude", "profileAestheticShift"]
          }
        },
        required: ["selectedOutfit", "reasoningChain", "cohesivenessMetrics", "suggestedAccessoriesRationale", "evolutionImpactEstimate"]
      };

      const finalDecision = await this.aiService.generateStructuredJson<any>(
        dynamicReasoningPrompt,
        schema,
        {
          model: "gemini-2.5-pro",
          temperature: 0.2,
          systemInstruction: "You are the primary cognitive engine for AIStyleHub, driving high-fidelity aesthetic modeling."
        }
      );

      const generatedOutfit: RecommendedOutfit = {
        id: `outfit-stylist-${Math.random().toString(36).substr(2, 9)}`,
        name: finalDecision.selectedOutfit.name,
        components: finalDecision.selectedOutfit.components,
        hauteAestheticJustification: finalDecision.selectedOutfit.hauteAestheticJustification,
        stylingDirectives: finalDecision.selectedOutfit.stylingDirectives,
        cohesivenessScore: finalDecision.selectedOutfit.cohesivenessScore
      };

      const stylingDecision: StylingDecision = {
        reasoningChain: finalDecision.reasoningChain,
        cohesivenessMetrics: finalDecision.cohesivenessMetrics,
        highFashionJustification: finalDecision.selectedOutfit.hauteAestheticJustification
      };

      return {
        sessionId: `session-style-${Math.random().toString(36).substr(2, 10)}`,
        curatedOutfit: generatedOutfit,
        stylistDecision: stylingDecision,
        suggestedAccessoriesRationale: finalDecision.suggestedAccessoriesRationale,
        evolutionImpactEstimate: finalDecision.evolutionImpactEstimate
      };
    } catch (error: any) {
      console.error("[AI STYLIST CORE] Execution crash during consultation pipeline:", error);
      throw new Error(`AI Stylist system failed to generate consultation: ${error.message}`);
    }
  }

  /**
   * 3. PERSONALIZATION LOOP: ADAPT AND IMPROVE OVER TIME (Reinforcement Loop)
   * 
   * Updates style profile and rewards the personalization engine model weights on direct interaction feedback loops.
   */
  public evolveSystemOnFeedback(
    currentProfile: UserStyleProfile,
    sessionResult: InteractiveStylingSessionResult,
    feedbackRating: number, // rating scale: 1 (poor) to 5 (flawless)
    verbatimFeedback?: string
  ): {
    updatedProfile: UserStyleProfile;
    adaptationSummary: string;
  } {
    console.log(`[AI STYLIST FEEDBACK] Processing session feedback loop for Session ${sessionResult.sessionId}. Rating: ${feedbackRating}/5`);

    const adaptationRate = Math.min(0.2, (feedbackRating / 5) * 0.1);
    const updatedProfile = { ...currentProfile, lastUpdated: new Date() };
    const preferences = { ...updatedProfile.preferences };

    // Extract styles represented in the curated outfit
    const outfitArchetypes = Object.keys(sessionResult.evolutionImpactEstimate.profileAestheticShift);
    
    // Perform standard gradient-like ascent or descent shift based on satisfaction thresholds
    const multiplier = feedbackRating >= 4 ? 1.0 : feedbackRating <= 2 ? -1.0 : 0.2;
    const shiftMagnitude = adaptationRate * multiplier;

    outfitArchetypes.forEach(archetype => {
      if (!preferences.archetypes[archetype]) {
        preferences.archetypes[archetype] = 0.1;
      }
      preferences.archetypes[archetype] = Math.max(0, Math.min(1.0, 
        preferences.archetypes[archetype] + (sessionResult.evolutionImpactEstimate.profileAestheticShift[archetype] || 0) * shiftMagnitude
      ));
    });

    // Ingest specific textiles and silhouettes worn successfully
    if (feedbackRating >= 4) {
      sessionResult.curatedOutfit.components.forEach(comp => {
        if (comp.silhouette && !preferences.favoredSilhouettes.includes(comp.silhouette)) {
          preferences.favoredSilhouettes.push(comp.silhouette);
        }
        if (comp.material && !preferences.textiles.includes(comp.material)) {
          preferences.textiles.push(comp.material);
        }
      });
    }

    // Dynamic adaptation summaries indicating cognitive convergence
    let adaptationSummary = "";
    if (feedbackRating >= 4) {
      updatedProfile.sartorialMaturityScore = Math.min(1.0, currentProfile.sartorialMaturityScore + 0.02);
      adaptationSummary = `Positive convergence completed. Profile archetypes reinforced by +${(shiftMagnitude * 100).toFixed(1)}%. Sartorial maturity score expanded.`;
    } else if (feedbackRating <= 2) {
      updatedProfile.sartorialMaturityScore = Math.max(0.0, currentProfile.sartorialMaturityScore - 0.04);
      adaptationSummary = `Negative feedback corrected. Back-propagated negative coefficients of ${(shiftMagnitude * 100).toFixed(1)}% applied to style preferences.`;
    } else {
      adaptationSummary = "Stable neutral adaptation state maintained.";
    }

    updatedProfile.preferences = preferences;
    return {
      updatedProfile,
      adaptationSummary
    };
  }
}
