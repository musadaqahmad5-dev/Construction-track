import { PLAN_DEFINITIONS } from './subscriptionService';
import { SubscriptionTier, PaymentProduct } from './IPaymentProvider';
import { PlanFeatureDefinition } from './types';

export class PlanService {
  /**
   * Retrieves definition for a single plan
   */
  public static getPlanDefinition(planId: SubscriptionTier = 'FREE'): PlanFeatureDefinition {
    const cleanId = (planId || 'FREE').toUpperCase() as SubscriptionTier;
    return PLAN_DEFINITIONS[cleanId] || PLAN_DEFINITIONS.FREE;
  }

  /**
   * Returns list of all available subscription plans formatted as products
   */
  public static getAllPlans(): PaymentProduct[] {
    return Object.values(PLAN_DEFINITIONS).map(plan => ({
      id: plan.planId,
      name: plan.name,
      tagline: plan.description,
      priceMonthly: plan.priceMonthly,
      priceYearly: plan.priceYearly,
      creditsMonthly: plan.creditsMonthly,
      isPopular: plan.planId === 'PREMIUM',
      features: plan.featuresList
    }));
  }

  /**
   * Returns list of plan definitions
   */
  public static getPlanDefinitions(): PlanFeatureDefinition[] {
    return Object.values(PLAN_DEFINITIONS);
  }
}
