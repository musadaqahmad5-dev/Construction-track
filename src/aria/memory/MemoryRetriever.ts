/**
 * ARIA v2.5 Memory Retriever Service
 * Product: LOOK VISION v2.4
 */

import { 
  FashionMemoryItem, 
  MemoryQueryFilter, 
  MemoryContextSummary,
  FashionMemoryCategory 
} from './MemoryTypes';
import { MemoryConfidenceEvaluator } from './MemoryConfidence';

export class MemoryRetriever {
  /**
   * Filter and query memory list
   */
  public static filterMemories(
    memories: FashionMemoryItem[],
    filter?: MemoryQueryFilter
  ): FashionMemoryItem[] {
    if (!filter) return memories;

    return memories.filter((m) => {
      if (filter.category && m.category !== filter.category) return false;
      if (filter.level && m.level !== filter.level) return false;
      if (filter.source && m.source !== filter.source) return false;
      if (filter.minConfidence && m.confidence < filter.minConfidence) return false;

      if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase();
        const categoryMatch = m.category.toLowerCase().includes(query);
        const subMatch = m.subcategory?.toLowerCase().includes(query);
        const valMatch = typeof m.value === 'string' 
          ? m.value.toLowerCase().includes(query)
          : Array.isArray(m.value)
          ? m.value.some((v) => String(v).toLowerCase().includes(query))
          : false;

        if (!categoryMatch && !subMatch && !valMatch) return false;
      }

      return true;
    }).slice(0, filter.limit || 100);
  }

  /**
   * Builds an aggregated context summary for injection into ARIA AI prompts
   */
  public static buildContextSummary(
    userId: string | undefined,
    memories: FashionMemoryItem[]
  ): MemoryContextSummary {
    const totalMemories = memories.length;

    const extractValues = (category: FashionMemoryCategory): string[] => {
      const items = memories.filter((m) => m.category === category && m.confidence >= 0.5);
      const results: string[] = [];
      for (const item of items) {
        if (typeof item.value === 'string') {
          results.push(item.value);
        } else if (Array.isArray(item.value)) {
          results.push(...item.value.map(String));
        }
      }
      return Array.from(new Set(results));
    };

    const topColors = extractValues('color_preference');
    const topStyles = extractValues('style_preference');
    const preferredBrands = extractValues('brand_preference');
    const preferredSilhouettes = extractValues('silhouette_preference');
    const preferredMaterials = extractValues('material_preference');

    const recentCorrections = memories
      .filter((m) => m.category === 'user_correction' || m.source === 'correction')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let totalScore = 0;

    memories.forEach((m) => {
      totalScore += m.confidence;
      const bracket = MemoryConfidenceEvaluator.classifyConfidenceLevel(m.confidence);
      if (bracket === 'HIGH') highCount++;
      else if (bracket === 'MEDIUM') mediumCount++;
      else lowCount++;
    });

    const averageConfidence = totalMemories > 0 ? Number((totalScore / totalMemories).toFixed(2)) : 0;

    return {
      userId,
      totalMemories,
      preferencesCount: memories.filter((m) => m.level === 'preference' || m.level === 'long_term').length,
      topColors,
      topStyles,
      preferredBrands,
      preferredSilhouettes,
      preferredMaterials,
      recentCorrections,
      confidenceOverview: {
        highCount,
        mediumCount,
        lowCount,
        averageConfidence
      },
      lastSyncedAt: new Date().toISOString()
    };
  }

  /**
   * Converts memory context summary into clean prompt string for Gemini LLM
   */
  public static formatSummaryForPrompt(summary: MemoryContextSummary): string {
    if (summary.totalMemories === 0) {
      return "FASHION MEMORY: No explicit user preferences recorded yet.";
    }

    const lines: string[] = [
      `FASHION MEMORY PROFILE (Total Records: ${summary.totalMemories}):`
    ];

    if (summary.topColors.length > 0) {
      lines.push(`• Preferred Colors: ${summary.topColors.join(', ')}`);
    }
    if (summary.topStyles.length > 0) {
      lines.push(`• Preferred Styles: ${summary.topStyles.join(', ')}`);
    }
    if (summary.preferredSilhouettes.length > 0) {
      lines.push(`• Preferred Silhouettes: ${summary.preferredSilhouettes.join(', ')}`);
    }
    if (summary.preferredMaterials.length > 0) {
      lines.push(`• Preferred Materials: ${summary.preferredMaterials.join(', ')}`);
    }
    if (summary.preferredBrands.length > 0) {
      lines.push(`• Preferred Brands: ${summary.preferredBrands.join(', ')}`);
    }

    if (summary.recentCorrections.length > 0) {
      lines.push(`• Recent User Corrections:`);
      summary.recentCorrections.forEach((c) => {
        lines.push(`   - ${c.subcategory}: ${JSON.stringify(c.value)}`);
      });
    }

    return lines.join('\n');
  }
}
