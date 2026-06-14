export interface CacheEntry<T> {
  timestamp: string;
  region: string;
  data: T;
}

export class FreshnessValidator {
  private static CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache freshness constraint

  /**
   * Verifies if cached trends are fresh and match the requested region.
   */
  static isCacheFresh<T>(cached: CacheEntry<T> | null, targetRegion: string): boolean {
    if (!cached) return false;
    if (cached.region.toUpperCase() !== targetRegion.toUpperCase()) return false;

    const cacheTime = new Date(cached.timestamp).getTime();
    const now = Date.now();

    const ageMs = now - cacheTime;
    const isFresh = ageMs < this.CACHE_TTL_MS;
    
    console.log(`[FreshnessValidator] Checking cache of age ${(ageMs / 1000 / 60).toFixed(1)}m. IsFresh: ${isFresh}`);
    return isFresh;
  }

  /**
   * Constructs a standard fresh structured cache envelope.
   */
  static sealCache<T>(data: T, region: string): CacheEntry<T> {
    return {
      timestamp: new Date().toISOString(),
      region: region.toUpperCase(),
      data
    };
  }
}
