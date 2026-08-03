import { StylistIntent, StylistRequest } from './StylistInterfaces';

export interface EntityExtractionResult {
  occasion?: string;
  season?: string;
  weather?: string;
  colors?: string[];
  budget?: number;
  vibe?: string;
  garmentTypes?: string[];
}

export class IntentResolver {
  private static instance: IntentResolver | null = null;

  private constructor() {}

  public static getInstance(): IntentResolver {
    if (!IntentResolver.instance) {
      IntentResolver.instance = new IntentResolver();
    }
    return IntentResolver.instance;
  }

  public resolveIntent(request: StylistRequest): StylistIntent {
    if (request.overrideIntent) {
      return request.overrideIntent;
    }

    const text = (request.rawInput || '').toLowerCase().trim();

    if (request.imageUrl && (text.includes('try on') || text.includes('vto') || text.includes('fit') || text.length === 0)) {
      return 'TRY_ON';
    }

    if (request.videoUrl) {
      return 'VIDEO';
    }

    if (this.matchesKeywords(text, ['try on', 'virtual try', 'vto', 'fitting room', 'look on me', 'wearing this'])) {
      return 'TRY_ON';
    }

    if (this.matchesKeywords(text, ['wear', 'outfit', 'dress code', 'what to wear', 'combination', 'look for today', 'attire', 'suit up', 'match this'])) {
      return 'OUTFIT';
    }

    if (this.matchesKeywords(text, ['wardrobe', 'closet', 'my clothes', 'inventory', 'organize', 'hangers', 'stored items'])) {
      return 'WARDROBE';
    }

    if (this.matchesKeywords(text, ['buy', 'purchase', 'shop', 'price', 'store', 'marketplace', 'checkout', 'discount', 'deal', 'where to get'])) {
      return 'SHOPPING';
    }

    if (this.matchesKeywords(text, ['trend', 'trending', 'in style', 'popular', 'fashion week', 'runway', 'viral', 'forecast', 'whats hot'])) {
      return 'TREND';
    }

    if (this.matchesKeywords(text, ['color', 'palette', 'hue', 'shade', 'contrast', 'matching color', 'color harmony', 'tone'])) {
      return 'COLOR';
    }

    if (this.matchesKeywords(text, ['community', 'feed', 'post', 'creator', 'creators', 'social', 'like', 'share', 'explore creators'])) {
      return 'COMMUNITY';
    }

    if (this.matchesKeywords(text, ['marketplace', 'listing', 'seller', 'brand catalog', 'collections'])) {
      return 'MARKETPLACE';
    }

    if (this.matchesKeywords(text, ['generate image', 'render', 'create look', 'design dress', 'ai director', 'couture generator', 'sketch'])) {
      return 'IMAGE';
    }

    if (this.matchesKeywords(text, ['advice', 'tip', 'guide', 'fashion rule', 'body type', 'how to style', 'improve style', 'recommendation'])) {
      return 'STYLE_ADVICE';
    }

    if (text.length > 0) {
      return 'GENERAL';
    }

    return 'UNKNOWN';
  }

  public extractEntities(text: string): EntityExtractionResult {
    const lower = text.toLowerCase();
    const result: EntityExtractionResult = {};

    const occasions = ['wedding', 'gala', 'casual', 'business', 'office', 'party', 'date night', 'cocktail', 'gym', 'vacation', 'beach'];
    for (const occ of occasions) {
      if (lower.includes(occ)) {
        result.occasion = occ.toUpperCase();
        break;
      }
    }

    const seasons = ['summer', 'winter', 'spring', 'autumn', 'fall'];
    for (const s of seasons) {
      if (lower.includes(s)) {
        result.season = s.charAt(0).toUpperCase() + s.slice(1);
        break;
      }
    }

    const colorMap: Record<string, string> = {
      black: '#05050a',
      white: '#ffffff',
      navy: '#1e3a8a',
      emerald: '#059669',
      violet: '#7c3aed',
      charcoal: '#374151',
      beige: '#f5f5dc',
      red: '#dc2626',
      gold: '#d97706'
    };
    const foundColors: string[] = [];
    for (const [name, hex] of Object.entries(colorMap)) {
      if (lower.includes(name)) {
        foundColors.push(hex);
      }
    }
    if (foundColors.length > 0) {
      result.colors = foundColors;
    }

    const budgetMatch = lower.match(/\$(\d+)|(\d+)\s*dollars|budget\s*of\s*(\d+)/);
    if (budgetMatch) {
      const amt = budgetMatch[1] || budgetMatch[2] || budgetMatch[3];
      if (amt) {
        result.budget = parseInt(amt, 10);
      }
    }

    const vibes = ['minimalist', 'avant garde', 'streetwear', 'quiet luxury', 'boho', 'chic', 'vintage', 'monochrome'];
    for (const v of vibes) {
      if (lower.includes(v)) {
        result.vibe = v.toUpperCase();
        break;
      }
    }

    return result;
  }

  private matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
  }
}

export const intentResolver = IntentResolver.getInstance();
