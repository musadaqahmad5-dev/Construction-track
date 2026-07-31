import { paymentRegistry } from './providerAdapter';
import { SubscriptionService, PLAN_DEFINITIONS } from './subscriptionService';
import { FeatureAccessService } from './featureAccessService';
import { CheckoutParams, CheckoutResult, SubscriptionTier, PaymentProduct } from './IPaymentProvider';
import { UserSubscriptionState, FeatureKey, FeatureAccessResult } from './types';

export class PaymentService {
  /**
   * Generates a checkout session using active provider (Lemon Squeezy)
   */
  public static async createCheckout(
    params: CheckoutParams,
    providerId?: string
  ): Promise<CheckoutResult> {
    const provider = paymentRegistry.getProvider(providerId);
    return await provider.createCheckout(params);
  }

  /**
   * Retrieves user subscription status and detailed quota/credit breakdown
   */
  public static async getSubscriptionStatus(userId: string): Promise<{
    subscription: UserSubscriptionState;
    planDefinition: any;
    allPlans: PaymentProduct[];
  }> {
    const subscription = await SubscriptionService.getUserSubscription(userId);
    const planDefinition = PLAN_DEFINITIONS[subscription.planId] || PLAN_DEFINITIONS.FREE;
    const provider = paymentRegistry.getProvider(subscription.provider);
    const allPlans = await provider.getProducts();

    return {
      subscription,
      planDefinition,
      allPlans
    };
  }

  /**
   * Upgrades or changes subscription
   */
  public static async changeSubscriptionPlan(
    userId: string,
    planId: SubscriptionTier
  ): Promise<UserSubscriptionState> {
    return await SubscriptionService.updateUserSubscription(userId, { planId });
  }

  /**
   * Evaluates feature access rights
   */
  public static async checkFeatureAccess(
    userId: string,
    featureKey: FeatureKey
  ): Promise<FeatureAccessResult> {
    return await FeatureAccessService.checkFeatureAccess(userId, featureKey);
  }

  /**
   * Deducts AI generation credits
   */
  public static async deductCredits(
    userId: string,
    amount: number,
    featureKey: string,
    reason?: string
  ): Promise<{ success: boolean; newBalance: number; error?: string }> {
    return await SubscriptionService.deductCredits(userId, amount, featureKey, reason);
  }

  /**
   * Processes webhook from payment providers
   */
  public static async handleWebhook(
    rawBody: string | Buffer,
    headers: Record<string, any>,
    providerId: string = 'lemonsqueezy'
  ) {
    const provider = paymentRegistry.getProvider(providerId);
    const result = await provider.handleWebhook(rawBody, headers);

    // Apply state changes to user if webhook payload resolved a user & action
    if (result.success && result.userId) {
      if (result.planId) {
        await SubscriptionService.updateUserSubscription(result.userId, {
          planId: result.planId,
          status: result.subscriptionStatus || 'active'
        });
      } else if (result.creditsAdded && result.creditsAdded > 0) {
        await SubscriptionService.topupCredits(
          result.userId,
          result.creditsAdded,
          `Webhook Top-up (${result.eventType})`
        );
      }
    }

    return result;
  }
}
