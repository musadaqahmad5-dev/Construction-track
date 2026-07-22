import { ImageGenerationRegistry } from '../features/image-generation/imageGenerationProvider';
import { FashionPromptBuilder } from '../features/image-generation/promptBuilder';
import { ImageStorage } from '../features/image-generation/imageStorage';
import { RuleEngine, GlobalAdvancedCache, AIRequestPipeline, CacheType } from '../features/efficiency/aiRequestPipeline';
import { WardrobeItem, ClothingCategory } from '../types';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, limit } from 'firebase/firestore';
import { DuplicateLookDetectionEngine } from './visionIntelligence';

// ============================================================================
// 1. CACHING ENGINE
// ============================================================================
export class CachingEngine {
  static get<T>(key: string): T | null {
    return GlobalAdvancedCache.get<T>(key);
  }

  static set<T>(key: string, value: T, type: CacheType, ttlMs?: number): void {
    GlobalAdvancedCache.set(key, value, type, ttlMs);
  }

  static invalidate(type: CacheType): void {
    GlobalAdvancedCache.invalidateByType(type);
  }

  static clear(): void {
    GlobalAdvancedCache.clear();
  }

  static getStatus() {
    return GlobalAdvancedCache.getStatus();
  }
}

// ============================================================================
// 2. PROMPT OPTIMIZATION ENGINE
// ============================================================================
export class PromptOptimizationEngine {
  static fingerprintPrompt(prompt: string): string {
    let hash = 0;
    const clean = prompt.trim().toLowerCase();
    for (let i = 0; i < clean.length; i++) {
      hash = (hash << 5) - hash + clean.charCodeAt(i);
      hash |= 0;
    }
    return `fp_${Math.abs(hash).toString(16)}`;
  }

  static optimizeRawPrompt(raw: string, options: { vibe?: string; gender?: string; season?: string } = {}): string {
    const cleanRaw = raw.trim();
    if (!cleanRaw) return "A clean, high-fashion aesthetic piece.";
    
    // Inject standard luxury, editorial composition details if missing
    const vibe = options.vibe || "Avant-Garde";
    const gender = options.gender || "unisex";
    const season = options.season || "All-Season";

    return `Professional fashion editorial shot of a ${gender} model styled in a ${vibe} theme. ${cleanRaw}. Meticulously styled for the ${season} season. High-end lighting, full cinematic composition with elegant negative space, detailed fabrics, sharp 35mm lens focus, 8K resolution.`;
  }
}

// ============================================================================
// 3. PROMPT ENGINE
// ============================================================================
export class PromptEngine {
  static buildOutfitPrompt(options: any): string {
    return FashionPromptBuilder.buildOutfitPrompt(options);
  }

  static buildSingleGarmentPrompt(title: string, category: string, color: string, material?: string): string {
    return FashionPromptBuilder.buildSingleGarmentPrompt(title, category, color, material);
  }

  static buildOptimizedOutfitPrompt(options: any): { prompt: string; fingerprint: string } {
    const basePrompt = FashionPromptBuilder.buildOutfitPrompt(options);
    const fp = PromptOptimizationEngine.fingerprintPrompt(basePrompt);
    return { prompt: basePrompt, fingerprint: fp };
  }
}

// ============================================================================
// 4. FASHION ENGINE
// ============================================================================
export class FashionEngine {
  private static readonly NON_FASHION_KEYWORDS = [
    "car", "cars", "dog", "dogs", "cat", "cats", "spaceship", "computer", "house", 
    "building", "food", "pizza", "apple", "banana", "tree", "plant", "math", "code"
  ];

  static checkSartoGuardrail(text: string): { allowed: boolean; reason?: string } {
    const testText = text.toLowerCase()
      .replace(/\b(zero|no|not|without|exclude|avoid|never|non)\b[^,.!;\n]*/gi, '')
      .replace(/\b(fashion house|couture house|house of|plant-based|apple skin|apple leather|tree fiber|dogtooth|houndstooth)\b/gi, '');

    const blockedWord = this.NON_FASHION_KEYWORDS.find(word => {
      const regex = new RegExp(`\\b${word}s?\\b`, 'i');
      return regex.test(testText);
    });

    if (blockedWord) {
      return {
        allowed: false,
        reason: "This AI is trained and calibrated strictly for luxury fashion curation, wardrobe coordination, and sartorial style lookbooks. Please specify a fashion-oriented request."
      };
    }
    return { allowed: true };
  }

  static getStyleVibePresets() {
    return ["Classic Noir", "Cyber Avant-Garde", "Nordic Minimalist", "Desert Wanderer", "Neo-Gothic"];
  }

  static getFormalityLevels() {
    return ["Casual", "Semi-formal", "Formal", "High-End Editorial"];
  }
}

// ============================================================================
// 5. EMBEDDING SIMILARITY & SEARCH ENGINE
// ============================================================================
export class EmbeddingSearchEngine {
  private static calculateCharOverlap(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (s1 === s2) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.0;

    const set1 = new Set(s1.split(''));
    const set2 = new Set(s2.split(''));
    let overlap = 0;
    for (const char of set1) {
      if (set2.has(char)) overlap++;
    }
    return overlap / Math.max(set1.size, set2.size);
  }

  static computeSimilarity(text1: string, text2: string): number {
    return this.calculateCharOverlap(text1, text2);
  }

  static searchWardrobe(query: string, items: WardrobeItem[], threshold: number = 0.45): WardrobeItem[] {
    const scored = items.map(item => {
      const scoreTitle = this.computeSimilarity(query, item.title || '');
      const scoreDesc = this.computeSimilarity(query, item.description || '');
      const maxScore = Math.max(scoreTitle, scoreDesc);
      return { item, score: maxScore };
    });

    return scored
      .filter(s => s.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .map(s => s.item);
  }
}

// ============================================================================
// 6. STYLE DNA ENGINE
// ============================================================================
export interface UserStyleDNA {
  userId: string;
  primaryVibe: string;
  favColors: string[];
  formalityPreference: number; // 0 (casual) to 1 (formal)
  experimentalIndex: number;  // 0 (safe) to 1 (high-fashion)
  updatedAt: string;
}

export class StyleDNAEngine {
  private static dnaStore = new Map<string, UserStyleDNA>();

  static computeDNA(userId: string, wardrobe: WardrobeItem[], history: any[] = []): UserStyleDNA {
    const cached = this.dnaStore.get(userId);
    if (cached && Date.now() - new Date(cached.updatedAt).getTime() < 10 * 60 * 1000) {
      return cached;
    }

    // Determine primary vibes based on wardrobe categories and colors
    const colors = wardrobe.map(w => w.primaryColor).filter(Boolean) as string[];
    const categoryCounts: Record<string, number> = {};
    wardrobe.forEach(w => {
      categoryCounts[w.category] = (categoryCounts[w.category] || 0) + 1;
    });

    const isFormal = (categoryCounts['Formal'] || 0) > (categoryCounts['Casual'] || 0);
    const experimentalCount = wardrobe.filter(w => w.description?.toLowerCase().includes('avant-garde') || w.description?.toLowerCase().includes('cyber')).length;

    const computed: UserStyleDNA = {
      userId,
      primaryVibe: experimentalCount > 0 ? "Cyber Avant-Garde" : (isFormal ? "Nordic Minimalist" : "Classic Noir"),
      favColors: colors.slice(0, 3),
      formalityPreference: isFormal ? 0.8 : 0.3,
      experimentalIndex: experimentalCount / Math.max(1, wardrobe.length),
      updatedAt: new Date().toISOString()
    };

    this.dnaStore.set(userId, computed);
    return computed;
  }

  static getDNA(userId: string): UserStyleDNA | null {
    return this.dnaStore.get(userId) || null;
  }
}

// ============================================================================
// 7. WARDROBE MEMORY ENGINE
// ============================================================================
export class WardrobeMemoryEngine {
  private static listCache = new Map<string, { items: WardrobeItem[]; ts: number }>();

  static cacheWardrobe(userId: string, items: WardrobeItem[]): void {
    this.listCache.set(userId, { items, ts: Date.now() });
  }

  static getCachedWardrobe(userId: string): WardrobeItem[] | null {
    const entry = this.listCache.get(userId);
    if (entry && Date.now() - entry.ts < 5 * 60 * 1000) {
      return entry.items;
    }
    return null;
  }

  static invalidateWardrobe(userId: string): void {
    this.listCache.delete(userId);
  }
}

// ============================================================================
// 8. RECOMMENDATION ENGINE
// ============================================================================
export class RecommendationEngine {
  static async recommendOutfit(
    userId: string,
    wardrobe: WardrobeItem[],
    options: { condition: string; tempRange: string; vibe: string; agenda: string },
    externalCall: () => Promise<any>
  ): Promise<any> {
    const { condition, tempRange, vibe, agenda } = options;
    const cacheKey = `recommend:${userId}:${condition}:${tempRange}:${vibe}:${agenda}:${wardrobe.length}`;

    // 1. Try Cache Lookup (Level 3)
    const cached = CachingEngine.get<any>(cacheKey);
    if (cached) {
      console.log(`[RecommendationEngine] Cache Hit for recommendation key: ${cacheKey}`);
      return cached;
    }

    // 2. Try Personal Fashion Memory local-first check (Level 1)
    try {
      const { PersonalFashionMemoryEngine } = await import('./personalMemory');
      const pmRes = PersonalFashionMemoryEngine.localRecommendation(userId, wardrobe, options);
      if (pmRes && pmRes.resolved) {
        console.log(`[RecommendationEngine] Resolved style locally via Personal Fashion Memory!`);
        const result = {
          todaySuggestion: pmRes.suggestion,
          tomorrowSuggestion: [],
          confidence: 0.99,
          reasoning: pmRes.reasoning,
          isLocal: true
        };
        CachingEngine.set(cacheKey, result, 'STYLE_RECOMMENDATIONS', 15 * 60 * 1000);
        return result;
      }
    } catch (e) {
      console.warn('[RecommendationEngine] Personal Fashion Memory check bypassed or not loaded:', e);
    }

    // 3. Try Rule Engine Resolution (Level 7)
    const localRule = RuleEngine.resolveStyleLocally(condition, tempRange, vibe, agenda, wardrobe);
    if (localRule && localRule.resolved) {
      console.log(`[RecommendationEngine] Rule Engine resolved style locally!`);
      const result = {
        todaySuggestion: localRule.suggestion,
        tomorrowSuggestion: [],
        confidence: 0.98,
        reasoning: localRule.reasoning,
        isLocal: true
      };
      CachingEngine.set(cacheKey, result, 'STYLE_RECOMMENDATIONS', 10 * 60 * 1000);
      return result;
    }

    // 4. Fallback to external AI (if absolutely necessary)
    console.log(`[RecommendationEngine] Local rule bypass. Calling External AI Gateway...`);
    const externalResult = await externalCall();
    CachingEngine.set(cacheKey, externalResult, 'STYLE_RECOMMENDATIONS', 5 * 60 * 1000);
    return externalResult;
  }
}

// ============================================================================
// 9. HISTORY ENGINE
// ============================================================================
export class HistoryEngine {
  static async logGeneration(imageUrl: string, metadata: any): Promise<any> {
    return await ImageStorage.persistLook(imageUrl, metadata);
  }
}

// ============================================================================
// 10. RENDERING ENGINE
// ============================================================================
export interface RenderConfig {
  avatarType: string;
  garmentMesh: string;
  renderEngine: string;
  drapePhysics: string;
  customDetails?: string;
}

export class RenderingEngine {
  static simulateRenderPipeline(config: RenderConfig): { logs: string[]; finalTitle: string; estimatedMeshVertices: number } {
    const logs: string[] = [
      `[0.1s] Initializing 3D engine and loading mesh: ${config.garmentMesh}...`,
      `[0.6s] Resolving avatar geometry alignment to: ${config.avatarType}...`,
      `[1.2s] Setting up fabric solve boundary conditions...`,
      `[1.8s] Running non-linear cloth tension equations. Physics mode: ${config.drapePhysics}...`,
      `[2.4s] Compiling vertex buffers and mapping texture coordinates...`,
      `[3.0s] Solving spatial friction and self-collision grids...`,
      `[3.6s] Dispatching path-trace rays to ${config.renderEngine} shader sub-system...`,
      `[4.2s] Finalizing color grading & HDR post-process. snapshot exported.`
    ];

    return {
      logs,
      finalTitle: `${config.garmentMesh.replace('_', ' ')} concept`,
      estimatedMeshVertices: 45200
    };
  }
}

// ============================================================================
// 11. VISION ENGINE
// ============================================================================
export interface VisionClassificationResult {
  category: string;
  primaryColor: string;
  materials: string[];
  vibeConfidence: number;
}

export class VisionEngine {
  static analyzeGarmentImage(imageUrl: string): VisionClassificationResult {
    // Returns deterministic vision labels for visual analysis
    let category = "Casual";
    let color = "Charcoal";
    if (imageUrl.includes('blazer') || imageUrl.includes('jacket')) {
      category = "Outerwear";
    }
    return {
      category,
      primaryColor: color,
      materials: ["Linen", "Wool Blend"],
      vibeConfidence: 0.94
    };
  }
}

// ============================================================================
// 12. POSE ENGINE
// ============================================================================
export interface PoseCoordinates {
  joints: Array<{ id: string; x: number; y: number; confidence: number }>;
  bodyOrientation: 'front' | 'three-quarter' | 'profile';
}

export class PoseEngine {
  static generatePoseLandmarks(posePreset: string): PoseCoordinates {
    const presets: Record<string, 'front' | 'three-quarter' | 'profile'> = {
      'RUNWAY': 'front',
      'EDITORIAL_SIDE': 'three-quarter',
      'DYNAMIC_WALK': 'three-quarter',
      'MINIMAL_STILL': 'front'
    };

    return {
      joints: [
        { id: 'head', x: 0.5, y: 0.12, confidence: 0.99 },
        { id: 'neck', x: 0.5, y: 0.22, confidence: 0.98 },
        { id: 'left_shoulder', x: 0.42, y: 0.28, confidence: 0.97 },
        { id: 'right_shoulder', x: 0.58, y: 0.28, confidence: 0.97 },
        { id: 'spine', x: 0.5, y: 0.45, confidence: 0.95 },
        { id: 'left_hip', x: 0.44, y: 0.6, confidence: 0.94 },
        { id: 'right_hip', x: 0.56, y: 0.6, confidence: 0.94 }
      ],
      bodyOrientation: presets[posePreset] || 'front'
    };
  }
}

// ============================================================================
// 13. BODY ENGINE
// ============================================================================
export interface BodyMeasurements {
  shoulderWidthCm: number;
  waistCm: number;
  heightCm: number;
  shapeType: 'Athletic' | 'Hourglass' | 'Rectangular' | 'Slender';
}

export class BodyEngine {
  static parseBodyDimensions(avatarType: string): BodyMeasurements {
    if (avatarType.includes('ATHLETIC_M')) {
      return { shoulderWidthCm: 48, waistCm: 82, heightCm: 185, shapeType: 'Athletic' };
    }
    if (avatarType.includes('RUNWAY_F')) {
      return { shoulderWidthCm: 39, waistCm: 61, heightCm: 178, shapeType: 'Hourglass' };
    }
    return { shoulderWidthCm: 42, waistCm: 75, heightCm: 175, shapeType: 'Slender' };
  }
}

// ============================================================================
// 14. FACE ENGINE
// ============================================================================
export interface FaceAvatar {
  gender: string;
  hairstyle: string;
  skinTone: string;
  facialStructure: string;
  syntheticHash: string;
}

export class FaceEngine {
  static createSyntheticFace(seed: string, gender: string = 'female'): FaceAvatar {
    // Generate a secure synthetic avatar specification
    const hairs = gender === 'female' ? 'Sleek Back High Bun' : 'Textured French Crop';
    const tones = 'Luminous Olive';
    return {
      gender,
      hairstyle: hairs,
      skinTone: tones,
      facialStructure: "Symmetric Angular Editorial",
      syntheticHash: `face_${PromptOptimizationEngine.fingerprintPrompt(seed + gender)}`
    };
  }

  static isRealFaceUpload(fileUrl: string): boolean {
    // Checks if the file comes from the user's camera / file system vs synthetic Unsplash seed
    return fileUrl.startsWith('data:') || fileUrl.includes('localhost') || fileUrl.includes('user_upload') || fileUrl.includes('firebase');
  }
}

// ============================================================================
// 15. MARKETPLACE MATCHING ENGINE
// ============================================================================
export interface ProductRecommendationMatch {
  product: any;
  similarityScore: number;
  matchType: 'Exact category match' | 'Complementary piece' | 'Coordinated accessory';
}

export class MarketplaceMatchingEngine {
  static async matchAILookToProducts(
    lookTitle: string,
    lookPrompt: string,
    itemsPool: any[]
  ): Promise<ProductRecommendationMatch[]> {
    if (itemsPool.length === 0) return [];

    const matches: ProductRecommendationMatch[] = itemsPool.map(product => {
      // Direct text semantic matching using character overlap
      const titleOverlap = EmbeddingSearchEngine.computeSimilarity(lookTitle, product.title || '');
      const descOverlap = EmbeddingSearchEngine.computeSimilarity(lookPrompt, product.description || '');
      const totalScore = Math.max(titleOverlap, descOverlap);

      let matchType: 'Exact category match' | 'Complementary piece' | 'Coordinated accessory' = 'Complementary piece';
      if (product.category === 'Outerwear' && lookPrompt.toLowerCase().includes('jacket')) {
        matchType = 'Exact category match';
      }

      return { product, similarityScore: totalScore, matchType };
    });

    // Sort by descending overlap score
    return matches
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 3);
  }
}

// ============================================================================
// 16. AI GENERATION ENGINE
// ============================================================================
export interface GenerationJob {
  prompt: string;
  fingerprint: string;
  config: any;
  provider: string;
  timestamp: number;
}

export class AIGenerationEngine {
  private static generationQueue: GenerationJob[] = [];
  private static recentRuns = new Map<string, { url: string; timestamp: number }>();

  static queueGeneration(prompt: string, config: any, provider: string): GenerationJob {
    const fingerprint = PromptOptimizationEngine.fingerprintPrompt(prompt);
    const job: GenerationJob = { prompt, fingerprint, config, provider, timestamp: Date.now() };
    this.generationQueue.push(job);
    return job;
  }

  static getQueueSize(): number {
    return this.generationQueue.length;
  }

  static async generateOptimized(
    prompt: string,
    config: any,
    provider?: string
  ): Promise<{ imageUrl: string; provider: string; cacheHit: boolean; costSavedUsd: number }> {
    // Generate a unique fingerprint for each request to allow refreshing and unique images, salting it with seed/nonce
    const runSeed = config?.seed || String(Math.floor(Math.random() * 1000000000));
    const fp = PromptOptimizationEngine.fingerprintPrompt(prompt + "_seed_" + runSeed);
    
    // Check local recent executions to block immediate regenerations
    const previous = this.recentRuns.get(fp);
    if (previous && Date.now() - previous.timestamp < 30 * 60 * 1000) {
      console.log(`[AIGenerationEngine] Prevented duplicate external generation via active prompt fingerprinted cache match.`);
      return {
        imageUrl: previous.url,
        provider: provider || 'Gemini-3.1-Flash-Image',
        cacheHit: true,
        costSavedUsd: 0.015
      };
    }

    // PART 4: Enterprise Duplicate Look Detection and Visual Reusability (run only if explicit deduplicate flag is passed)
    if (config?.deduplicate) {
      try {
        const duplicateMatch = DuplicateLookDetectionEngine.detectDuplicate(prompt, config?.vibe || '');
        if (duplicateMatch && duplicateMatch.isDuplicate) {
          console.log(`[AIGenerationEngine] Visual intelligence found identical look in ${duplicateMatch.source}. Reusing look: "${duplicateMatch.matchedLookTitle}" to prevent redundant external AI requests.`);
          
          // Track the saved API call to show in metrics
          try {
            const uId = 'user-1';
            const { PersonalFashionMemoryEngine } = await import('./personalMemory');
            const memory = PersonalFashionMemoryEngine.getMemory(uId);
            memory.apiCallsSaved += 1;
          } catch {}

          return {
            imageUrl: duplicateMatch.matchedLookImageUrl,
            provider: 'VisionIntelligence-Deduplication',
            cacheHit: true,
            costSavedUsd: 0.015
          };
        }
      } catch (e) {
        console.warn('[AIGenerationEngine] Duplicate look detection check bypassed:', e);
      }
    }

    // Call request pipeline
    const pipelineKey = `img:${fp}`;
    
    const { result } = await AIRequestPipeline.executeTextPipeline<{ imageUrl: string; provider: string }>(
      pipelineKey,
      {
        cacheType: 'IMAGE_PROMPTS',
        promptText: prompt,
        ttlMs: 24 * 60 * 60 * 1000, // Immersive image generations live in cache for 24 hours
        apiCostEstimate: 0.015
      },
      async () => {
        const genResult = await ImageGenerationRegistry.generate(prompt, config, provider);
        if (!genResult.success || !genResult.imageUrl) {
          throw new Error(genResult.error || "Failed to generate image.");
        }
        return { imageUrl: genResult.imageUrl, provider: genResult.provider };
      }
    );

    this.recentRuns.set(fp, { url: result.imageUrl, timestamp: Date.now() });

    return {
      imageUrl: result.imageUrl,
      provider: result.provider,
      cacheHit: false,
      costSavedUsd: 0
    };
  }
}
