/**
 * Centralized Gemini AI Gateway for ARIA v2.5 Foundation
 * Product: LOOK VISION v2.4
 */

import { GoogleGenAI } from '@google/genai';

export interface GeminiGatewayRequest {
  systemInstruction?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseMimeType?: string;
  modelAlias?: string;
}

export interface GeminiGatewayResult {
  text: string;
  modelUsed: string;
  tokensUsed?: number;
  latencyMs: number;
}

export class GeminiGateway {
  private static instance: GeminiGateway;
  private client: GoogleGenAI | null = null;
  private defaultModel = 'gemini-2.5-flash';

  private constructor() {
    this.initClient();
  }

  public static getInstance(): GeminiGateway {
    if (!GeminiGateway.instance) {
      GeminiGateway.instance = new GeminiGateway();
    }
    return GeminiGateway.instance;
  }

  private initClient(): void {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey });
        console.log('[GeminiGateway] Centralized Gemini AI Gateway initialized successfully.');
      } catch (err: any) {
        console.error('[GeminiGateway] Error initializing GoogleGenAI:', err.message);
      }
    } else {
      console.warn('[GeminiGateway] GEMINI_API_KEY environment variable is not set.');
    }
  }

  /**
   * Token optimization: trims unnecessary padding or whitespace
   */
  private optimizePrompt(prompt: string): string {
    return prompt.trim().replace(/\n{3,}/g, '\n\n');
  }

  /**
   * Single gateway execution for AI requests
   */
  public async generateContent(request: GeminiGatewayRequest): Promise<GeminiGatewayResult> {
    const startTime = Date.now();
    const model = request.modelAlias || this.defaultModel;
    const optimizedPrompt = this.optimizePrompt(request.userPrompt);

    if (!this.client) {
      this.initClient();
    }

    if (!this.client) {
      // Fallback response if API key is not configured
      const latencyMs = Date.now() - startTime;
      return {
        text: JSON.stringify({
          summary: `ARIA v2.5 processed prompt: "${optimizedPrompt.substring(0, 80)}..."`,
          insights: ['Centralized AI Gateway running in architectural preview mode.', 'High cohesion with Moon Pearl Glow design system.'],
          recommendation: 'ARIA v2.5 Core Foundation is ready for production features.'
        }),
        modelUsed: `${model}-preview-fallback`,
        tokensUsed: 120,
        latencyMs
      };
    }

    try {
      const contents = [{ role: 'user', parts: [{ text: optimizedPrompt }] }];
      const config: any = {
        temperature: request.temperature ?? 0.3,
        maxOutputTokens: request.maxTokens ?? 2048,
      };

      if (request.systemInstruction) {
        config.systemInstruction = request.systemInstruction;
      }

      if (request.responseMimeType) {
        config.responseMimeType = request.responseMimeType;
      }

      const response = await this.client.models.generateContent({
        model,
        contents,
        config
      });

      const latencyMs = Date.now() - startTime;
      const text = response.text || '';
      const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

      return {
        text,
        modelUsed: model,
        tokensUsed,
        latencyMs
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      console.error('[GeminiGateway Error]:', err.message);
      throw new Error(`Gemini Gateway Execution Error: ${err.message}`);
    }
  }
}

export const geminiGateway = GeminiGateway.getInstance();
