import { DailyRecommendation, WardrobeItem } from '../../types';

/**
 * Recommendation Engine - Context-aware seasonal outfit recommendation.
 */
export class RecommendationEngine {
  /**
   * Evaluates historical wear histories to prevent style fatigue (wearing the same thing repeatedly).
   */
  static preventStyleFatigue(
    items: WardrobeItem[],
    history: any[]
  ): WardrobeItem[] {
    if (!history || history.length === 0) return items;
    // Get IDs of items worn in the last 3 outfits/rotations
    const recentlyWornIds = new Set<string>();
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA; // descending
    });
    
    // Take the last 3 items or outfits
    const recentSelections = sortedHistory.slice(0, 3);
    for (const record of recentSelections) {
      if (record.itemId) {
        recentlyWornIds.add(record.itemId);
      }
      if (Array.isArray(record.itemIds)) {
        record.itemIds.forEach((id: string) => recentlyWornIds.add(id));
      }
      if (record.outfit && Array.isArray(record.outfit.itemIds)) {
        record.outfit.itemIds.forEach((id: string) => recentlyWornIds.add(id));
      }
    }

    const filtered = items.filter(item => !recentlyWornIds.has(item.id));
    // Fallback if we filter out everything: return original items
    return filtered.length > 0 ? filtered : items;
  }
}
