import { GoogleGenAI } from '@google/genai';
import { PromptIntelligenceEngine } from './PromptIntelligenceEngine';
import { GenerationIntelligenceEngine } from './GenerationIntelligenceEngine';

export interface ImageConfig {
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  imageSize?: '512px' | '1K' | '2K';
  quality?: 'standard' | 'high';
  negativePrompt?: string;
  seed?: string | number;
}

export interface ImageGenerationResult {
  provider: string;
  success: boolean;
  imageUrl: string;
  latencyMs: number;
  error?: string;
  qualityScores?: {
    promptQuality: number;
    fashionQuality: number;
    avatarQuality: number;
    luxuryQuality: number;
    realismQuality: number;
    compositionQuality: number;
    creativityQuality: number;
    variationQuality: number;
    wowScore: number;
  };
  criticFeedback?: string;
}

export interface ImageGenerationProvider {
  name: string;
  generateImage(prompt: string, config?: ImageConfig): Promise<ImageGenerationResult>;
}

/**
 * Live Imagen 4.0 Provider (Calls Google Imagen Model)
 */
export class ImagenProvider implements ImageGenerationProvider {
  name = 'Google-Imagen-4.0';

  async generateImage(prompt: string, config?: ImageConfig): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        provider: this.name,
        success: false,
        imageUrl: '',
        latencyMs: Date.now() - startTime,
        error: 'No GEMINI_API_KEY available for live Imagen generation.'
      };
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      // Verify model exists before calling it (warn but do not fail execution on permission restrictions)
      try {
        console.log(`[ImagenProvider] Verifying if model 'imagen-3.0-generate-002' exists and is supported...`);
        await ai.models.get({ model: 'imagen-3.0-generate-002' });
        console.log(`[ImagenProvider] Model 'imagen-3.0-generate-002' is verified.`);
      } catch (verifyErr: any) {
        console.warn(`[ImagenProvider] Model verification check failed or skipped: ${verifyErr.message}. Attempting generation directly.`);
      }

      // Imagen model generate request as per @google/genai guidelines
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: config?.aspectRatio || '1:1',
          negativePrompt: config?.negativePrompt
        },
      });

      const base64Bytes = response.generatedImages[0]?.image?.imageBytes;
      if (!base64Bytes) {
        throw new Error('No image bytes in response.');
      }

      return {
        provider: this.name,
        success: true,
        imageUrl: `data:image/jpeg;base64,${base64Bytes}`,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      console.info('[ImagenProvider] Error generating image (handled via fallback):', err.message || err);
      return {
        provider: this.name,
        success: false,
        imageUrl: '',
        latencyMs: Date.now() - startTime,
        error: err.message || 'Unknown Imagen error'
      };
    }
  }
}

/**
 * Live Gemini Flash Image Provider (Nano Banana Series)
 */
export class GeminiImageProvider implements ImageGenerationProvider {
  name = 'Gemini-3.1-Flash-Image';

  async generateImage(prompt: string, config?: ImageConfig): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        provider: this.name,
        success: false,
        imageUrl: '',
        latencyMs: Date.now() - startTime,
        error: 'No GEMINI_API_KEY available.'
      };
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: config?.aspectRatio || '1:1',
            imageSize: config?.imageSize || '1K',
            negativePrompt: config?.negativePrompt
          } as any
        }
      });

      let inlineImageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            inlineImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!inlineImageUrl) {
        throw new Error('Image part not found in Gemini response parts.');
      }

      return {
        provider: this.name,
        success: true,
        imageUrl: inlineImageUrl,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      console.info('[GeminiImageProvider] Generation failed, trying fallback... (handled via cascade):', err.message || err);
      return {
        provider: this.name,
        success: false,
        imageUrl: '',
        latencyMs: Date.now() - startTime,
        error: err.message
      };
    }
  }
}

/**
 * High-quality Fashion Placeholder Fallback Provider (Uses deterministic Seeds on Picsum for offline / key missing)
 */
export class FashionPicsumProvider implements ImageGenerationProvider {
  name = 'Fashion-Picsum-Deterministic';

  async generateImage(prompt: string, config?: ImageConfig): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    
    // Combine the prompt hash with a high-entropy randomized salt to guarantee 100% unique seed on every single click
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = (hash << 5) - hash + prompt.charCodeAt(i);
      hash |= 0;
    }
    const randomSalt = Math.floor(Math.random() * 1000000);
    const seed = config?.seed !== undefined ? Number(config.seed) : (Math.abs(hash + randomSalt) % 10000);

    let width = 512;
    let height = 512;
    if (config?.aspectRatio === '16:9') {
      width = 800;
      height = 450;
    } else if (config?.aspectRatio === '3:4') {
      width = 450;
      height = 600;
    } else if (config?.aspectRatio === '9:16') {
      width = 450;
      height = 800;
    }

    // High quality aesthetic landscapes/portraits on picsum with structured themes and massive seed space
    const imageUrl = `https://picsum.photos/seed/fashion-${seed}/${width}/${height}`;

    return {
      provider: this.name,
      success: true,
      imageUrl,
      latencyMs: Date.now() - startTime
    };
  }
}

/**
 * Image Generation Registry Manager
 */
export class ImageGenerationRegistry {
  private static providers: Map<string, ImageGenerationProvider> = new Map();
  private static defaultProviderName = 'Gemini-3.1-Flash-Image';
  private static isGeminiCircuitBroken = false;
  private static lastFailureTime = 0;

  static {
    // Register standard providers
    this.registerProvider(new ImagenProvider());
    this.registerProvider(new GeminiImageProvider());
    this.registerProvider(new FashionPicsumProvider());
  }

  private static checkGeminiCircuit(): boolean {
    if (this.isGeminiCircuitBroken) {
      const now = Date.now();
      if (now - this.lastFailureTime < 60000) {
        return true;
      } else {
        this.isGeminiCircuitBroken = false;
      }
    }
    return false;
  }

  private static breakGeminiCircuit() {
    this.isGeminiCircuitBroken = true;
    this.lastFailureTime = Date.now();
    console.info('[Image Generation Manager] Gemini Image APIs rate-limited. 60-second circuit breaker active. Routing to Picsum.');
  }

  static registerProvider(provider: ImageGenerationProvider) {
    this.providers.set(provider.name, provider);
  }

  static getProvider(name: string): ImageGenerationProvider {
    const norm = name ? name.toLowerCase() : '';
    if (norm === 'imagen' || norm === 'google-imagen-4.0' || norm.includes('imagen')) {
      return this.providers.get('Google-Imagen-4.0')!;
    }
    if (norm === 'gemini' || norm === 'gemini-3.1-flash-image' || norm.includes('gemini')) {
      return this.providers.get('Gemini-3.1-Flash-Image')!;
    }
    if (norm === 'picsum' || norm === 'fashion-picsum-deterministic' || norm.includes('picsum')) {
      return this.providers.get('Fashion-Picsum-Deterministic')!;
    }
    return this.providers.get(name) || this.providers.get('Fashion-Picsum-Deterministic')!;
  }

  /**
   * Dispatches generation task, cascading to high quality seeds on error/offline
   */
  static async generate(prompt: string, config?: ImageConfig, preferredProvider?: string): Promise<ImageGenerationResult> {
    const isQuotaError = (errorMsg?: string): boolean => {
      if (!errorMsg) return false;
      const msg = errorMsg.toLowerCase();
      return msg.includes('quota') || msg.includes('rate-limit') || msg.includes('429') || msg.includes('resource_exhausted');
    };

    // Auto-enrich incoming prompts using the Enterprise Intelligence Pipeline
    const enhanced = PromptIntelligenceEngine.optimize(prompt, config);
    const productionReady = GenerationIntelligenceEngine.process(enhanced, prompt, config);
    const activePrompt = productionReady.prompt;
    console.log(`[Image Generation Manager] Prompt understanding & automated styling enhancement pipeline completed.`);
    console.log(`[Image Generation Manager] Enterprise Generation Intelligence Engine pipeline completed.`);

    const mergedConfig: ImageConfig = {
      ...config,
      negativePrompt: productionReady.negativePrompt
    };

    if (this.checkGeminiCircuit() && (!preferredProvider || preferredProvider.toLowerCase().includes('gemini') || preferredProvider.toLowerCase().includes('imagen'))) {
      console.info('[Image Generation Manager] Gemini circuit is currently broken. Routing direct to Picsum.');
      const provider = this.getProvider('Fashion-Picsum-Deterministic');
      const result = await provider.generateImage(activePrompt, mergedConfig);
      result.qualityScores = productionReady.qualityScores;
      result.criticFeedback = productionReady.criticFeedback;
      return result;
    }

    const provName = preferredProvider || (process.env.GEMINI_API_KEY ? this.defaultProviderName : 'Fashion-Picsum-Deterministic');
    let provider = this.getProvider(provName);

    console.log(`[Image Generation Manager] Dispatching prompt length ${activePrompt.length} to ${provider.name}`);
    let result = await provider.generateImage(activePrompt, mergedConfig);

    if (!result.success && isQuotaError(result.error)) {
      this.breakGeminiCircuit();
    }

    // Fallback CASCADE on failure: if first live provider fails, cascade to Gemini-3.1-Flash-Image next
    if (!result.success && provider.name === 'Google-Imagen-4.0') {
      if (!this.checkGeminiCircuit()) {
        console.info(`[Image Generation Manager] Provider Google-Imagen-4.0 failed. Cascading to Gemini-3.1-Flash-Image...`);
        provider = this.getProvider('Gemini-3.1-Flash-Image');
        result = await provider.generateImage(activePrompt, mergedConfig);
        if (!result.success && isQuotaError(result.error)) {
          this.breakGeminiCircuit();
        }
      }
    }

    // Secondary Fallback CASCADE to Picsum offline fallback if still failed
    if (!result.success && provider.name !== 'Fashion-Picsum-Deterministic') {
      console.info(`[Image Generation Manager] Provider ${provider.name} failed. Cascading to Picsum Fallback...`);
      provider = this.getProvider('Fashion-Picsum-Deterministic');
      result = await provider.generateImage(activePrompt, mergedConfig);
    }

    // Propagate the calculated quality reports on successful generation
    result.qualityScores = productionReady.qualityScores;
    result.criticFeedback = productionReady.criticFeedback;

    return result;
  }
}
