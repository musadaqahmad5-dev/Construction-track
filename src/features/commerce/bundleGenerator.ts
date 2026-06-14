import { CatalogFashionProduct } from './catalogMatcher';

export interface CommerceBundle {
  bundleId: string;
  title: string;
  items: CatalogFashionProduct[];
  subtotal: number;
  discountRatePercent: number; // 10%, 15%, 20% bundle completion cuts
  finalPrice: number;
  savingUsd: number;
  promoHeadline: string;
}

export class BundleGenerator {
  /**
   * Generates discounted styling bundles to encourage fast outfitting completions.
   */
  static generateCompleterBundle(suggestions: CatalogFashionProduct[]): CommerceBundle | null {
    if (suggestions.length === 0) return null;

    const bundleId = `bundle_completer_${Date.now()}`;
    // Select at most 2 items to avoid overwhelming carts
    const itemsToBundle = suggestions.slice(0, 2);

    const subtotal = itemsToBundle.reduce((accum, item) => accum + item.priceUsd, 0);
    // Bundle size discount progression: 1 item = 10%, 2+ items = 20%
    const discountRatePercent = itemsToBundle.length >= 2 ? 20 : 10;
    
    const savingUsd = parseFloat(((subtotal * discountRatePercent) / 100).toFixed(2));
    const finalPrice = parseFloat((subtotal - savingUsd).toFixed(2));

    const itemNames = itemsToBundle.map(i => i.name).join(' & ');
    const title = itemsToBundle.length >= 2 ? 'Full Outfit Completer Set' : 'Style Curation Solo Accent';
    const promoHeadline = `Complete your coordinate with ${discountRatePercent}% exclusive bundle savings on: ${itemNames}`;

    return {
      bundleId,
      title,
      items: itemsToBundle,
      subtotal,
      discountRatePercent,
      finalPrice,
      savingUsd,
      promoHeadline
    };
  }
}
