import { GeminiService } from "./GeminiService";

export interface FashionTrend {
  name: string;
  type: "macro" | "micro";
  trajectory: "rising" | "peaking" | "declining";
  sentimentScore: number; // 0.0 - 1.0 (positive demand indicator)
  coreColors: string[];
  keySilhouettes: string[];
  recommendedMaterials: string[];
  estimatedVelocity: string; // e.g. "high", "moderate", "slow"
}

export interface TrendAnalysisReport {
  timestamp: Date;
  identifiedTrends: FashionTrend[];
  marketImplications: string;
}

export class TrendDetector {
  private aiService: GeminiService;

  constructor(aiService: GeminiService) {
    this.aiService = aiService;
  }

  /**
   * Evaluates external design journals, visual metadata, and global street fashion indexes to discover rising movements.
   */
  public async analyzeGlobalTrends(
    externalFashionSignals: string[]
  ): Promise<TrendAnalysisReport> {
    try {
      console.log("[TREND DETECTOR] Aggregating high-dimensional global fashion movements.");

      const signalContext = externalFashionSignals.join("\n");

      const trendPrompt = `
        Synthesize global fashion trend insights from the following external styling reports, runaway reports, and trend logs.

        Fashion Signals:
        ${signalContext}

        Provide a structured JSON output representing the current trends, highlighting:
        - name: Descriptively styled trend name (e.g. 'Cyber-Gorpcore', 'Eco-Futurism Minimalist')
        - type: macro (multi-year) or micro (seasonal)
        - trajectory: rising, peaking, or declining
        - sentimentScore: Positive consumer appetite metric (0.0 to 1.0)
        - coreColors: Identified recurring colors
        - keySilhouettes: Structural forms
        - recommendedMaterials: Materials/textiles
        - estimatedVelocity: Growth velocity (high, moderate, slow)
      `;

      const schema = {
        type: "OBJECT",
        properties: {
          trends: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                type: { type: "STRING" },
                trajectory: { type: "STRING" },
                sentimentScore: { type: "NUMBER" },
                coreColors: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                keySilhouettes: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                recommendedMaterials: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                estimatedVelocity: { type: "STRING" }
              },
              required: ["name", "type", "trajectory", "sentimentScore", "coreColors", "keySilhouettes", "recommendedMaterials", "estimatedVelocity"]
            }
          },
          marketImplicationsSummary: { type: "STRING" }
        },
        required: ["trends", "marketImplicationsSummary"]
      };

      const result = await this.aiService.generateStructuredJson<any>(
        trendPrompt,
        schema,
        {
          model: "gemini-2.5-flash",
          temperature: 0.3,
          systemInstruction: "You are the Director of Global Style Analytics and Predictive Forecasting at FUTURE.ZE."
        }
      );

      return {
        timestamp: new Date(),
        identifiedTrends: result.trends,
        marketImplications: result.marketImplicationsSummary
      };
    } catch (error: any) {
      console.error("[TREND DETECTOR] Trend intelligence parsing sequence crashed:", error);
      throw new Error(`Trend evaluation pipeline failed: ${error.message}`);
    }
  }
}
