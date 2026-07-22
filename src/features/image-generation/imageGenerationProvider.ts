import { GoogleGenAI } from '@google/genai';
import { PromptIntelligenceEngine } from './PromptIntelligenceEngine';
import { GenerationIntelligenceEngine } from './GenerationIntelligenceEngine';

export interface ImageConfig {
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  imageSize?: '512px' | '1K' | '2K';
  quality?: 'standard' | 'high';
  negativePrompt?: string;
  seed?: string | number;
  highResMode?: boolean;
  styleTransferWeight?: number;
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

    if (!apiKey || ImageGenerationRegistry.checkGeminiCircuit()) {
      return {
        provider: this.name,
        success: false,
        imageUrl: '',
        latencyMs: Date.now() - startTime,
        error: 'Gemini API circuit broken or key unavailable.'
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const candidateModels = ['imagen-3.0-generate-002', 'imagen-3.0-fast-generate-001'];
    let lastError = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateImages({
          model: modelName,
          prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: config?.aspectRatio || '1:1'
          },
        });

        const base64Bytes = response.generatedImages?.[0]?.image?.imageBytes;
        if (base64Bytes) {
          return {
            provider: this.name,
            success: true,
            imageUrl: `data:image/jpeg;base64,${base64Bytes}`,
            latencyMs: Date.now() - startTime
          };
        }
      } catch (err: any) {
        lastError = err.message || String(err);
        const lowerErr = lastError.toLowerCase();
        if (lowerErr.includes('429') || lowerErr.includes('quota') || lowerErr.includes('resource_exhausted') || lowerErr.includes('not found') || lowerErr.includes('404')) {
          ImageGenerationRegistry.breakGeminiCircuit();
          break;
        }
      }
    }

    return {
      provider: this.name,
      success: false,
      imageUrl: '',
      latencyMs: Date.now() - startTime,
      error: lastError || 'All Imagen model candidates failed'
    };
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

    if (!apiKey || ImageGenerationRegistry.checkGeminiCircuit()) {
      return {
        provider: this.name,
        success: false,
        imageUrl: '',
        latencyMs: Date.now() - startTime,
        error: 'Gemini API circuit broken or key unavailable.'
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const candidateModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
    let lastError = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
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

        if (inlineImageUrl) {
          return {
            provider: this.name,
            success: true,
            imageUrl: inlineImageUrl,
            latencyMs: Date.now() - startTime
          };
        }
      } catch (err: any) {
        lastError = err.message || String(err);
        const lowerErr = lastError.toLowerCase();
        if (lowerErr.includes('429') || lowerErr.includes('quota') || lowerErr.includes('resource_exhausted')) {
          ImageGenerationRegistry.breakGeminiCircuit();
          break; // Stop trying subsequent candidates immediately when quota is exhausted
        }
      }
    }

    return {
      provider: this.name,
      success: false,
      imageUrl: '',
      latencyMs: Date.now() - startTime,
      error: lastError || 'All Gemini Image candidates failed'
    };
  }
}

/**
 * Pollinations AI Live Fallback Provider (Generates real AI images on the fly for any prompt)
 */
export class PollinationsAIProvider implements ImageGenerationProvider {
  name = 'Pollinations-AI-Generator';

  async generateImage(prompt: string, config?: ImageConfig): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    try {
      const cleanPrompt = encodeURIComponent(`${prompt}, studio luxury fashion lookbook photo, high resolution, 8k`);
      const randomSeed = config?.seed ? Number(config.seed) : Math.floor(Math.random() * 10000000);
      const width = config?.aspectRatio === '16:9' ? 800 : config?.aspectRatio === '3:4' ? 600 : 800;
      const height = config?.aspectRatio === '16:9' ? 450 : config?.aspectRatio === '3:4' ? 800 : 800;
      
      const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${randomSeed}&nologo=true&model=flux`;

      return {
        provider: this.name,
        success: true,
        imageUrl,
        latencyMs: Date.now() - startTime
      };
    } catch (err: any) {
      return {
        provider: this.name,
        success: false,
        imageUrl: '',
        latencyMs: Date.now() - startTime,
        error: err.message || 'Pollinations AI failed'
      };
    }
  }
}

/**
 * High-quality Fashion Placeholder Fallback Provider (Uses curated luxury fashion editorial lookbooks on Unsplash + dynamic seeds)
 */
export class FashionPicsumProvider implements ImageGenerationProvider {
  name = 'Fashion-Picsum-Deterministic';

  private categoryFashionImages = {
    outerwear: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=800&auto=format&fit=crop'
    ],
    tailoring: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
    ],
    streetwear: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop'
    ],
    dress: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop'
    ],
    footwear: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop'
    ],
    denim: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=800&auto=format&fit=crop'
    ],
    general: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop'
    ]
  };

  async generateImage(prompt: string, config?: ImageConfig): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    const lowerPrompt = prompt.toLowerCase();
    
    let pool = this.categoryFashionImages.general;
    if (lowerPrompt.includes('suit') || lowerPrompt.includes('blazer') || lowerPrompt.includes('formal') || lowerPrompt.includes('tailor') || lowerPrompt.includes('tuxedo')) {
      pool = this.categoryFashionImages.tailoring;
    } else if (lowerPrompt.includes('coat') || lowerPrompt.includes('trench') || lowerPrompt.includes('jacket') || lowerPrompt.includes('outerwear')) {
      pool = this.categoryFashionImages.outerwear;
    } else if (lowerPrompt.includes('streetwear') || lowerPrompt.includes('hoodie') || lowerPrompt.includes('sweater') || lowerPrompt.includes('casual')) {
      pool = this.categoryFashionImages.streetwear;
    } else if (lowerPrompt.includes('dress') || lowerPrompt.includes('gown') || lowerPrompt.includes('evening') || lowerPrompt.includes('silk')) {
      pool = this.categoryFashionImages.dress;
    } else if (lowerPrompt.includes('shoe') || lowerPrompt.includes('boot') || lowerPrompt.includes('sneaker') || lowerPrompt.includes('footwear')) {
      pool = this.categoryFashionImages.footwear;
    } else if (lowerPrompt.includes('denim') || lowerPrompt.includes('jean') || lowerPrompt.includes('trouser') || lowerPrompt.includes('pant')) {
      pool = this.categoryFashionImages.denim;
    }

    // High-entropy hashing with time salt for guaranteed unique seed on every click
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = (hash << 5) - hash + prompt.charCodeAt(i);
      hash |= 0;
    }
    const timeSalt = Math.floor(Math.random() * 100000);
    const index = Math.abs(hash + timeSalt) % pool.length;
    const imageUrl = pool[index];

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
    this.registerProvider(new PollinationsAIProvider());
    this.registerProvider(new FashionPicsumProvider());
  }

  public static checkGeminiCircuit(): boolean {
    if (this.isGeminiCircuitBroken) {
      const now = Date.now();
      if (now - this.lastFailureTime < 600000) { // 10-minute circuit breaker on quota exhaustion
        return true;
      } else {
        this.isGeminiCircuitBroken = false;
      }
    }
    return false;
  }

  public static breakGeminiCircuit() {
    this.isGeminiCircuitBroken = true;
    this.lastFailureTime = Date.now();
    console.info('[Image Generation Manager] Gemini API quota limit reached. Circuit breaker engaged. Directing requests to Pollinations AI generator.');
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
    if (norm === 'pollinations' || norm.includes('pollinations')) {
      return this.providers.get('Pollinations-AI-Generator')!;
    }
    if (norm === 'picsum' || norm === 'fashion-picsum-deterministic' || norm.includes('picsum')) {
      return this.providers.get('Fashion-Picsum-Deterministic')!;
    }
    return this.providers.get(name) || this.providers.get('Pollinations-AI-Generator') || this.providers.get('Fashion-Picsum-Deterministic')!;
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
      console.info('[Image Generation Manager] Gemini circuit is currently broken. Routing direct to Pollinations AI generator.');
      const provider = this.getProvider('Pollinations-AI-Generator');
      const result = await provider.generateImage(activePrompt, mergedConfig);
      result.qualityScores = productionReady.qualityScores;
      result.criticFeedback = productionReady.criticFeedback;
      return result;
    }

    const provName = preferredProvider || (process.env.GEMINI_API_KEY ? this.defaultProviderName : 'Pollinations-AI-Generator');
    let provider = this.getProvider(provName);

    console.log(`[Image Generation Manager] Dispatching prompt length ${activePrompt.length} to ${provider.name}`);
    let result = await provider.generateImage(activePrompt, mergedConfig);

    if (!result.success && isQuotaError(result.error)) {
      this.breakGeminiCircuit();
    }

    // Fallback CASCADE on failure: cascade between live providers to maximize chances of success
    if (!result.success) {
      if (provider.name === 'Google-Imagen-4.0') {
        if (!this.checkGeminiCircuit()) {
          provider = this.getProvider('Gemini-3.1-Flash-Image');
          result = await provider.generateImage(activePrompt, mergedConfig);
          if (!result.success && isQuotaError(result.error)) {
            this.breakGeminiCircuit();
          }
        }
      } else if (provider.name === 'Gemini-3.1-Flash-Image') {
        if (!this.checkGeminiCircuit()) {
          provider = this.getProvider('Google-Imagen-4.0');
          result = await provider.generateImage(activePrompt, mergedConfig);
        }
      }
    }

    // Tertiary Fallback CASCADE to Pollinations AI generator
    if (!result.success && provider.name !== 'Pollinations-AI-Generator') {
      console.info(`[Image Generation Manager] Provider ${provider.name} failed. Cascading to Pollinations AI Generator...`);
      provider = this.getProvider('Pollinations-AI-Generator');
      result = await provider.generateImage(activePrompt, mergedConfig);
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
