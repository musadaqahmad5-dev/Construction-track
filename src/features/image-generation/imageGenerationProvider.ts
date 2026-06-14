import { GoogleGenAI } from '@google/genai';

export interface ImageConfig {
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  imageSize?: '512px' | '1K' | '2K';
  quality?: 'standard' | 'high';
}

export interface ImageGenerationResult {
  provider: string;
  success: boolean;
  imageUrl: string;
  latencyMs: number;
  error?: string;
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

      // Imagen model generate request as per @google/genai guidelines
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: config?.aspectRatio || '1:1',
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
      console.error('[ImagenProvider] Error generating image:', err);
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
            imageSize: config?.imageSize || '1K'
          }
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
      console.error('[GeminiImageProvider] Generation failed, trying fallback...', err);
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
    
    // Hash the prompt to generate a stable, deterministic seed
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = (hash << 5) - hash + prompt.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const seed = Math.abs(hash) % 1000;

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

    // High quality aesthetic landscapes/portraits on picsum with structured themes
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
  private static defaultProviderName = 'Google-Imagen-4.0';

  static {
    // Register standard providers
    this.registerProvider(new ImagenProvider());
    this.registerProvider(new GeminiImageProvider());
    this.registerProvider(new FashionPicsumProvider());
  }

  static registerProvider(provider: ImageGenerationProvider) {
    this.providers.set(provider.name, provider);
  }

  static getProvider(name: string): ImageGenerationProvider {
    return this.providers.get(name) || this.providers.get('Fashion-Picsum-Deterministic')!;
  }

  /**
   * Dispatches generation task, cascading to high quality seeds on error/offline
   */
  static async generate(prompt: string, config?: ImageConfig, preferredProvider?: string): Promise<ImageGenerationResult> {
    const provName = preferredProvider || (process.env.GEMINI_API_KEY ? this.defaultProviderName : 'Fashion-Picsum-Deterministic');
    let provider = this.getProvider(provName);

    console.log(`[Image Generation Manager] Dispatching prompt length ${prompt.length} to ${provider.name}`);
    let result = await provider.generateImage(prompt, config);

    // Fallback CASCADE on failure
    if (!result.success && provider.name !== 'Fashion-Picsum-Deterministic') {
      console.warn(`[Image Generation Manager] Provider ${provider.name} failed. Cascading to Picsum Fallback...`);
      provider = this.getProvider('Fashion-Picsum-Deterministic');
      result = await provider.generateImage(prompt, config);
    }

    return result;
  }
}
