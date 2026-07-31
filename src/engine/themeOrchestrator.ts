import {
  KnowledgeEntity,
  searchEntity,
  expandSemanticGraph
} from './themeKnowledgeBase';

import {
  analyzePrompt,
  ThemeCandidate,
  ThemeDNA,
  ThemePalette,
  ThemeLighting,
  ThemeComposition,
  ThemeMood,
  ThemeMaterialProfile,
  ThemeBehaviourProfile,
  ThemeEnvironment,
  ThemeBlueprint,
  ThemeRecommendation
} from './themeIntelligenceEngine';

export interface ThemeExecutionResult {
  themeDNA: ThemeDNA;
  blueprint: ThemeBlueprint;
  themeMood: ThemeMood;
  palette: ThemePalette;
  lighting: ThemeLighting;
  materials: ThemeMaterialProfile;
  behaviours: ThemeBehaviourProfile[];
  environment: ThemeEnvironment;
  cameraComposition: ThemeComposition;
  semanticGraph: KnowledgeEntity[];
  rankedEntities: ThemeCandidate[];
  recommendations: ThemeRecommendation;
  fusedConcept: string;
  executionTimestamp: number;
}

const analysisCache = new Map<string, ThemeExecutionResult>();

function getOrComputeAnalysis(prompt: string): ThemeExecutionResult {
  const cacheKey = prompt.trim().toLowerCase();
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey)!;
  }

  const analysis = analyzePrompt(prompt);
  const directEntities = searchEntity(prompt);
  const matchedIds = directEntities.map(e => e.id);
  const semanticGraph = expandSemanticGraph(matchedIds, 2);

  const behaviours: ThemeBehaviourProfile[] = analysis.candidates.map(candidate => ({
    primaryBehaviour: candidate.entity.behaviour.name,
    intensity: candidate.entity.behaviour.intensity,
    speed: candidate.entity.behaviour.speed,
    energy: candidate.entity.behaviour.energy,
    density: candidate.entity.behaviour.density,
    tags: candidate.entity.behaviour.tags
  }));

  const result: ThemeExecutionResult = {
    themeDNA: analysis.themeDNA,
    blueprint: analysis.themeBlueprint,
    themeMood: analysis.mood,
    palette: analysis.palette,
    lighting: analysis.lighting,
    materials: analysis.themeBlueprint.materials,
    behaviours,
    environment: analysis.themeBlueprint.environment,
    cameraComposition: analysis.composition,
    semanticGraph,
    rankedEntities: analysis.candidates,
    recommendations: analysis.recommendations,
    fusedConcept: analysis.fusedConcept,
    executionTimestamp: Date.now()
  };

  analysisCache.set(cacheKey, result);
  return result;
}

export function analyseTheme(prompt: string): ThemeExecutionResult {
  return getOrComputeAnalysis(prompt);
}

export function generateThemeBlueprint(prompt: string): ThemeBlueprint {
  return getOrComputeAnalysis(prompt).blueprint;
}

export function generateThemeDNA(prompt: string): ThemeDNA {
  return getOrComputeAnalysis(prompt).themeDNA;
}

export function recommendVisualLanguage(prompt: string): ThemeRecommendation {
  return getOrComputeAnalysis(prompt).recommendations;
}

export function expandThemeSemantics(prompt: string, depth: number = 2): KnowledgeEntity[] {
  const directEntities = searchEntity(prompt);
  const matchedIds = directEntities.map(e => e.id);
  return expandSemanticGraph(matchedIds, depth);
}

export function resolveThemeEntities(prompt: string): KnowledgeEntity[] {
  return getOrComputeAnalysis(prompt).rankedEntities.map(c => c.entity);
}

export function resolveBehaviourProfiles(prompt: string): ThemeBehaviourProfile[] {
  return getOrComputeAnalysis(prompt).behaviours;
}

export function resolveMaterialProfiles(prompt: string): ThemeMaterialProfile {
  return getOrComputeAnalysis(prompt).materials;
}

export function resolveLightingBlueprint(prompt: string): ThemeLighting {
  return getOrComputeAnalysis(prompt).lighting;
}

export function resolveCompositionBlueprint(prompt: string): ThemeComposition {
  return getOrComputeAnalysis(prompt).cameraComposition;
}

export function resolveEnvironmentBlueprint(prompt: string): ThemeEnvironment {
  return getOrComputeAnalysis(prompt).environment;
}

export function resolveThemeMood(prompt: string): ThemeMood {
  return getOrComputeAnalysis(prompt).themeMood;
}
