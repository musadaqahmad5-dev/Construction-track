import { StyleDNAEngine, PersonalFashionMemoryEngine, UnifiedStyleDNAEngine } from '../../engine';
import { StyleDNAData } from './StylistInterfaces';
import { WardrobeItem } from '../../types';

export class StyleDNAConnector {
  private static instance: StyleDNAConnector | null = null;
  private dnaCache = new Map<string, { data: StyleDNAData; timestamp: number }>();
  private cacheTtlMs = 10 * 60 * 1000;

  private constructor() {}

  public static getInstance(): StyleDNAConnector {
    if (!StyleDNAConnector.instance) {
      StyleDNAConnector.instance = new StyleDNAConnector();
    }
    return StyleDNAConnector.instance;
  }

  public async loadStyleDNA(userId: string, items?: WardrobeItem[]): Promise<StyleDNAData> {
    const cached = this.dnaCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.data;
    }

    try {
      const personalMemory: any = PersonalFashionMemoryEngine.getMemory(userId);
      const computedDNA: any = StyleDNAEngine.computeDNA(userId, items || []);
      const unifiedDNA: any = UnifiedStyleDNAEngine.generateUnifiedStyleDNA(userId);

      const archetype = computedDNA?.primaryArchetype || computedDNA?.archetype || unifiedDNA?.archetype || 'Modern Minimalist';
      const primaryVibe = personalMemory?.styleArchetype || personalMemory?.primaryVibe || 'Quiet Luxury';
      const colorPalette = personalMemory?.favoriteColors || personalMemory?.colorPalette || ['#05050a', '#ffffff', '#6366f1', '#374151'];
      const fitPreference = computedDNA?.fitPreference || 'Tailored';
      const brandAffinity = computedDNA?.preferredBrands || computedDNA?.brandAffinity || ['Bottega Veneta', 'The Row', 'Acne Studios'];
      const riskTolerance = computedDNA?.riskScore ?? computedDNA?.riskTolerance ?? 0.75;

      const result: StyleDNAData = {
        userId,
        archetype,
        primaryVibe,
        colorPalette,
        fitPreference,
        brandAffinity,
        riskTolerance,
        updatedAt: new Date().toISOString()
      };

      this.dnaCache.set(userId, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      const fallback: StyleDNAData = {
        userId,
        archetype: 'Modern Minimalist',
        primaryVibe: 'Quiet Luxury',
        colorPalette: ['#05050a', '#ffffff', '#6366f1'],
        fitPreference: 'Tailored',
        brandAffinity: ['Bottega Veneta', 'The Row'],
        riskTolerance: 0.7,
        updatedAt: new Date().toISOString()
      };
      return fallback;
    }
  }

  public async getPreferredColors(userId: string): Promise<string[]> {
    const dna = await this.loadStyleDNA(userId);
    return dna.colorPalette;
  }

  public invalidateCache(userId: string): void {
    this.dnaCache.delete(userId);
  }
}

export const styleDNAConnector = StyleDNAConnector.getInstance();
