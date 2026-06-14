import { RenderedLook } from '../rendering/outfitRenderer';
import { CatalogProduct, CatalogResolver } from './catalogResolver';
import { PricingIntelligence, PriceEstimation } from './pricingIntelligence';

export interface PurchasableBasket {
  lookId: string;
  purchasableItems: CatalogProduct[];
  pricingOverview: PriceEstimation;
  totalPrice: number;
  alternatives: {
    productId: string;
    originalProductId: string;
    name: string;
    price: number;
    reason: string;
  }[];
  styleRetentionScore: number; // 0-100 indicating how closely the active catalog matches original design weights
}

export class CommerceEngine {
  static resolveLookToBasket(
    look: RenderedLook,
    mode: 'budget' | 'premium' | 'complete' = 'complete'
  ): PurchasableBasket {
    const purchasableItems: CatalogProduct[] = [];
    const alternatesList: { productId: string; originalProductId: string; name: string; price: number; reason: string }[] = [];
    
    // Resolve each layer in look
    look.garmentLayers.forEach((layer) => {
      const candidates = CatalogResolver.queryProducts(layer.layer);
      
      if (candidates.length > 0) {
        // Sort based on mode
        let selectedProduct = candidates[0];
        if (mode === 'budget') {
          // Choose cheaper candidate
          selectedProduct = [...candidates].sort((a, b) => a.price - b.price)[0];
        } else if (mode === 'premium') {
          // Choose luxury candidate
          selectedProduct = [...candidates].sort((a, b) => b.price - a.price)[0];
        }

        purchasableItems.push(selectedProduct);

        // Populate alternative list with remaining items
        const subList = candidates.filter(c => c.productId !== selectedProduct.productId);
        subList.forEach(srv => {
          alternatesList.push({
            productId: srv.productId,
            originalProductId: selectedProduct.productId,
            name: srv.name,
            price: srv.price,
            reason: `Highly modular replacement option satisfying original ${layer.layer} layer in ${layer.color}.`
          });
        });
      }
    });

    // Calculate dynamic pricing metrics
    const pricingOverview = PricingIntelligence.calculateEstimatedCosts(
      purchasableItems,
      mode === 'budget' ? 'budget' : mode === 'premium' ? 'premium' : 'balanced'
    );

    // Calculate style retention score based on matching layer count and brand reputation elements
    let baseScore = 100;
    if (mode === 'budget') {
      baseScore -= 12; // Some fabric dilution in budget setups
    }
    if (purchasableItems.length < look.garmentLayers.length) {
      baseScore -= (look.garmentLayers.length - purchasableItems.length) * 20;
    }
    
    return {
      lookId: look.renderId,
      purchasableItems,
      pricingOverview,
      totalPrice: pricingOverview.finalPrice,
      alternatives: alternatesList,
      styleRetentionScore: Math.max(0, Math.min(100, baseScore))
    };
  }
}
