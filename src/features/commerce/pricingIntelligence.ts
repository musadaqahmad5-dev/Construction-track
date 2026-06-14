import { CatalogProduct } from './catalogResolver';

export interface PriceEstimation {
  basePrice: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  finalPrice: number;
  savingsRate: number;
}

export class PricingIntelligence {
  private static TAX_RATE = 0.0825; // 8.25% standard

  static calculateEstimatedCosts(
    products: CatalogProduct[],
    pricingTier: 'budget' | 'premium' | 'balanced'
  ): PriceEstimation {
    const totalRaw = products.reduce((sum, p) => {
      // Scale prices according to tier for simulation
      let factor = 1.0;
      if (pricingTier === 'budget') {
        factor = 0.45; // Simulated budget alternatives
      } else if (pricingTier === 'premium') {
        factor = 1.6; // High luxury premium lines
      }
      return sum + p.price * factor;
    }, 0);

    // Dynamic bundle markdown (save 12% if buying more than 2 items)
    const savingsRate = products.length >= 3 ? 0.12 : 0;
    const discountAmount = Math.round(totalRaw * savingsRate * 100) / 100;
    const discountedBase = totalRaw - discountAmount;
    
    const taxAmount = Math.round(discountedBase * this.TAX_RATE * 100) / 100;
    // Free shipping above $300
    const shippingFee = discountedBase > 300 ? 0 : 15;

    const finalPrice = Math.round((discountedBase + taxAmount + shippingFee) * 100) / 100;

    return {
      basePrice: Math.round(totalRaw * 100) / 100,
      discountAmount,
      taxAmount,
      shippingFee,
      finalPrice,
      savingsRate: Math.round(savingsRate * 100)
    };
  }

  static getBudgetOptimizationSuggestion(totalPrice: number, targetBudget: number): string {
    if (totalPrice <= targetBudget) {
      return "Current configuration lies fully within target style parameters.";
    }
    const delta = Math.round(totalPrice - targetBudget);
    return `Swap premium midlayer/outer coat to budget substitute to recover $${delta} margin.`;
  }
}
