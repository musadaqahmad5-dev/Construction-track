import { CatalogProduct, CatalogResolver } from '../commerce/catalogResolver';

export interface FeedRecommendation {
  sourcePostId: string;
  recommendedProducts: CatalogProduct[];
  discountCodeApplied?: string;
  savingFraction: number;
}

export class RecommendationFeed {
  static getFeedRecommendations(postId: string): FeedRecommendation {
    const defaultProducts = CatalogResolver.getFullCatalog().slice(0, 2);
    
    // Choose products based on suffix
    let products = defaultProducts;
    let code: string | undefined = undefined;

    if (postId.includes('fy')) {
      // Scandi or Charlotte
      products = CatalogResolver.getFullCatalog().filter(p => ['prod-01', 'prod-02'].includes(p.productId));
      code = 'FYNEO15';
    } else if (postId.includes('tr')) {
      // Tactical
      products = CatalogResolver.getFullCatalog().filter(p => ['prod-05', 'prod-06'].includes(p.productId));
      code = 'STEALTH10';
    }

    return {
      sourcePostId: postId,
      recommendedProducts: products,
      discountCodeApplied: code,
      savingFraction: code ? 0.15 : 0
    };
  }
}
