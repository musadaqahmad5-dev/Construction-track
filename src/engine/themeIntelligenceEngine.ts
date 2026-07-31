import {
  KnowledgeEntity,
  BehaviourDescriptor,
  SurfaceDescriptor,
  MaterialDescriptor,
  searchEntity,
  calculateSemanticSimilarity,
  expandSemanticGraph
} from './themeKnowledgeBase';

export interface ThemeCandidate {
  entity: KnowledgeEntity;
  semanticScore: number;
  graphScore: number;
  behaviourScore: number;
  materialScore: number;
  foundationScore: number;
  finalScore: number;
}

export interface ThemeDNA {
  primaryEntity: KnowledgeEntity;
  secondaryEntities: KnowledgeEntity[];
  supportingEntities: KnowledgeEntity[];
  physicalObjects: KnowledgeEntity[];
  phenomena: KnowledgeEntity[];
  materials: MaterialDescriptor[];
  behaviours: BehaviourDescriptor[];
  surfaceTypes: SurfaceDescriptor[];
  environmentalConditions: string[];
  energyTypes: string[];
  motionTypes: string[];
  scientificObjects: KnowledgeEntity[];
  luxuryObjects: KnowledgeEntity[];
  foundationObjects: KnowledgeEntity[];
}

export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  shadow: string;
  neutral: string;
  allColors: string[];
}

export interface ThemeLighting {
  style: string;
  color: string;
  intensity: number;
  direction: string;
  volumetric: boolean;
  ambientGlow: string;
  specular: string;
}

export interface ThemeComposition {
  cameraStyle: string;
  focusPoint: string;
  visualHierarchy: string[];
  aspectRatio: string;
  depthOfField: string;
}

export interface ThemeMood {
  primary: string;
  secondary: string[];
  energy: number;
  elegance: number;
  mystery: number;
}

export interface ThemeMaterialProfile {
  primaryMaterial: string;
  texture: string;
  translucency: number;
  reflectivity: number;
  finish: string;
}

export interface ThemeBehaviourProfile {
  primaryBehaviour: string;
  intensity: number;
  speed: number;
  energy: number;
  density: number;
  tags: string[];
}

export interface ThemeEnvironment {
  ground: string;
  sky: string;
  background: string;
  foreground: string;
  atmosphere: string;
  energy: string;
  motion: string;
  optics: string;
}

export interface ThemeBlueprint {
  environment: ThemeEnvironment;
  materials: ThemeMaterialProfile;
  textures: string[];
  lighting: ThemeLighting;
  reflections: string;
  composition: ThemeComposition;
  focus: string;
  visualHierarchy: string[];
}

export interface ThemeRecommendation {
  recommendedCamera: string;
  recommendedLighting: string;
  recommendedContrast: string;
  recommendedSaturation: string;
  recommendedMaterial: string;
  recommendedBackground: string;
  recommendedMotion: string;
  recommendedDetailLevel: string;
}

export interface ThemeAnalysisResult {
  themeDNA: ThemeDNA;
  themeBlueprint: ThemeBlueprint;
  palette: ThemePalette;
  lighting: ThemeLighting;
  mood: ThemeMood;
  composition: ThemeComposition;
  camera: string;
  scores: Record<string, number>;
  recommendations: ThemeRecommendation;
  candidates: ThemeCandidate[];
  fusedConcept: string;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'theme', 'style', 'mode', 'look', 'vision', 'vibe'
]);

function extractKeywords(prompt: string): string[] {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

function computeEntityScores(
  entity: KnowledgeEntity,
  keywords: string[],
  allMatched: KnowledgeEntity[]
): ThemeCandidate {
  let semanticScore = 0;
  const nameTokens = entity.name.toLowerCase().split(/\s+/);
  const idToken = entity.id.toLowerCase();
  const aliasTokens = entity.aliases.flatMap(a => a.toLowerCase().split(/\s+/));
  const tagTokens = entity.tags.flatMap(t => t.toLowerCase().split(/\s+/));

  for (const kw of keywords) {
    if (idToken === kw) semanticScore += 1.0;
    else if (idToken.includes(kw)) semanticScore += 0.6;

    if (nameTokens.includes(kw)) semanticScore += 0.8;
    if (aliasTokens.includes(kw)) semanticScore += 0.7;
    if (tagTokens.includes(kw)) semanticScore += 0.5;
  }

  let graphScore = 0;
  for (const other of allMatched) {
    if (other.id !== entity.id) {
      graphScore += calculateSemanticSimilarity(entity.id, other.id);
    }
  }
  if (allMatched.length > 1) {
    graphScore = graphScore / (allMatched.length - 1);
  }

  const behaviourScore = (entity.behaviour.energy + entity.behaviour.intensity) / 2;

  let materialScore = 0.5;
  if (entity.material) {
    materialScore = (entity.material.density + entity.material.durability) / 2;
  } else if (entity.surface) {
    materialScore = entity.surface.reflectivity;
  }

  let foundationScore = 0.3;
  if (entity.isPermanentCandidate) foundationScore += 0.4;
  if (entity.isFoundationCandidate) foundationScore += 0.3;

  const finalScore =
    semanticScore * 0.4 +
    graphScore * 0.25 +
    behaviourScore * 0.15 +
    materialScore * 0.1 +
    foundationScore * 0.1;

  return {
    entity,
    semanticScore: Math.min(1.0, semanticScore),
    graphScore,
    behaviourScore,
    materialScore,
    foundationScore,
    finalScore
  };
}

function buildPalette(candidates: ThemeCandidate[]): ThemePalette {
  const primaryEntity = candidates[0].entity;
  const primary = primaryEntity.dominantColor;
  
  let secondary = primaryEntity.secondaryColors[0] || '#1e293b';
  let accent = primaryEntity.secondaryColors[1] || '#38bdf8';
  let glow = '#ffffff';

  const phenomenonCandidate = candidates.find(c => c.entity.phenomenon);
  if (phenomenonCandidate && phenomenonCandidate.entity.phenomenon) {
    accent = phenomenonCandidate.entity.phenomenon.spectrum[0] || accent;
    glow = phenomenonCandidate.entity.phenomenon.spectrum[1] || glow;
  }

  if (candidates.length > 1) {
    secondary = candidates[1].entity.dominantColor;
  }

  const shadow = '#030712';
  const neutral = '#f8fafc';

  const rawColors = [
    primary,
    secondary,
    accent,
    glow,
    shadow,
    neutral,
    ...primaryEntity.secondaryColors,
    ...(candidates[1]?.entity.secondaryColors || [])
  ];

  const allColors = Array.from(new Set(rawColors));

  return {
    primary,
    secondary,
    accent,
    glow,
    shadow,
    neutral,
    allColors
  };
}

function inferLighting(primary: KnowledgeEntity, phenomenon?: KnowledgeEntity): ThemeLighting {
  const phen = phenomenon?.phenomenon;
  const brightness = phen?.brightness ?? (primary.behaviour.energy * 0.8);
  const glowLevel = phen?.glow ?? (primary.behaviour.intensity * 0.7);

  const style = phen?.coat
    ? `${phen.coat} Specular Illumination`
    : `${primary.behaviour.category} Luminance`;

  const direction = primary.isFoundationCandidate ? 'Omnidirectional Ambient' : 'Directional Specular Ray';

  return {
    style,
    color: primary.secondaryColors[0] || primary.dominantColor,
    intensity: Math.round((brightness + 0.3) * 100) / 100,
    direction,
    volumetric: glowLevel > 0.6,
    ambientGlow: phen?.spectrum[0] || primary.dominantColor,
    specular: phen?.spectrum[1] || '#ffffff'
  };
}

function inferComposition(primary: KnowledgeEntity): ThemeComposition {
  const isHighEnergy = primary.behaviour.energy > 0.7;
  const isMicroScale = primary.behaviour.scale.toLowerCase().includes('micro');
  
  const cameraStyle = isMicroScale
    ? 'Macro Precision Lens'
    : isHighEnergy
    ? 'Dynamic Kinematic Angle'
    : 'Cinematic Panoramic Frame';

  const focusPoint = primary.name;
  const depthOfField = isMicroScale ? 'Shallow Facet Focus' : 'Deep Atmospheric Perspective';

  return {
    cameraStyle,
    focusPoint,
    visualHierarchy: [
      `Foreground: ${primary.name} Specular Facets`,
      'Midground: Phenomenon Energy Field',
      'Background: Deep Environmental Canvas'
    ],
    aspectRatio: '16:9',
    depthOfField
  };
}

function inferMood(primary: KnowledgeEntity, candidates: ThemeCandidate[]): ThemeMood {
  const primaryMood = primary.behaviour.mood;
  const secondaryMoods = candidates
    .slice(1, 4)
    .map(c => c.entity.behaviour.mood);

  return {
    primary: primaryMood,
    secondary: secondaryMoods,
    energy: primary.behaviour.energy,
    elegance: primary.behaviour.category === 'Luxury' || primary.behaviour.category === 'Crystal' ? 0.95 : 0.75,
    mystery: primary.behaviour.category === 'Mystical' || primary.behaviour.category === 'Infinite' ? 0.9 : 0.5
  };
}

function buildBlueprint(
  primary: KnowledgeEntity,
  candidates: ThemeCandidate[],
  lighting: ThemeLighting,
  composition: ThemeComposition
): ThemeBlueprint {
  const phenEntity = candidates.find(c => c.entity.phenomenon)?.entity;
  const surfEntity = candidates.find(c => c.entity.surface)?.entity;
  const matEntity = candidates.find(c => c.entity.material)?.entity;

  const ground = surfEntity?.surface?.name || 'Basalt Foundation Lattice';
  const sky = primary.isPermanentCandidate ? primary.name : 'Cosmic Ether Void';
  const background = `Abyssal ${primary.category} Void`;
  const foreground = phenEntity?.phenomenon?.name || `${primary.name} Dispersion`;

  return {
    environment: {
      ground,
      sky,
      background,
      foreground,
      atmosphere: primary.behaviour.mood,
      energy: `${primary.behaviour.category} Energy Stream`,
      motion: primary.behaviour.name,
      optics: phenEntity?.phenomenon?.name || 'Specular Refraction'
    },
    materials: {
      primaryMaterial: matEntity?.material?.name || primary.name,
      texture: matEntity?.material?.texture || surfEntity?.surface?.tactileFeel || 'Polished Smoothness',
      translucency: matEntity?.material?.translucency ?? 0.5,
      reflectivity: surfEntity?.surface?.reflectivity ?? 0.7,
      finish: surfEntity?.surface?.finish || phenEntity?.phenomenon?.coat || 'Glossy'
    },
    textures: [
      matEntity?.material?.texture || 'Smooth Fabric',
      surfEntity?.surface?.finish || 'Pearl Satin'
    ],
    lighting,
    reflections: phenEntity?.phenomenon?.glassEffect ? 'High Index Refraction' : 'Diffuse Reflection',
    composition,
    focus: primary.name,
    visualHierarchy: composition.visualHierarchy
  };
}

function buildRecommendations(primary: KnowledgeEntity, blueprint: ThemeBlueprint): ThemeRecommendation {
  return {
    recommendedCamera: blueprint.composition.cameraStyle,
    recommendedLighting: blueprint.lighting.style,
    recommendedContrast: primary.behaviour.intensity > 0.7 ? 'High Contrast' : 'Subtle Balanced',
    recommendedSaturation: primary.phenomenon?.energyLevel && primary.phenomenon.energyLevel > 0.8 ? 'Vibrant Spectrum' : 'Refined Saturation',
    recommendedMaterial: blueprint.materials.primaryMaterial,
    recommendedBackground: blueprint.environment.background,
    recommendedMotion: blueprint.environment.motion,
    recommendedDetailLevel: primary.behaviour.scale === 'Micro-Precision' ? 'Ultra Fine Precision' : 'High Quality'
  };
}

export function analyzePrompt(prompt: string): ThemeAnalysisResult {
  const keywords = extractKeywords(prompt);
  const directEntities = searchEntity(prompt);

  const matchedIds = directEntities.map(e => e.id);
  const expandedEntities = expandSemanticGraph(matchedIds, 2);

  const entityMap = new Map<string, KnowledgeEntity>();
  for (const e of [...directEntities, ...expandedEntities]) {
    entityMap.set(e.id, e);
  }

  const allUnique = Array.from(entityMap.values());

  const scoredCandidates = allUnique.map(entity =>
    computeEntityScores(entity, keywords, allUnique)
  );

  scoredCandidates.sort((a, b) => b.finalScore - a.finalScore);

  const topCandidate = scoredCandidates[0];
  const primaryEntity = topCandidate ? topCandidate.entity : directEntities[0];

  const secondaryEntities = scoredCandidates.slice(1, 4).map(c => c.entity);
  const supportingEntities = scoredCandidates.slice(4).map(c => c.entity);

  const physicalObjects = scoredCandidates.filter(c => c.entity.isPhysical).map(c => c.entity);
  const phenomena = scoredCandidates.filter(c => c.entity.phenomenon !== undefined || c.entity.isPhenomenonCandidate).map(c => c.entity);
  const materials = scoredCandidates.filter(c => c.entity.material !== undefined).map(c => c.entity.material!);
  const behaviours = scoredCandidates.map(c => c.entity.behaviour);
  const surfaceTypes = scoredCandidates.filter(c => c.entity.surface !== undefined).map(c => c.entity.surface!);

  const environmentalConditions = Array.from(
    new Set(scoredCandidates.flatMap(c => c.entity.behaviour.tags))
  );

  const energyTypes = Array.from(
    new Set(scoredCandidates.map(c => c.entity.behaviour.category))
  );

  const motionTypes = Array.from(
    new Set(scoredCandidates.map(c => c.entity.behaviour.name))
  );

  const scientificObjects = scoredCandidates
    .filter(c => c.entity.category === 'Scientific Objects' || c.entity.category === 'Artificial Objects')
    .map(c => c.entity);

  const luxuryObjects = scoredCandidates
    .filter(c => c.entity.category === 'Luxury Objects')
    .map(c => c.entity);

  const foundationObjects = scoredCandidates
    .filter(c => c.entity.isFoundationCandidate)
    .map(c => c.entity);

  const themeDNA: ThemeDNA = {
    primaryEntity,
    secondaryEntities,
    supportingEntities,
    physicalObjects,
    phenomena,
    materials,
    behaviours,
    surfaceTypes,
    environmentalConditions,
    energyTypes,
    motionTypes,
    scientificObjects,
    luxuryObjects,
    foundationObjects
  };

  const palette = buildPalette(scoredCandidates);
  const phenEntity = phenomena[0];
  const lighting = inferLighting(primaryEntity, phenEntity);
  const composition = inferComposition(primaryEntity);
  const mood = inferMood(primaryEntity, scoredCandidates);
  const themeBlueprint = buildBlueprint(primaryEntity, scoredCandidates, lighting, composition);
  const recommendations = buildRecommendations(primaryEntity, themeBlueprint);

  const fusedConcept = secondaryEntities.length > 0
    ? `${primaryEntity.name} + ${secondaryEntities[0].name} Synthesis`
    : `${primaryEntity.name} Pure Entity`;

  const scores: Record<string, number> = {};
  for (const c of scoredCandidates) {
    scores[c.entity.id] = Math.round(c.finalScore * 100) / 100;
  }

  return {
    themeDNA,
    themeBlueprint,
    palette,
    lighting,
    mood,
    composition,
    camera: composition.cameraStyle,
    scores,
    recommendations,
    candidates: scoredCandidates,
    fusedConcept
  };
}
