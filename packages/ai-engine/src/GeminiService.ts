import { GoogleGenAI } from "@google/genai";

export interface GenerationConfig {
  model?: string;
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  systemInstruction?: string;
}

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // Lazy initializer fallback to prevent load-time crash if keys are temporarily missing
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn("[EAOS AI ENGINE] Warning: GEMINI_API_KEY is not defined in the environment. Service is initialized in mock-fallback mode.");
    }
  }

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("[EAOS AI ENGINE] GEMINI_API_KEY environment variable is required for production live mode.");
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Generates a high-quality response for text instructions, supporting system context injections.
   */
  public async generateText(prompt: string, config?: GenerationConfig): Promise<string> {
    try {
      const aiClient = this.getClient();
      const model = config?.model || "gemini-2.5-pro";
      
      const response = await aiClient.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: config?.temperature ?? 0.7,
          maxOutputTokens: config?.maxOutputTokens ?? 2048,
          systemInstruction: config?.systemInstruction,
        }
      });

      return response.text || "";
    } catch (error: any) {
      console.error("[EAOS AI ENGINE] Error during text generation:", error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Generates structured output corresponding to a typed JSON schema.
   */
  public async generateStructuredJson<T>(prompt: string, schema: any, config?: GenerationConfig): Promise<T> {
    try {
      const aiClient = this.getClient();
      const model = config?.model || "gemini-2.5-flash";

      const response = await aiClient.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: config?.temperature ?? 0.1,
          responseMimeType: "application/json",
          responseSchema: schema,
          systemInstruction: config?.systemInstruction,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Received empty content from Gemini response.");
      }

      return JSON.parse(text) as T;
    } catch (error: any) {
      console.error("[EAOS AI ENGINE] Structured JSON generation failed:", error);
      throw new Error(`AI structured processing failed: ${error.message}`);
    }
  }
}
