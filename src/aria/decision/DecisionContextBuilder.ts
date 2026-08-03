/**
 * ARIA v2.5 Decision Context Builder
 * Product: LOOK VISION v2.4
 */

import { DecisionQueryRequest, DecisionReasonSignal } from './DecisionTypes';
import { StyleDNAProfile } from '../styleDNA/StyleDNATypes';
import { FashionMemoryItem } from '../memory/MemoryTypes';

export class DecisionContextBuilder {
  /**
   * Constructs reason signals linked strictly to verified Memory & Style DNA vectors
   */
  public static buildReasonSignals(
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    request?: DecisionQueryRequest
  ): DecisionReasonSignal[] {
    const signals: DecisionReasonSignal[] = [];

    // 1. Color Signal from Style DNA
    if (styleDNA && styleDNA.colorProfile.length > 0) {
      const topColor = styleDNA.colorProfile[0];
      signals.push({
        id: `sig_col_${Date.now()}_1`,
        category: 'style_dna',
        signalText: `Aligned with confirmed palette preference: ${topColor.value}`,
        source: topColor.source,
        confidence: topColor.confidence
      });
    }

    // 2. Silhouette Signal from Style DNA
    if (styleDNA && styleDNA.silhouetteProfile.length > 0) {
      const topSil = styleDNA.silhouetteProfile[0];
      signals.push({
        id: `sig_sil_${Date.now()}_2`,
        category: 'style_dna',
        signalText: `Matched signature silhouette: ${topSil.value}`,
        source: topSil.source,
        confidence: topSil.confidence
      });
    }

    // 3. Brand Signal
    if (styleDNA && styleDNA.brandAffinity.length > 0) {
      const topBrand = styleDNA.brandAffinity[0];
      signals.push({
        id: `sig_brd_${Date.now()}_3`,
        category: 'style_dna',
        signalText: `Harmonizes with preferred brand identity: ${topBrand.value}`,
        source: topBrand.source,
        confidence: topBrand.confidence
      });
    }

    // 4. Memory Signals
    const explicitMemories = memories.filter(m => m.source === 'user_explicit' || m.source === 'correction');
    if (explicitMemories.length > 0) {
      const topMem = explicitMemories[0];
      const memVal = Array.isArray(topMem.value) ? topMem.value.join(', ') : topMem.value;
      signals.push({
        id: `sig_mem_${Date.now()}_4`,
        category: 'memory',
        signalText: `Informed by verified memory: "${memVal}"`,
        source: topMem.source,
        confidence: topMem.confidence
      });
    }

    // 5. User Context Signal
    if (request?.occasion) {
      signals.push({
        id: `sig_ctx_${Date.now()}_5`,
        category: 'user_context',
        signalText: `Tailored specifically for occasion: ${request.occasion}`,
        source: 'user_explicit_context',
        confidence: 0.95
      });
    }

    return signals;
  }

  /**
   * Builds context payload string for Gemini LLM prompting
   */
  public static buildPromptContext(
    styleDNA: StyleDNAProfile | null,
    memories: FashionMemoryItem[],
    request?: DecisionQueryRequest
  ): string {
    const lines: string[] = [
      '=== ARIA DECISION INTELLIGENCE CONTEXT ===',
    ];

    if (request?.occasion) {
      lines.push(`Requested Occasion: ${request.occasion}`);
    }
    if (request?.weatherContext) {
      lines.push(`Weather Context: ${request.weatherContext}`);
    }
    if (request?.userPrompt) {
      lines.push(`User Request / Prompt: "${request.userPrompt}"`);
    }

    if (styleDNA) {
      lines.push('\n[Style DNA Profile]');
      lines.push(`Identity: ${styleDNA.identityName} (v${styleDNA.version})`);
      lines.push(`Colors: ${styleDNA.colorProfile.map(c => c.value).join(', ') || 'None'}`);
      lines.push(`Silhouettes: ${styleDNA.silhouetteProfile.map(s => s.value).join(', ') || 'None'}`);
      lines.push(`Materials: ${styleDNA.materialProfile.map(m => m.value).join(', ') || 'None'}`);
      lines.push(`Brands: ${styleDNA.brandAffinity.map(b => b.value).join(', ') || 'None'}`);
    }

    if (memories.length > 0) {
      lines.push('\n[Relevant Memories]');
      memories.slice(0, 5).forEach((m, idx) => {
        const val = Array.isArray(m.value) ? m.value.join(', ') : m.value;
        lines.push(`${idx + 1}. [${m.category}] ${val} (Conf: ${Math.round(m.confidence * 100)}%)`);
      });
    }

    return lines.join('\n');
  }
}
