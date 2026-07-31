import { ThemeExecutionResult, analyseTheme } from './themeOrchestrator';

export interface ProviderOverrides {
  gemini: string;
  imagen: string;
  sdxl: string;
  flux: string;
  generic: string;
}

export interface PromptMetadata {
  fusedConcept: string;
  primaryEntity: string;
  category: string;
  mood: string;
  dominantColor: string;
  executionTimestamp: number;
}

export interface PromptPackage {
  positivePrompt: string;
  negativePrompt: string;
  stylePrompt: string;
  lightingPrompt: string;
  cameraPrompt: string;
  compositionPrompt: string;
  environmentPrompt: string;
  materialPrompt: string;
  colorPrompt: string;
  metadata: PromptMetadata;
  providerOverrides: ProviderOverrides;
}

const promptPackageCache = new Map<string, PromptPackage>();

function resolveExecutionResult(input: string | ThemeExecutionResult): ThemeExecutionResult {
  if (typeof input === 'string') {
    return analyseTheme(input);
  }
  return input;
}

export function buildStylePrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const primary = result.themeDNA.primaryEntity;
  const category = primary.category;
  const mood = result.themeMood.primary;

  const styleDescriptor = primary.behaviour.category === 'Luxury' || primary.behaviour.category === 'Crystal'
    ? 'High Fashion Editorial, Haute Couture Atelier, Premium Dark Luxury Aesthetic'
    : primary.behaviour.category === 'Electric' || primary.behaviour.category === 'Mechanical'
    ? 'Cyberpunk Neo Tokyo, Kinetic Futuristic Cyber Architecture, Ultra-Tech Fashion'
    : primary.behaviour.category === 'Organic' || primary.behaviour.category === 'Natural'
    ? 'Biomorphic Organic Atelier, Natural Atmospheric Couture, Earth Horizon'
    : 'Modern Minimalist Avant-Garde Fashion, High-End Architectural Silhouette';

  return `Style: ${styleDescriptor}, Category: ${category}, Mood: ${mood}`;
}

export function buildLightingPrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const lighting = result.lighting;
  
  const volumetricStr = lighting.volumetric ? 'volumetric rays with subtle atmospheric glow' : 'clean specular illumination';
  return `Lighting: ${lighting.style}, Direction: ${lighting.direction}, Ambient Glow: ${lighting.ambientGlow}, Specular: ${lighting.specular}, Intensity: ${lighting.intensity}, ${volumetricStr}`;
}

export function buildCameraPrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const comp = result.cameraComposition;
  const rec = result.recommendations;

  return `Camera: ${comp.cameraStyle}, Focus: ${comp.focusPoint}, Depth of Field: ${comp.depthOfField}, Recommended Lens: ${rec.recommendedCamera}, Aspect Ratio: ${comp.aspectRatio}`;
}

export function buildMaterialPrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const mat = result.materials;

  return `Materials & Texture: ${mat.primaryMaterial}, Texture Feel: ${mat.texture}, Surface Finish: ${mat.finish}, Reflectivity: ${mat.reflectivity * 100}%, Translucency: ${mat.translucency * 100}%`;
}

export function buildEnvironmentPrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const env = result.environment;

  return `Environment: Background: ${env.background}, Sky/Atmosphere: ${env.sky}, Ground: ${env.ground}, Foreground Dispersion: ${env.foreground}, Motion: ${env.motion}, Energy Stream: ${env.energy}`;
}

export function buildColorPrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const p = result.palette;

  return `Color Palette: Dominant ${p.primary}, Secondary ${p.secondary}, Accent ${p.accent}, Glow ${p.glow}, Shadow ${p.shadow}, Neutral ${p.neutral}`;
}

export function buildCompositionPrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const comp = result.cameraComposition;
  const hierarchy = comp.visualHierarchy.join(' | ');

  return `Composition: Rule of Thirds, Golden Ratio Depth, Visual Hierarchy: ${hierarchy}`;
}

export function buildNegativePrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);
  const primary = result.themeDNA.primaryEntity;

  const baseNegative = 'low quality, blurry, duplicate limbs, deformed anatomy, watermark, text, signature, logos, oversaturated, compression artifacts, bad perspective, noise, out of frame, extra fingers';

  const categoryNegative = primary.category === 'Luxury Objects' || primary.category === 'Atmospheric Elements'
    ? 'cheap materials, plastic sheen, cluttered background, cartoonish rendering, low poly'
    : primary.category === 'Artificial Objects' || primary.category === 'Energy Types'
    ? 'dull muted colors, muddy textures, organic decay, vintage film grain'
    : 'flat lighting, harsh shadows, overexposed highlights';

  return `${baseNegative}, ${categoryNegative}`;
}

export function buildPositivePrompt(input: string | ThemeExecutionResult): string {
  const result = resolveExecutionResult(input);

  const style = buildStylePrompt(result);
  const environment = buildEnvironmentPrompt(result);
  const material = buildMaterialPrompt(result);
  const lighting = buildLightingPrompt(result);
  const camera = buildCameraPrompt(result);
  const color = buildColorPrompt(result);
  const composition = buildCompositionPrompt(result);

  const primaryName = result.themeDNA.primaryEntity.name;
  const fused = result.fusedConcept;

  return `LOOK VISION High Fashion Masterpiece: Concept: ${fused} featuring ${primaryName}. ${style}. ${environment}. ${material}. ${lighting}. ${camera}. ${color}. ${composition}. Ultra-high detail, 8k resolution, ray-traced reflections, photorealistic fashion campaign rendering.`;
}

export function buildPrompt(input: string | ThemeExecutionResult): string {
  return buildPositivePrompt(input);
}

export function buildPromptPackage(input: string | ThemeExecutionResult): PromptPackage {
  const result = resolveExecutionResult(input);
  const cacheKey = `${result.themeDNA.primaryEntity.id}_${result.fusedConcept}_${result.executionTimestamp}`;

  if (promptPackageCache.has(cacheKey)) {
    return promptPackageCache.get(cacheKey)!;
  }

  const positivePrompt = buildPositivePrompt(result);
  const negativePrompt = buildNegativePrompt(result);
  const stylePrompt = buildStylePrompt(result);
  const lightingPrompt = buildLightingPrompt(result);
  const cameraPrompt = buildCameraPrompt(result);
  const compositionPrompt = buildCompositionPrompt(result);
  const environmentPrompt = buildEnvironmentPrompt(result);
  const materialPrompt = buildMaterialPrompt(result);
  const colorPrompt = buildColorPrompt(result);

  const metadata: PromptMetadata = {
    fusedConcept: result.fusedConcept,
    primaryEntity: result.themeDNA.primaryEntity.name,
    category: result.themeDNA.primaryEntity.category,
    mood: result.themeMood.primary,
    dominantColor: result.palette.primary,
    executionTimestamp: result.executionTimestamp
  };

  const providerOverrides: ProviderOverrides = {
    gemini: `${positivePrompt}\n\n[Aspect Ratio: ${result.cameraComposition.aspectRatio}] [Quality: Ultra High]`,
    imagen: `${positivePrompt}, highly detailed photograph, studio lighting, --ar ${result.cameraComposition.aspectRatio}`,
    sdxl: `${positivePrompt}, masterwork fashion photography, 8k, award winning, masterpiece <lora:fashion_luxury:0.85>`,
    flux: `[PROMPT] ${positivePrompt} [/PROMPT] [NEG] ${negativePrompt} [/NEG]`,
    generic: positivePrompt
  };

  const pkg: PromptPackage = {
    positivePrompt,
    negativePrompt,
    stylePrompt,
    lightingPrompt,
    cameraPrompt,
    compositionPrompt,
    environmentPrompt,
    materialPrompt,
    colorPrompt,
    metadata,
    providerOverrides
  };

  promptPackageCache.set(cacheKey, pkg);
  return pkg;
}
