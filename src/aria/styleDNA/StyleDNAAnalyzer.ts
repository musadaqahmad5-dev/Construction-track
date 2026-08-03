/**
 * ARIA v2.5 Style DNA Analyzer
 * Product: LOOK VISION v2.4
 */

import { 
  StyleDNAAttribute, 
  StyleDNASource 
} from './StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';
import { StyleDNAScorer } from './StyleDNAScorer';

export class StyleDNAAnalyzer {
  /**
   * Analyzes memory items and constructs structured vector attributes for a given category
   */
  public static extractAttributesForCategory(
    memories: FashionMemoryItem[],
    memoryCategoryFilter: string | string[]
  ): StyleDNAAttribute<string>[] {
    const filterCategories = Array.isArray(memoryCategoryFilter) 
      ? memoryCategoryFilter 
      : [memoryCategoryFilter];

    const matchingMemories = memories.filter((m) => filterCategories.includes(m.category));

    // Map to aggregate value occurrences and evidence
    const aggregatedMap = new Map<string, {
      values: string[];
      evidenceCount: number;
      highestConfidence: number;
      source: StyleDNASource;
      lastConfirmedAt: string;
      category: string;
    }>();

    for (const item of matchingMemories) {
      let rawValues: string[] = [];
      if (typeof item.value === 'string') {
        rawValues = [item.value];
      } else if (Array.isArray(item.value)) {
        rawValues = item.value.map(String);
      }

      const source: StyleDNASource = 
        item.source === 'correction' || item.category === 'user_correction'
          ? 'user_correction'
          : item.source === 'user_explicit' || item.category === 'explicit_preference'
          ? 'user_explicit'
          : item.source === 'feedback_loop'
          ? 'confirmed_interaction'
          : 'stored_memory';

      for (const val of rawValues) {
        const cleanVal = val.trim();
        if (!cleanVal) continue;

        const key = cleanVal.toLowerCase();
        const existing = aggregatedMap.get(key);

        if (existing) {
          existing.evidenceCount += (item.metadata?.interactionCount || 1);
          existing.highestConfidence = Math.max(existing.highestConfidence, item.confidence);
          if (new Date(item.updatedAt || item.createdAt) > new Date(existing.lastConfirmedAt)) {
            existing.lastConfirmedAt = item.updatedAt || item.createdAt;
            existing.source = source;
          }
        } else {
          aggregatedMap.set(key, {
            values: [cleanVal],
            evidenceCount: item.metadata?.interactionCount || 1,
            highestConfidence: item.confidence,
            source,
            lastConfirmedAt: item.updatedAt || item.createdAt,
            category: item.subcategory || item.category
          });
        }
      }
    }

    const attributes: StyleDNAAttribute<string>[] = [];

    aggregatedMap.forEach((entry, key) => {
      const displayVal = entry.values[0];
      const isCorrection = entry.source === 'user_correction';
      const confidence = StyleDNAScorer.calculateAttributeScore(
        entry.highestConfidence,
        entry.evidenceCount,
        isCorrection
      );

      attributes.push({
        id: `sdna_attr_${key.replace(/[^a-z0-9]/g, '_')}`,
        key,
        value: displayVal,
        source: entry.source,
        confidence,
        evidenceCount: entry.evidenceCount,
        lastConfirmedAt: entry.lastConfirmedAt,
        category: entry.category
      });
    });

    // Sort by confidence descending
    return attributes.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Generates identity name from primary colors, styles, and silhouettes
   */
  public static deriveIdentityName(
    colors: StyleDNAAttribute<string>[],
    silhouettes: StyleDNAAttribute<string>[],
    materials: StyleDNAAttribute<string>[]
  ): string {
    const topColor = colors[0]?.value;
    const topSilhouette = silhouettes[0]?.value;
    const topMaterial = materials[0]?.value;

    if (topColor && topSilhouette) {
      return `${topColor} ${topSilhouette} Identity`;
    } else if (topSilhouette && topMaterial) {
      return `${topMaterial} ${topSilhouette} Archetype`;
    } else if (topColor) {
      return `${topColor} Minimalist Palette`;
    }

    return 'Curated Personal DNA';
  }
}
