import { CatalogProduct, CatalogResolver } from './catalogResolver';

export interface CrossSellItem {
  product: CatalogProduct;
  reason: string;
  synergyScore: number;
}

export class RecommendationMarketplace {
  static getSynergisticCrossSells(
    activeLookCategories: string[],
    preferredBrandAffinity?: string
  ): CrossSellItem[] {
    const fullCatalog = CatalogResolver.getFullCatalog();
    
    // Look for accessories or complementary categories not represented in current active outfit layers
    const unrepresented = fullCatalog.filter(
      p => !activeLookCategories.includes(p.category)
    );

    return unrepresented.map(prod => {
      let score = prod.score;
      let reason = `Provides high stylistic pairing matching ${prod.fabric}.`;

      if (preferredBrandAffinity && prod.brand.toLowerCase() === preferredBrandAffinity.toLowerCase()) {
        score += 5;
        reason = `Matches your registered affinity for premium master brand ${prod.brand}.`;
      }

      if (prod.category === 'acc') {
        reason = `Polishes the overall look silhouette as a final modular accessory.`;
      }

      return {
        product: prod,
        reason,
        synergyScore: score
      };
    });
  }
}
