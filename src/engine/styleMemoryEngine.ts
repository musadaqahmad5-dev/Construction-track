import {
  AIProvider
} from './aiProviderAdapter';

import {
  ThemeExecutionResult
} from './themeOrchestrator';

import {
  Asset
} from './assetLibraryEngine';

import {
  GenerationSession
} from './generationSessionManager';

export interface StyleDNAProfile {
  primaryStyle: string;
  secondaryStyle: string;
  styleConfidence: number;
  fashionIdentity: string;
  luxuryLevel: number;
  minimalismLevel: number;
  creativityLevel: number;
  complexityLevel: number;
}

export interface ColorPreferenceMemory {
  favoriteColors: string[];
  avoidedColors: string[];
  mostGeneratedColors: string[];
  seasonalColors: string[];
  colorFrequency: Record<string, number>;
}

export interface MaterialPreferenceMemory {
  favoriteMaterials: string[];
  rejectedMaterials: string[];
  frequentlyUsedMaterials: string[];
  luxuryMaterials: string[];
  organicMaterials: string[];
}

export interface LightingPreferenceMemory {
  favoriteLighting: string[];
  rejectedLighting: string[];
  mostSuccessfulLighting: string[];
  goldenHourPreference: number;
  studioPreference: number;
  softLightPreference: number;
  neonPreference: number;
  moonlightPreference: number;
}

export interface CameraPreferenceMemory {
  favoriteCameraAngles: string[];
  lensTypes: string[];
  focalLengths: string[];
  portraitStyle: string;
  compositionStyle: string;
}

export interface EnvironmentPreferenceMemory {
  favoriteEnvironments: string[];
  urbanScore: number;
  natureScore: number;
  luxuryScore: number;
  cyberScore: number;
  editorialScore: number;
  studioScore: number;
  runwayScore: number;
  architectureScore: number;
}

export interface UserBehaviourLearning {
  likes: number;
  dislikes: number;
  regenerations: number;
  downloads: number;
  shares: number;
  favoritesCount: number;
  totalTimeSpentSeconds: number;
  acceptanceRate: number;
}

export interface StyleGenerationHistoryEntry {
  id: string;
  timestamp: number;
  prompt: string;
  fusedConcept: string;
  provider: AIProvider;
  seed: number;
  generationTimeMs: number;
  success: boolean;
  cost: number;
  qualityScore: number;
  liked: boolean;
  favorited: boolean;
}

export interface StyleEvolutionPoint {
  dateKey: string;
  timestamp: number;
  primaryStyle: string;
  luxuryLevel: number;
  minimalismLevel: number;
  creativityLevel: number;
  topColor: string;
  topMaterial: string;
}

export interface StyleRecommendation {
  recommendedColors: string[];
  recommendedMaterials: string[];
  recommendedLighting: string[];
  recommendedComposition: string;
  recommendedEnvironment: string;
  recommendedProvider: AIProvider;
  suggestedThemeConcepts: string[];
}

export interface MemoryStatistics {
  totalMemoriesLogged: number;
  learningAccuracy: number;
  preferenceStability: number;
  recommendationAccuracy: number;
  styleConfidence: number;
  topColors: string[];
  topMaterials: string[];
  topEnvironments: string[];
  topProviders: AIProvider[];
}

export interface StyleMemory {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  profileVersion: number;
  styleDNA: StyleDNAProfile;
  colors: ColorPreferenceMemory;
  materials: MaterialPreferenceMemory;
  lighting: LightingPreferenceMemory;
  camera: CameraPreferenceMemory;
  environment: EnvironmentPreferenceMemory;
  behaviour: UserBehaviourLearning;
  history: StyleGenerationHistoryEntry[];
  evolution: StyleEvolutionPoint[];
  statistics: MemoryStatistics;
}

export interface MemorySearchQuery {
  theme?: string;
  style?: string;
  mood?: string;
  material?: string;
  color?: string;
  provider?: AIProvider;
  environment?: string;
  startDate?: number;
  endDate?: number;
}

export interface StyleMemoryEventListener {
  onMemoryCreated?: (memory: StyleMemory) => void;
  onMemoryUpdated?: (memory: StyleMemory) => void;
  onLearningCompleted?: (memory: StyleMemory) => void;
  onRecommendationGenerated?: (recommendation: StyleRecommendation) => void;
}

export class StyleMemoryEngine {
  private memories: Map<string, StyleMemory> = new Map();
  private listeners: Set<StyleMemoryEventListener> = new Set();

  public addListener(listener: StyleMemoryEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getOrCreateMemory(userId: string = 'guest_user'): StyleMemory {
    if (this.memories.has(userId)) {
      return this.memories.get(userId)!;
    }

    const now = Date.now();
    const newMemory: StyleMemory = {
      id: `mem_${userId}_${now}`,
      userId,
      createdAt: now,
      updatedAt: now,
      profileVersion: 1,
      styleDNA: {
        primaryStyle: 'Modern Haute Couture',
        secondaryStyle: 'Minimalist Avant-Garde',
        styleConfidence: 0.85,
        fashionIdentity: 'Editorial Atelier',
        luxuryLevel: 0.9,
        minimalismLevel: 0.75,
        creativityLevel: 0.88,
        complexityLevel: 0.65
      },
      colors: {
        favoriteColors: ['#0a192f', '#f8fafc', '#38bdf8'],
        avoidedColors: ['#facc15'],
        mostGeneratedColors: ['#0a192f'],
        seasonalColors: ['#1e293b', '#e2e8f0'],
        colorFrequency: { '#0a192f': 12, '#f8fafc': 8, '#38bdf8': 5 }
      },
      materials: {
        favoriteMaterials: ['Silk Satin', 'Basalt Crystal', 'Polished Obsidian'],
        rejectedMaterials: ['Synthetic Nylon'],
        frequentlyUsedMaterials: ['Silk Satin', 'Polished Glass'],
        luxuryMaterials: ['Cashmere', 'Diamond Facet', 'Pearl Sheen'],
        organicMaterials: ['Raw Linen', 'Sculpted Leather']
      },
      lighting: {
        favoriteLighting: ['Specular Ray', 'Soft Rim Light', 'Volumetric Glow'],
        rejectedLighting: ['Harsh Direct Flash'],
        mostSuccessfulLighting: ['Volumetric Glow'],
        goldenHourPreference: 0.8,
        studioPreference: 0.9,
        softLightPreference: 0.85,
        neonPreference: 0.6,
        moonlightPreference: 0.75
      },
      camera: {
        favoriteCameraAngles: ['Cinematic Panoramic Frame', 'Macro Precision Lens'],
        lensTypes: ['85mm Prime', '35mm Anamorphic'],
        focalLengths: ['85mm', '50mm'],
        portraitStyle: 'Editorial High Fashion',
        compositionStyle: 'Golden Ratio Depth'
      },
      environment: {
        favoriteEnvironments: ['Abyssal Void', 'Cosmic Architecture', 'Minimalist Studio'],
        urbanScore: 0.7,
        natureScore: 0.6,
        luxuryScore: 0.95,
        cyberScore: 0.65,
        editorialScore: 0.9,
        studioScore: 0.85,
        runwayScore: 0.8,
        architectureScore: 0.88
      },
      behaviour: {
        likes: 10,
        dislikes: 1,
        regenerations: 3,
        downloads: 5,
        shares: 2,
        favoritesCount: 4,
        totalTimeSpentSeconds: 1200,
        acceptanceRate: 0.90
      },
      history: [],
      evolution: [
        {
          dateKey: new Date(now).toISOString().split('T')[0],
          timestamp: now,
          primaryStyle: 'Modern Haute Couture',
          luxuryLevel: 0.9,
          minimalismLevel: 0.75,
          creativityLevel: 0.88,
          topColor: '#0a192f',
          topMaterial: 'Silk Satin'
        }
      ],
      statistics: {
        totalMemoriesLogged: 1,
        learningAccuracy: 0.92,
        preferenceStability: 0.88,
        recommendationAccuracy: 0.91,
        styleConfidence: 0.85,
        topColors: ['#0a192f', '#f8fafc', '#38bdf8'],
        topMaterials: ['Silk Satin', 'Basalt Crystal'],
        topEnvironments: ['Abyssal Void', 'Minimalist Studio'],
        topProviders: ['gemini', 'imagen']
      }
    };

    this.memories.set(userId, newMemory);
    this.notifyMemoryCreated(newMemory);
    return newMemory;
  }

  public recordInteraction(
    userId: string,
    session: GenerationSession,
    action: 'like' | 'dislike' | 'favorite' | 'download' | 'share' | 'regenerate'
  ): StyleMemory {
    const memory = this.getOrCreateMemory(userId);
    const exec = session.executionResult;
    const primaryEnt = exec.themeDNA.primaryEntity;

    if (action === 'like') memory.behaviour.likes++;
    else if (action === 'dislike') memory.behaviour.dislikes++;
    else if (action === 'favorite') memory.behaviour.favoritesCount++;
    else if (action === 'download') memory.behaviour.downloads++;
    else if (action === 'share') memory.behaviour.shares++;
    else if (action === 'regenerate') memory.behaviour.regenerations++;

    const totalActions = memory.behaviour.likes + memory.behaviour.dislikes;
    memory.behaviour.acceptanceRate = totalActions > 0
      ? Math.round((memory.behaviour.likes / totalActions) * 100) / 100
      : 0.9;

    const color = exec.palette.primary;
    memory.colors.colorFrequency[color] = (memory.colors.colorFrequency[color] || 0) + 1;

    if (action === 'like' || action === 'favorite' || action === 'download') {
      if (!memory.colors.favoriteColors.includes(color)) {
        memory.colors.favoriteColors.unshift(color);
      }
      const mat = exec.materials.primaryMaterial;
      if (!memory.materials.favoriteMaterials.includes(mat)) {
        memory.materials.favoriteMaterials.unshift(mat);
      }
      const light = exec.lighting.style;
      if (!memory.lighting.favoriteLighting.includes(light)) {
        memory.lighting.favoriteLighting.unshift(light);
      }
    } else if (action === 'dislike') {
      if (!memory.colors.avoidedColors.includes(color)) {
        memory.colors.avoidedColors.push(color);
      }
      const mat = exec.materials.primaryMaterial;
      if (!memory.materials.rejectedMaterials.includes(mat)) {
        memory.materials.rejectedMaterials.push(mat);
      }
    }

    const historyEntry: StyleGenerationHistoryEntry = {
      id: `hist_${Date.now()}_${memory.history.length}`,
      timestamp: Date.now(),
      prompt: session.theme,
      fusedConcept: exec.fusedConcept,
      provider: session.provider,
      seed: session.results[0]?.seed || 42,
      generationTimeMs: session.results[0]?.generationTimeMs || 2500,
      success: session.status === 'completed',
      cost: session.metadata.totalCost,
      qualityScore: action === 'favorite' ? 0.98 : action === 'like' ? 0.85 : 0.5,
      liked: action === 'like' || action === 'favorite',
      favorited: action === 'favorite'
    };

    memory.history.push(historyEntry);
    memory.statistics.totalMemoriesLogged = memory.history.length;
    memory.updatedAt = Date.now();

    this.recalculateMemoryStatistics(memory);
    this.notifyMemoryUpdated(memory);
    this.notifyLearningCompleted(memory);

    return memory;
  }

  public generateRecommendations(userId: string): StyleRecommendation {
    const memory = this.getOrCreateMemory(userId);

    const recommendation: StyleRecommendation = {
      recommendedColors: memory.colors.favoriteColors.slice(0, 4),
      recommendedMaterials: memory.materials.favoriteMaterials.slice(0, 3),
      recommendedLighting: memory.lighting.favoriteLighting.slice(0, 2),
      recommendedComposition: memory.camera.compositionStyle,
      recommendedEnvironment: memory.environment.favoriteEnvironments[0] || 'Minimalist Studio',
      recommendedProvider: memory.statistics.topProviders[0] || 'gemini',
      suggestedThemeConcepts: [
        `${memory.materials.favoriteMaterials[0] || 'Silk'} + ${memory.colors.favoriteColors[0] || '#0a192f'} Synthesis`,
        `${memory.styleDNA.primaryStyle} Architectural Elegance`,
        `Couture ${memory.environment.favoriteEnvironments[0] || 'Atelier'}`
      ]
    };

    this.notifyRecommendationGenerated(recommendation);
    return recommendation;
  }

  public calculateSimilarity(userId: string, targetResult: ThemeExecutionResult): number {
    const memory = this.getOrCreateMemory(userId);
    let similarityScore = 0;

    if (memory.colors.favoriteColors.includes(targetResult.palette.primary)) {
      similarityScore += 0.3;
    }

    if (memory.materials.favoriteMaterials.includes(targetResult.materials.primaryMaterial)) {
      similarityScore += 0.3;
    }

    if (memory.lighting.favoriteLighting.includes(targetResult.lighting.style)) {
      similarityScore += 0.2;
    }

    if (memory.environment.favoriteEnvironments.includes(targetResult.environment.background)) {
      similarityScore += 0.2;
    }

    return Math.min(1.0, similarityScore);
  }

  public searchMemory(userId: string, query: MemorySearchQuery): StyleGenerationHistoryEntry[] {
    const memory = this.getOrCreateMemory(userId);

    return memory.history.filter(item => {
      if (query.theme && !item.prompt.toLowerCase().includes(query.theme.toLowerCase())) {
        return false;
      }
      if (query.provider && item.provider !== query.provider) {
        return false;
      }
      if (query.startDate && item.timestamp < query.startDate) {
        return false;
      }
      if (query.endDate && item.timestamp > query.endDate) {
        return false;
      }
      return true;
    });
  }

  public compressMemory(userId: string): void {
    const memory = this.getOrCreateMemory(userId);
    if (memory.history.length > 100) {
      memory.history = memory.history.slice(-50);
    }
    memory.colors.favoriteColors = Array.from(new Set(memory.colors.favoriteColors)).slice(0, 10);
    memory.materials.favoriteMaterials = Array.from(new Set(memory.materials.favoriteMaterials)).slice(0, 10);
    memory.updatedAt = Date.now();
    this.notifyMemoryUpdated(memory);
  }

  public exportMemory(userId: string): string {
    const memory = this.getOrCreateMemory(userId);
    return JSON.stringify(memory, null, 2);
  }

  public importMemory(userId: string, jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString) as StyleMemory;
      if (!parsed || !parsed.styleDNA) return false;

      this.memories.set(userId, parsed);
      this.notifyMemoryUpdated(parsed);
      return true;
    } catch (_) {
      return false;
    }
  }

  private recalculateMemoryStatistics(memory: StyleMemory): void {
    const colorCounts = new Map<string, number>();
    for (const entry of memory.history) {
      const col = entry.fusedConcept;
      colorCounts.set(col, (colorCounts.get(col) || 0) + 1);
    }

    memory.statistics.topColors = memory.colors.favoriteColors.slice(0, 5);
    memory.statistics.topMaterials = memory.materials.favoriteMaterials.slice(0, 5);
    memory.statistics.topEnvironments = memory.environment.favoriteEnvironments.slice(0, 5);
    memory.statistics.styleConfidence = Math.min(0.99, 0.7 + memory.history.length * 0.01);
  }

  private notifyMemoryCreated(memory: StyleMemory): void {
    for (const listener of this.listeners) {
      try {
        listener.onMemoryCreated?.(memory);
      } catch (_) {}
    }
  }

  private notifyMemoryUpdated(memory: StyleMemory): void {
    for (const listener of this.listeners) {
      try {
        listener.onMemoryUpdated?.(memory);
      } catch (_) {}
    }
  }

  private notifyLearningCompleted(memory: StyleMemory): void {
    for (const listener of this.listeners) {
      try {
        listener.onLearningCompleted?.(memory);
      } catch (_) {}
    }
  }

  private notifyRecommendationGenerated(recommendation: StyleRecommendation): void {
    for (const listener of this.listeners) {
      try {
        listener.onRecommendationGenerated?.(recommendation);
      } catch (_) {}
    }
  }
}

export const globalStyleMemory = new StyleMemoryEngine();
