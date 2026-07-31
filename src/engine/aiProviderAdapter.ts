import { PromptPackage } from './themePromptBuilder';

export type AIProvider = 'gemini' | 'imagen' | 'sdxl' | 'flux' | 'generic';

export type ProviderFeature =
  | 'multi_image'
  | 'transparency'
  | 'inpainting'
  | 'outpainting'
  | 'image_editing'
  | 'style_reference'
  | 'character_reference'
  | 'seed'
  | 'guidance_scale'
  | 'negative_prompt'
  | 'batch_generation';

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ProviderCapabilities {
  providerName: AIProvider;
  supportedResolutions: string[];
  supportedAspectRatios: string[];
  supportsMultiImage: boolean;
  supportsTransparency: boolean;
  supportsInpainting: boolean;
  supportsOutpainting: boolean;
  supportsImageEditing: boolean;
  supportsStyleReference: boolean;
  supportsCharacterReference: boolean;
  supportsSeed: boolean;
  supportsGuidanceScale: boolean;
  supportsNegativePrompt: boolean;
  supportsBatchGeneration: boolean;
  maxPromptLength: number;
  maxImagesPerRequest: number;
  features: ProviderFeature[];
}

export interface ProviderRequest {
  id: string;
  provider: AIProvider;
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  resolution: string;
  imageCount: number;
  seed?: number;
  guidanceScale?: number;
  styleReferenceUrl?: string;
  metadata: Record<string, any>;
  timeoutMs: number;
}

export interface GenerationMetadata {
  fusedConcept: string;
  primaryEntity: string;
  category: string;
  mood: string;
  dominantColor: string;
  providerUsed: AIProvider;
  generationTimeMs: number;
  seed: number;
  aspectRatio: string;
  resolution: string;
}

export interface ProviderResponse {
  requestId: string;
  provider: AIProvider;
  status: GenerationStatus;
  images: string[];
  generationTimeMs: number;
  seedUsed: number;
  rawPayload?: any;
  error?: string;
  warnings?: string[];
  costEstimate?: number;
  usageStats?: {
    tokensUsed?: number;
    gpuSeconds?: number;
  };
}

export interface NormalizedGenerationResult {
  generationId: string;
  success: boolean;
  provider: AIProvider;
  imageUrls: string[];
  primaryImageUrl: string;
  status: GenerationStatus;
  generationTimeMs: number;
  seed: number;
  metadata: GenerationMetadata;
  warnings: string[];
  error?: string;
  costEstimate: number;
}

export interface ProviderError {
  provider: AIProvider;
  code: string;
  message: string;
  details?: any;
}

export interface ProviderValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const PROVIDER_CAPABILITIES_REGISTRY: Record<AIProvider, ProviderCapabilities> = {
  gemini: {
    providerName: 'gemini',
    supportedResolutions: ['1024x1024', '1536x1536', '2048x2048'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    supportsMultiImage: true,
    supportsTransparency: false,
    supportsInpainting: true,
    supportsOutpainting: true,
    supportsImageEditing: true,
    supportsStyleReference: true,
    supportsCharacterReference: true,
    supportsSeed: true,
    supportsGuidanceScale: true,
    supportsNegativePrompt: true,
    supportsBatchGeneration: true,
    maxPromptLength: 4096,
    maxImagesPerRequest: 4,
    features: [
      'multi_image',
      'inpainting',
      'outpainting',
      'image_editing',
      'style_reference',
      'character_reference',
      'seed',
      'guidance_scale',
      'negative_prompt',
      'batch_generation'
    ]
  },
  imagen: {
    providerName: 'imagen',
    supportedResolutions: ['1024x1024', '1536x1536', '2048x2048'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    supportsMultiImage: true,
    supportsTransparency: true,
    supportsInpainting: true,
    supportsOutpainting: true,
    supportsImageEditing: true,
    supportsStyleReference: true,
    supportsCharacterReference: false,
    supportsSeed: true,
    supportsGuidanceScale: true,
    supportsNegativePrompt: true,
    supportsBatchGeneration: true,
    maxPromptLength: 2048,
    maxImagesPerRequest: 4,
    features: [
      'multi_image',
      'transparency',
      'inpainting',
      'outpainting',
      'image_editing',
      'style_reference',
      'seed',
      'guidance_scale',
      'negative_prompt',
      'batch_generation'
    ]
  },
  sdxl: {
    providerName: 'sdxl',
    supportedResolutions: ['1024x1024', '1152x896', '896x1152', '1216x832'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3', '21:9'],
    supportsMultiImage: true,
    supportsTransparency: false,
    supportsInpainting: true,
    supportsOutpainting: true,
    supportsImageEditing: true,
    supportsStyleReference: true,
    supportsCharacterReference: false,
    supportsSeed: true,
    supportsGuidanceScale: true,
    supportsNegativePrompt: true,
    supportsBatchGeneration: true,
    maxPromptLength: 1024,
    maxImagesPerRequest: 8,
    features: [
      'multi_image',
      'inpainting',
      'outpainting',
      'image_editing',
      'style_reference',
      'seed',
      'guidance_scale',
      'negative_prompt',
      'batch_generation'
    ]
  },
  flux: {
    providerName: 'flux',
    supportedResolutions: ['1024x1024', '1536x1536'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '4:3'],
    supportsMultiImage: true,
    supportsTransparency: false,
    supportsInpainting: false,
    supportsOutpainting: false,
    supportsImageEditing: false,
    supportsStyleReference: true,
    supportsCharacterReference: false,
    supportsSeed: true,
    supportsGuidanceScale: true,
    supportsNegativePrompt: true,
    supportsBatchGeneration: true,
    maxPromptLength: 2048,
    maxImagesPerRequest: 4,
    features: [
      'multi_image',
      'style_reference',
      'seed',
      'guidance_scale',
      'negative_prompt',
      'batch_generation'
    ]
  },
  generic: {
    providerName: 'generic',
    supportedResolutions: ['1024x1024'],
    supportedAspectRatios: ['1:1', '16:9'],
    supportsMultiImage: false,
    supportsTransparency: false,
    supportsInpainting: false,
    supportsOutpainting: false,
    supportsImageEditing: false,
    supportsStyleReference: false,
    supportsCharacterReference: false,
    supportsSeed: true,
    supportsGuidanceScale: false,
    supportsNegativePrompt: true,
    supportsBatchGeneration: false,
    maxPromptLength: 512,
    maxImagesPerRequest: 1,
    features: ['seed', 'negative_prompt']
  }
};

const activeGenerations = new Map<string, AbortController>();

export function resolveProviderCapabilities(provider: string): ProviderCapabilities {
  const norm = provider.toLowerCase() as AIProvider;
  return PROVIDER_CAPABILITIES_REGISTRY[norm] || PROVIDER_CAPABILITIES_REGISTRY.generic;
}

export function supportsFeature(provider: string, feature: ProviderFeature): boolean {
  const caps = resolveProviderCapabilities(provider);
  return caps.features.includes(feature);
}

export function selectOptimalProvider(requirements: Partial<ProviderCapabilities>): AIProvider {
  const providers: AIProvider[] = ['gemini', 'imagen', 'sdxl', 'flux'];

  let bestProvider: AIProvider = 'gemini';
  let maxMatchedScore = -1;

  for (const p of providers) {
    const caps = PROVIDER_CAPABILITIES_REGISTRY[p];
    let score = 0;

    if (requirements.supportsTransparency && caps.supportsTransparency) score += 10;
    if (requirements.supportsCharacterReference && caps.supportsCharacterReference) score += 10;
    if (requirements.supportsInpainting && caps.supportsInpainting) score += 5;
    if (requirements.supportsOutpainting && caps.supportsOutpainting) score += 5;
    if (requirements.supportsImageEditing && caps.supportsImageEditing) score += 5;
    if (requirements.supportsStyleReference && caps.supportsStyleReference) score += 5;

    if (requirements.features) {
      for (const feat of requirements.features) {
        if (caps.features.includes(feat)) {
          score += 2;
        }
      }
    }

    if (score > maxMatchedScore) {
      maxMatchedScore = score;
      bestProvider = p;
    }
  }

  return bestProvider;
}

export function validatePromptPackage(pkg: PromptPackage, provider: string = 'gemini'): ProviderValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const caps = resolveProviderCapabilities(provider);

  if (!pkg || !pkg.positivePrompt) {
    errors.push('Missing positive prompt in PromptPackage');
  } else if (pkg.positivePrompt.length > caps.maxPromptLength) {
    warnings.push(`Positive prompt length (${pkg.positivePrompt.length}) exceeds ${provider} limit (${caps.maxPromptLength}). Truncation will occur.`);
  }

  if (!pkg.metadata || !pkg.metadata.fusedConcept) {
    warnings.push('PromptPackage metadata is incomplete or missing fusedConcept');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function buildProviderRequest(
  pkg: PromptPackage,
  provider: string = 'gemini',
  overrides: Partial<ProviderRequest> = {}
): ProviderRequest {
  const normProvider = provider.toLowerCase() as AIProvider;
  const caps = resolveProviderCapabilities(normProvider);

  let rawPrompt = pkg.positivePrompt;
  if (normProvider === 'imagen' && pkg.providerOverrides.imagen) {
    rawPrompt = pkg.providerOverrides.imagen;
  } else if (normProvider === 'sdxl' && pkg.providerOverrides.sdxl) {
    rawPrompt = pkg.providerOverrides.sdxl;
  } else if (normProvider === 'flux' && pkg.providerOverrides.flux) {
    rawPrompt = pkg.providerOverrides.flux;
  } else if (normProvider === 'gemini' && pkg.providerOverrides.gemini) {
    rawPrompt = pkg.providerOverrides.gemini;
  }

  const truncatedPrompt = rawPrompt.slice(0, caps.maxPromptLength);
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    id: requestId,
    provider: normProvider,
    prompt: truncatedPrompt,
    negativePrompt: pkg.negativePrompt || '',
    aspectRatio: overrides.aspectRatio || '16:9',
    resolution: overrides.resolution || '1024x1024',
    imageCount: Math.min(overrides.imageCount || 1, caps.maxImagesPerRequest),
    seed: overrides.seed ?? Math.floor(Math.random() * 1000000),
    guidanceScale: overrides.guidanceScale ?? 7.5,
    styleReferenceUrl: overrides.styleReferenceUrl,
    metadata: {
      fusedConcept: pkg.metadata?.fusedConcept || 'LOOK VISION Theme',
      primaryEntity: pkg.metadata?.primaryEntity || 'Universal Entity',
      category: pkg.metadata?.category || 'Fashion',
      mood: pkg.metadata?.mood || 'Luxury',
      dominantColor: pkg.metadata?.dominantColor || '#0a192f'
    },
    timeoutMs: overrides.timeoutMs || 30000
  };
}

export function normalizeProviderResponse(response: ProviderResponse): NormalizedGenerationResult {
  const primaryImageUrl = response.images && response.images.length > 0
    ? response.images[0]
    : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80';

  const success = response.status === 'completed' && response.images.length > 0;

  return {
    generationId: response.requestId,
    success,
    provider: response.provider,
    imageUrls: response.images.length > 0 ? response.images : [primaryImageUrl],
    primaryImageUrl,
    status: response.status,
    generationTimeMs: response.generationTimeMs,
    seed: response.seedUsed,
    metadata: {
      fusedConcept: response.rawPayload?.fusedConcept || 'LOOK VISION Theme Synthesis',
      primaryEntity: response.rawPayload?.primaryEntity || 'Primary Identity',
      category: response.rawPayload?.category || 'Atmospheric Elements',
      mood: response.rawPayload?.mood || 'Serene',
      dominantColor: response.rawPayload?.dominantColor || '#0a192f',
      providerUsed: response.provider,
      generationTimeMs: response.generationTimeMs,
      seed: response.seedUsed,
      aspectRatio: response.rawPayload?.aspectRatio || '16:9',
      resolution: response.rawPayload?.resolution || '1024x1024'
    },
    warnings: response.warnings || [],
    error: response.error,
    costEstimate: response.costEstimate || 0.02
  };
}

export function cancelGeneration(generationId: string): boolean {
  if (activeGenerations.has(generationId)) {
    const controller = activeGenerations.get(generationId)!;
    controller.abort();
    activeGenerations.delete(generationId);
    return true;
  }
  return false;
}

export async function generateImage(
  pkg: PromptPackage,
  options: Partial<ProviderRequest> = {}
): Promise<NormalizedGenerationResult> {
  const provider = options.provider || selectOptimalProvider({ features: ['style_reference', 'negative_prompt'] });
  const request = buildProviderRequest(pkg, provider, options);

  const controller = new AbortController();
  activeGenerations.set(request.id, controller);

  const startTime = Date.now();

  try {
    const mockImageUrls = [
      `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80&seed=${request.seed}`,
      `https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80&seed=${request.seed + 1}`
    ];

    const generatedCount = Math.min(request.imageCount, mockImageUrls.length);
    const resultImages = mockImageUrls.slice(0, generatedCount);

    const generationTimeMs = Date.now() - startTime;

    const providerResponse: ProviderResponse = {
      requestId: request.id,
      provider: request.provider,
      status: 'completed',
      images: resultImages,
      generationTimeMs,
      seedUsed: request.seed || 42,
      costEstimate: 0.015,
      rawPayload: {
        ...request.metadata,
        aspectRatio: request.aspectRatio,
        resolution: request.resolution
      }
    };

    activeGenerations.delete(request.id);
    return normalizeProviderResponse(providerResponse);
  } catch (err: any) {
    activeGenerations.delete(request.id);
    const failureResponse: ProviderResponse = {
      requestId: request.id,
      provider: request.provider,
      status: 'failed',
      images: [],
      generationTimeMs: Date.now() - startTime,
      seedUsed: request.seed || 0,
      error: err.message || 'Generation failed',
      rawPayload: request.metadata
    };
    return normalizeProviderResponse(failureResponse);
  }
}

export async function generateImages(
  pkg: PromptPackage,
  count: number = 2,
  options: Partial<ProviderRequest> = {}
): Promise<NormalizedGenerationResult[]> {
  const results: NormalizedGenerationResult[] = [];
  for (let i = 0; i < count; i++) {
    const seed = (options.seed || 1000) + i * 7;
    const res = await generateImage(pkg, { ...options, imageCount: 1, seed });
    results.push(res);
  }
  return results;
}

export async function generatePreview(
  pkg: PromptPackage,
  options: Partial<ProviderRequest> = {}
): Promise<NormalizedGenerationResult> {
  return generateImage(pkg, {
    ...options,
    resolution: '512x512',
    imageCount: 1,
    timeoutMs: 10000
  });
}
