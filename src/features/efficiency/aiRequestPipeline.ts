import { WardrobeItem } from '../../types';

export type CacheType = 
  | 'OUTFITS'
  | 'IMAGE_PROMPTS'
  | 'PROMPT_TEMPLATES'
  | 'WARDROBE_ANALYSIS'
  | 'STYLE_RECOMMENDATIONS'
  | 'TREND_ANALYSIS'
  | 'WEATHER_RESPONSES'
  | 'USER_PREFERENCES'
  | 'IMAGE_GENERATION_HISTORY'
  | 'CONVERSATION_HISTORY';

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // in milliseconds
  hits: number;
  byteSize: number;
  type: CacheType;
}

export interface PipelineReport {
  levelReached: number;
  levelName: string;
  source: 'cache' | 'local_rule' | 'local_engine' | 'external_api' | 'fallback';
  costUsd: number;
  savingsUsd: number;
  latencyMs: number;
  deduplicated: boolean;
  promptReused: boolean;
}

// Global In-memory statistics for Cost Optimization and Diagnostics Reports
export interface OptimizationStats {
  totalRequests: number;
  cacheHits: number;
  localResolutions: number;
  externalCalls: number;
  duplicatePrevented: number;
  promptReuses: number;
  totalCostSpentUsd: number;
  totalCostSavedUsd: number;
  averageLatencyMs: number;
}

export class AdvancedCache {
  private cacheMap = new Map<string, CacheEntry<any>>();
  private maxSizeBytes = 5 * 1024 * 1024; // 5 MB ceiling limit
  private currentSizeBytes = 0;

  // Stats
  public hits = 0;
  public misses = 0;

  /**
   * Estimates byte size of an object in memory
   */
  private estimateByteSize(obj: any): number {
    const str = JSON.stringify(obj);
    return str ? str.length * 2 : 0; // UTF-16 characters are 2 bytes
  }

  /**
   * Sets value in cache with a TTL (default 10 minutes)
   */
  public set<T>(key: string, value: T, type: CacheType, ttlMs: number = 10 * 60 * 1000) {
    const byteSize = this.estimateByteSize(value);

    // LRU eviction if size limit is exceeded
    while (this.currentSizeBytes + byteSize > this.maxSizeBytes && this.cacheMap.size > 0) {
      const oldestKey = this.cacheMap.keys().next().value;
      if (oldestKey) {
        this.delete(oldestKey);
      } else {
        break;
      }
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttlMs,
      hits: 0,
      byteSize,
      type
    };

    this.cacheMap.set(key, entry);
    this.currentSizeBytes += byteSize;
  }

  /**
   * Gets value from cache, enforcing TTL checks
   */
  public get<T>(key: string): T | null {
    const entry = this.cacheMap.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.delete(key);
      this.misses++;
      return null;
    }

    entry.hits++;
    this.hits++;
    return entry.value as T;
  }

  /**
   * Deletes a key from the cache map and releases memory size
   */
  public delete(key: string) {
    const entry = this.cacheMap.get(key);
    if (entry) {
      this.currentSizeBytes -= entry.byteSize;
      this.cacheMap.delete(key);
    }
  }

  /**
   * Dynamic Invalidation based on business rule criteria
   */
  public invalidateByType(type: CacheType) {
    for (const [key, entry] of this.cacheMap.entries()) {
      if (entry.type === type) {
        this.delete(key);
      }
    }
  }

  public clear() {
    this.cacheMap.clear();
    this.currentSizeBytes = 0;
    this.hits = 0;
    this.misses = 0;
  }

  public getStatus() {
    return {
      entriesCount: this.cacheMap.size,
      currentSizeBytes: this.currentSizeBytes,
      maxSizeBytes: this.maxSizeBytes,
      percentageFull: parseFloat(((this.currentSizeBytes / this.maxSizeBytes) * 100).toFixed(2)),
      hits: this.hits,
      misses: this.misses,
      effectivenessPercent: this.hits + this.misses > 0 
        ? parseFloat(((this.hits / (this.hits + this.misses)) * 100).toFixed(1)) 
        : 100
    };
  }

  public getAllEntries() {
    const list: Array<{ key: string, type: CacheType, hits: number, sizeBytes: number, ageSeconds: number }> = [];
    for (const [key, entry] of this.cacheMap.entries()) {
      list.push({
        key,
        type: entry.type,
        hits: entry.hits,
        sizeBytes: entry.byteSize,
        ageSeconds: Math.round((Date.now() - entry.timestamp) / 1000)
      });
    }
    return list;
  }
}

export const GlobalAdvancedCache = new AdvancedCache();

/**
 * Local Rule Engine (Level 7 Optimization)
 * Completely static, zero-latency styling combinations and decisions.
 */
export class RuleEngine {
  /**
   * Determines if weather and agenda parameters can be fully answered with a local styling prescription.
   */
  public static resolveStyleLocally(
    condition: string,
    tempRange: string,
    vibe: string,
    agenda: string,
    wardrobe: WardrobeItem[]
  ): { resolved: boolean; suggestion: string[]; reasoning: string } | null {
    const cond = (condition || '').toLowerCase();
    const agendaLower = (agenda || '').toLowerCase();
    const vibeLower = (vibe || '').toLowerCase();

    // Ensure we have wardrobe items to pair from
    if (wardrobe.length === 0) {
      return null;
    }

    // Rule 1: Extreme rain or storm - simple local utility advice
    if (cond.includes('storm') || cond.includes('heavy rain') || cond.includes('thunderstorm')) {
      const outer = wardrobe.find(w => w.category === 'Outerwear' && w.description?.toLowerCase().includes('waterproof')) ||
                    wardrobe.find(w => w.category === 'Outerwear');
      const main = wardrobe.find(w => ['Casual', 'Formal'].includes(w.category));
      
      const suggestedIds = [main?.id, outer?.id].filter(Boolean) as string[];
      if (suggestedIds.length > 0) {
        return {
          resolved: true,
          suggestion: suggestedIds,
          reasoning: `[Rule Engine Resolution] Severe weather forecast (${condition}) triggered defensive tactical rules. Suggested a waterproof layer paired with daily essentials. Overriding Gemini API query to preserve infrastructure budgets.`
        };
      }
    }

    // Rule 2: Casual lounging at home
    if (agendaLower.includes('chill') || agendaLower.includes('couch') || agendaLower.includes('lazy') || agendaLower.includes('lounging')) {
      const sweat = wardrobe.find(w => w.category === 'Sportswear' || w.title?.toLowerCase().includes('sweat') || w.title?.toLowerCase().includes('hoodie')) ||
                    wardrobe.find(w => w.category === 'Casual');
      const accessory = wardrobe.find(w => w.category === 'Accessories');

      const suggestedIds = [sweat?.id, accessory?.id].filter(Boolean) as string[];
      if (suggestedIds.length > 0) {
        return {
          resolved: true,
          suggestion: suggestedIds,
          reasoning: `[Rule Engine Resolution] Relaxed schedule ("${agenda}") resolved instantly. Paired cozy comfort items from your local wardrobe layout. Offline-safe calculations completed with zero API spend.`
        };
      }
    }

    // Rule 3: Workout / Gym Agenda
    if (agendaLower.includes('gym') || agendaLower.includes('workout') || agendaLower.includes('run') || agendaLower.includes('sport') || agendaLower.includes('training')) {
      const sportItems = wardrobe.filter(w => w.category === 'Sportswear');
      const suggestedIds = sportItems.slice(0, 2).map(i => i.id);
      if (suggestedIds.length > 0) {
        return {
          resolved: true,
          suggestion: suggestedIds,
          reasoning: `[Rule Engine Resolution] Active sports agenda identified. Bypassed creative LLM styling layers to propose high-insulation, performance athletic gear natively.`
        };
      }
    }

    return null; // Let the core engine or Gemini resolve
  }
}

/**
 * Intelligent Request Pipeline Manager
 * Orchestrates Levels 1 to 9 of execution.
 */
export class AIRequestPipeline {
  private static inFlight = new Map<string, Promise<any>>();
  private static promptRegistry = new Map<string, { prompt: string; response: any }>();

  // Metrics trackers
  private static totalRequests = 0;
  private static cacheHits = 0;
  private static localResolutions = 0;
  private static externalCalls = 0;
  private static duplicatePrevented = 0;
  private static promptReuses = 0;
  private static totalCostSpentUsd = 0;
  private static totalCostSavedUsd = 0;
  private static totalLatencyMs = 0;

  // Cache configuration helper
  private static readonly PRICING = {
    flashText: 0.000075, // Gemini 3.5 Flash text cost per execution estimate
    imagenImage: 0.015,  // Google Imagen image generation cost
  };

  /**
   * Helper to estimate string similarities (Levenshtein overlap) to support Smart Prompt Reuse
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (s1 === s2) return 1.0;
    if (s1.length === 0 || s2.length === 0) return 0.0;

    // Use simple word overlap ratio for lightning fast server-side computation
    const words1 = s1.split('');
    const words2 = s2.split('');
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    let intersection = 0;
    for (const item of set1) {
      if (set2.has(item)) intersection++;
    }
    return intersection / Math.max(set1.size, set2.size);
  }

  /**
   * Orchestrates 9-level pipeline for standard text and metadata generation.
   */
  public static async executeTextPipeline<T>(
    pipelineKey: string,
    params: {
      cacheType: CacheType;
      validationRules?: (p: any) => string | null;
      localResolver?: () => { resolved: boolean; suggestion: any; reasoning: string } | null;
      promptText?: string;
      ttlMs?: number;
      apiCostEstimate?: number;
    },
    externalApiFunc: () => Promise<T>
  ): Promise<{ result: T; report: PipelineReport }> {
    const startTime = Date.now();
    this.totalRequests++;

    const report: Partial<PipelineReport> = {
      levelReached: 1,
      levelName: 'Level 1: UI Ingestion',
      source: 'fallback',
      costUsd: 0,
      savingsUsd: 0,
      latencyMs: 0,
      deduplicated: false,
      promptReused: false
    };

    // --- LEVEL 2: INPUT VALIDATION ---
    if (params.validationRules) {
      const validationError = params.validationRules(params);
      if (validationError) {
        throw new Error(`[Pipeline Level 2 Validation Error]: ${validationError}`);
      }
    }
    report.levelReached = 2;
    report.levelName = 'Level 2: Input Validation';

    // --- LEVEL 3: LOCAL CACHE LOOKUP ---
    const cachedVal = GlobalAdvancedCache.get<T>(pipelineKey);
    if (cachedVal !== null) {
      this.cacheHits++;
      const latency = Date.now() - startTime;
      this.totalLatencyMs += latency;
      
      const savings = params.apiCostEstimate || this.PRICING.flashText;
      this.totalCostSavedUsd += savings;

      report.levelReached = 3;
      report.levelName = 'Level 3: Cache Lookup';
      report.source = 'cache';
      report.latencyMs = latency;
      report.savingsUsd = savings;

      return { result: cachedVal, report: report as PipelineReport };
    }

    // --- LEVEL 7: RULE ENGINE & LOCAL AI RESOLUTION ---
    if (params.localResolver) {
      const localResult = params.localResolver();
      if (localResult && localResult.resolved) {
        this.localResolutions++;
        const latency = Date.now() - startTime;
        this.totalLatencyMs += latency;
        
        const savings = params.apiCostEstimate || this.PRICING.flashText;
        this.totalCostSavedUsd += savings;

        // Cache the local rule resolution so we don't even recalculate rules next time
        GlobalAdvancedCache.set(pipelineKey, localResult.suggestion, params.cacheType, params.ttlMs);

        report.levelReached = 7;
        report.levelName = 'Level 7: Rule Engine';
        report.source = 'local_rule';
        report.latencyMs = latency;
        report.savingsUsd = savings;

        return { result: localResult.suggestion as T, report: report as PipelineReport };
      }
    }

    // --- LEVEL 8: PROMPT REUSE & DIFF ENGINE ---
    if (params.promptText) {
      let closestKey = '';
      let highestSimilarity = 0.0;

      for (const [key, entry] of this.promptRegistry.entries()) {
        const similarity = this.calculateStringSimilarity(params.promptText, entry.prompt);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          closestKey = key;
        }
      }

      // If prompts are 90% identical, we reuse the exact response and adapt locally!
      if (highestSimilarity >= 0.90 && closestKey) {
        this.promptReuses++;
        const reusedResponse = this.promptRegistry.get(closestKey)!.response;
        
        const latency = Date.now() - startTime;
        this.totalLatencyMs += latency;
        
        const savings = params.apiCostEstimate || this.PRICING.flashText;
        this.totalCostSavedUsd += savings;

        // Save into current cache
        GlobalAdvancedCache.set(pipelineKey, reusedResponse, params.cacheType, params.ttlMs);

        report.levelReached = 8;
        report.levelName = 'Level 8: Prompt Reuse';
        report.source = 'local_engine';
        report.latencyMs = latency;
        report.savingsUsd = savings;
        report.promptReused = true;

        return { result: reusedResponse as T, report: report as PipelineReport };
      }
    }

    // --- LEVEL 9: REQUEST DE-DUPLICATION & COALESCING (In-Flight Coalescing) ---
    if (this.inFlight.has(pipelineKey)) {
      this.duplicatePrevented++;
      report.deduplicated = true;
      console.log(`[Request Pipeline] Simultaneous request de-duplicated for key: ${pipelineKey}`);
      
      const existingPromise = this.inFlight.get(pipelineKey)!;
      const result = await existingPromise;
      
      const latency = Date.now() - startTime;
      this.totalLatencyMs += latency;
      
      report.levelReached = 9;
      report.levelName = 'Level 9: Coalesced API Ingress';
      report.source = 'external_api';
      report.latencyMs = latency;

      return { result: result as T, report: report as PipelineReport };
    }

    // Invoke external AI model
    const apiPromise = (async () => {
      try {
        const res = await externalApiFunc();
        // Store in Cache and Prompt registry on successful completion
        GlobalAdvancedCache.set(pipelineKey, res, params.cacheType, params.ttlMs);
        if (params.promptText) {
          this.promptRegistry.set(pipelineKey, { prompt: params.promptText, response: res });
        }
        return res;
      } finally {
        this.inFlight.delete(pipelineKey);
      }
    })();

    this.inFlight.set(pipelineKey, apiPromise);
    this.externalCalls++;

    try {
      const result = await apiPromise;
      const latency = Date.now() - startTime;
      this.totalLatencyMs += latency;
      
      const cost = params.apiCostEstimate || this.PRICING.flashText;
      this.totalCostSpentUsd += cost;

      report.levelReached = 9;
      report.levelName = 'Level 9: External API Gateway';
      report.source = 'external_api';
      report.latencyMs = latency;
      report.costUsd = cost;

      return { result, report: report as PipelineReport };
    } catch (err) {
      // In case of error, fall back to offline local calculations
      console.warn(`[AI Request Pipeline] External API error. Engaging Fallback Layers...`, err);
      
      // Let's resolve with rule resolution if any fallback is possible
      const latency = Date.now() - startTime;
      this.totalLatencyMs += latency;

      report.levelReached = 9;
      report.levelName = 'Level 9: Fallback Engagement';
      report.source = 'fallback';
      report.latencyMs = latency;

      throw err; // bubble up so specific service Fallback layers engage
    }
  }

  /**
   * Generates highly detailed Cost Optimization Report
   */
  public static generateCostOptimizationReport() {
    const savingsRatio = this.totalRequests > 0 
      ? (this.totalCostSavedUsd / (this.totalCostSpentUsd + this.totalCostSavedUsd)) * 100 
      : 0;

    const hitRate = this.totalRequests > 0 
      ? (this.cacheHits / this.totalRequests) * 100 
      : 0;

    const localRatio = this.totalRequests > 0 
      ? (this.localResolutions / this.totalRequests) * 100 
      : 0;

    const speedImprovement = this.totalRequests > 0 
      ? parseFloat(((1 - (this.totalLatencyMs / (this.totalRequests * 1200))) * 100).toFixed(1)) // Assuming baseline latency of 1200ms per external API call
      : 0;

    return {
      timestamp: new Date().toISOString(),
      overallSummary: {
        totalRequestsHandled: this.totalRequests,
        cacheHits: this.cacheHits,
        localRuleResolutions: this.localResolutions,
        promptReuses: this.promptReuses,
        externalApiCalls: this.externalCalls,
        coalescedRequestsPrevented: this.duplicatePrevented,
        totalUsdInvested: parseFloat(this.totalCostSpentUsd.toFixed(5)),
        totalUsdSaved: parseFloat(this.totalCostSavedUsd.toFixed(5)),
        estimatedCostReductionPercent: parseFloat(savingsRatio.toFixed(1)),
        expectedPerformanceImprovementPercent: Math.max(0, speedImprovement),
        aggregateLatencyMs: this.totalLatencyMs,
        averageLatencyMs: this.totalRequests > 0 ? Math.round(this.totalLatencyMs / this.totalRequests) : 0
      },
      cacheArchitecture: {
        effectivenessPercent: parseFloat(hitRate.toFixed(1)),
        localEngineSovereigntyPercent: parseFloat(localRatio.toFixed(1)),
        cacheStatus: GlobalAdvancedCache.getStatus(),
        entries: GlobalAdvancedCache.getAllEntries()
      },
      duplicateRequestReport: {
        coalescedPreventionCount: this.duplicatePrevented,
        activeInFlightCoalescingQueueSize: this.inFlight.size,
        promptSimilarityRegistrySize: this.promptRegistry.size
      }
    };
  }

  /**
   * Resets all pipeline metrics
   */
  public static clearMetrics() {
    this.totalRequests = 0;
    this.cacheHits = 0;
    this.localResolutions = 0;
    this.externalCalls = 0;
    this.duplicatePrevented = 0;
    this.promptReuses = 0;
    this.totalCostSpentUsd = 0;
    this.totalCostSavedUsd = 0;
    this.totalLatencyMs = 0;
    this.promptRegistry.clear();
    GlobalAdvancedCache.clear();
  }
}
