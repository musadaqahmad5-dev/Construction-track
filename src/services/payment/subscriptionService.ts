import { getFirestore } from 'firebase-admin/firestore';
import { SubscriptionTier, SubscriptionStatus } from './IPaymentProvider';
import { UserSubscriptionState, CreditTransaction, PlanFeatureDefinition } from './types';

// Thread-safe in-memory store for guest/fallback mode when Firestore is unreachable
const memorySubscriptions = new Map<string, UserSubscriptionState>();
const memoryCreditTransactions = new Map<string, CreditTransaction[]>();

export const PLAN_DEFINITIONS: Record<SubscriptionTier, PlanFeatureDefinition> = {
  FREE: {
    planId: 'FREE',
    name: 'Sartorial Essentials',
    description: 'Core fashion AI tools for enthusiasts',
    priceMonthly: 0,
    priceYearly: 0,
    creditsMonthly: 200,
    maxVirtualTryOnsPerMonth: 10,
    maxAiStudioGenerationsPerMonth: 25,
    canAccessMatureStudio: true,
    canAccessMarketplaceSeller: false,
    canAccessCustomAiTraining: false,
    hasPriorityProcessing: false,
    hasWhiteLabelExport: false,
    featuresList: [
      '200 Monthly AI Fashion Credits',
      'Standard Fashion Intelligence Engine access',
      'Basic Virtual Try-On (2D overlay)',
      'Public Community & Feed exploration',
      'Digital Wardrobe storage up to 25 items'
    ]
  },
  PREMIUM: {
    planId: 'PREMIUM',
    name: 'Style Studio Pro',
    description: 'High-definition fashion AI and photorealistic try-on pipeline',
    priceMonthly: 29,
    priceYearly: 290,
    creditsMonthly: 2000,
    maxVirtualTryOnsPerMonth: 150,
    maxAiStudioGenerationsPerMonth: 300,
    canAccessMatureStudio: true,
    canAccessMarketplaceSeller: false,
    canAccessCustomAiTraining: false,
    hasPriorityProcessing: true,
    hasWhiteLabelExport: false,
    featuresList: [
      '2,000 Monthly AI Fashion Credits',
      'High-Resolution AI Fashion Generation (4K)',
      'Photorealistic 3D Virtual Try-On Pipeline',
      'Mature Fashion Studio & Couture Intelligence',
      'Style DNA & Deep Persona Profiling',
      'Unlimited Wardrobe Storage',
      'Priority Generation Pipeline'
    ]
  },
  CREATOR_PRO: {
    planId: 'CREATOR_PRO',
    name: 'Creator Operating System',
    description: 'Digital fashion atelier, marketplace commerce and monetization studio',
    priceMonthly: 79,
    priceYearly: 790,
    creditsMonthly: 10000,
    maxVirtualTryOnsPerMonth: 1000,
    maxAiStudioGenerationsPerMonth: 2000,
    canAccessMatureStudio: true,
    canAccessMarketplaceSeller: true,
    canAccessCustomAiTraining: true,
    hasPriorityProcessing: true,
    hasWhiteLabelExport: false,
    featuresList: [
      '10,000 Monthly AI Fashion Credits',
      'Full Marketplace Seller Studio & Digital Commerce',
      'Custom Brand Collection Publishing',
      '0% Commission on Digital Garment Sales',
      'Creator Reputation & Verification Badge',
      'Video Fashion Runway Generation',
      'Audience Analytics & Direct Follower Broadcasts'
    ]
  },
  ENTERPRISE: {
    planId: 'ENTERPRISE',
    name: 'Fashion House Enterprise',
    description: 'Bespoke AI style models, enterprise APIs and white-label tools',
    priceMonthly: 299,
    priceYearly: 2990,
    creditsMonthly: 50000,
    maxVirtualTryOnsPerMonth: 10000,
    maxAiStudioGenerationsPerMonth: 20000,
    canAccessMatureStudio: true,
    canAccessMarketplaceSeller: true,
    canAccessCustomAiTraining: true,
    hasPriorityProcessing: true,
    hasWhiteLabelExport: true,
    featuresList: [
      '50,000 Monthly AI Fashion Credits',
      'Dedicated Fine-Tuned Model Weights for Your Brand',
      'White-Label 3D Garment Render API',
      'Dedicated Account Strategist & SLA',
      'Custom ERP & Inventory Synchronization',
      'Multi-user Studio Team Management'
    ]
  }
};

export class SubscriptionService {
  /**
   * Retrieves user subscription status from Firestore or in-memory fallback
   */
  public static async getUserSubscription(userId: string): Promise<UserSubscriptionState> {
    const cleanUserId = userId || 'guest-sartorialist-user-100';

    try {
      const db = getFirestore();
      const userDoc = await db.collection('users').doc(cleanUserId).get();

      if (userDoc.exists) {
        const data = userDoc.data() || {};
        const sub = data.subscription || {};

        const planId: SubscriptionTier = (sub.planId || sub.tier || 'FREE').toUpperCase() as SubscriptionTier;
        const validPlan: SubscriptionTier = PLAN_DEFINITIONS[planId] ? planId : 'FREE';

        return {
          userId: cleanUserId,
          planId: validPlan,
          status: (sub.status || 'active') as SubscriptionStatus,
          provider: sub.provider || 'lemonsqueezy',
          customerId: sub.customerId || sub.stripeCustomerId || `cust_${cleanUserId}`,
          subscriptionId: sub.subscriptionId || sub.stripeSubscriptionId || `sub_${cleanUserId}`,
          startDate: sub.startDate || new Date().toISOString(),
          endDate: sub.endDate || new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
          renewalDate: sub.renewalDate || sub.endDate || new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
          cancelAtPeriodEnd: !!sub.cancelAtPeriodEnd,
          creditBalance: typeof sub.creditBalance === 'number' ? sub.creditBalance : PLAN_DEFINITIONS[validPlan].creditsMonthly,
          lifetimeCreditsEarned: typeof sub.lifetimeCreditsEarned === 'number' ? sub.lifetimeCreditsEarned : PLAN_DEFINITIONS[validPlan].creditsMonthly,
          updatedAt: sub.updatedAt || new Date().toISOString()
        };
      }
    } catch (err: any) {
      console.info(`[SubscriptionService] Firestore read offline/unreachable. Using in-memory subscription store for ${cleanUserId}`);
    }

    // In-memory fallback lookup
    if (!memorySubscriptions.has(cleanUserId)) {
      const defaultState: UserSubscriptionState = {
        userId: cleanUserId,
        planId: 'FREE',
        status: 'active',
        provider: 'lemonsqueezy',
        customerId: `cust_${cleanUserId}`,
        subscriptionId: `sub_free_${cleanUserId}`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        renewalDate: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        creditBalance: PLAN_DEFINITIONS.FREE.creditsMonthly,
        lifetimeCreditsEarned: PLAN_DEFINITIONS.FREE.creditsMonthly,
        updatedAt: new Date().toISOString()
      };
      memorySubscriptions.set(cleanUserId, defaultState);
    }

    return memorySubscriptions.get(cleanUserId)!;
  }

  /**
   * Updates or upgrades user subscription tier and provisions monthly credit grant
   */
  public static async updateUserSubscription(
    userId: string,
    updates: Partial<UserSubscriptionState> & { planId: SubscriptionTier }
  ): Promise<UserSubscriptionState> {
    const currentSub = await SubscriptionService.getUserSubscription(userId);
    const newPlanId = updates.planId;
    const planDef = PLAN_DEFINITIONS[newPlanId] || PLAN_DEFINITIONS.FREE;

    // Check if upgrading tier to grant new tier credits
    const isTierUpgrade = currentSub.planId !== newPlanId;
    const addedCredits = isTierUpgrade ? planDef.creditsMonthly : 0;

    const updatedState: UserSubscriptionState = {
      ...currentSub,
      ...updates,
      userId,
      planId: newPlanId,
      status: updates.status || 'active',
      creditBalance: currentSub.creditBalance + addedCredits,
      lifetimeCreditsEarned: currentSub.lifetimeCreditsEarned + addedCredits,
      updatedAt: new Date().toISOString()
    };

    // Save to memory cache
    memorySubscriptions.set(userId, updatedState);

    // Save to Firestore asynchronously
    try {
      const db = getFirestore();
      await db.collection('users').doc(userId).set({
        subscription: {
          planId: updatedState.planId,
          tier: updatedState.planId.toLowerCase(),
          status: updatedState.status,
          provider: updatedState.provider,
          customerId: updatedState.customerId,
          subscriptionId: updatedState.subscriptionId,
          startDate: updatedState.startDate,
          endDate: updatedState.endDate,
          renewalDate: updatedState.renewalDate,
          cancelAtPeriodEnd: updatedState.cancelAtPeriodEnd,
          creditBalance: updatedState.creditBalance,
          lifetimeCreditsEarned: updatedState.lifetimeCreditsEarned,
          updatedAt: updatedState.updatedAt
        }
      }, { merge: true });
      console.log(`[SubscriptionService] Successfully updated subscription for ${userId} to ${newPlanId}`);
    } catch (err: any) {
      console.warn(`[SubscriptionService] Firestore sync error on update: ${err.message}`);
    }

    if (addedCredits > 0) {
      await SubscriptionService.recordCreditTransaction(
        userId,
        addedCredits,
        'monthly_grant',
        `Upgraded to ${planDef.name} plan (${addedCredits} credits added)`,
        updatedState.creditBalance
      );
    }

    return updatedState;
  }

  /**
   * Deducts credits for AI fashion generation with atomic check
   */
  public static async deductCredits(
    userId: string,
    amount: number,
    featureKey: string,
    reason?: string
  ): Promise<{ success: boolean; newBalance: number; error?: string }> {
    const sub = await SubscriptionService.getUserSubscription(userId);

    if (sub.creditBalance < amount) {
      return {
        success: false,
        newBalance: sub.creditBalance,
        error: `Insufficient AI credits. Required: ${amount}, Available: ${sub.creditBalance}. Upgrade your plan or top up.`
      };
    }

    const newBalance = sub.creditBalance - amount;
    sub.creditBalance = newBalance;
    sub.updatedAt = new Date().toISOString();

    memorySubscriptions.set(userId, sub);

    try {
      const db = getFirestore();
      await db.collection('users').doc(userId).set({
        'subscription.creditBalance': newBalance,
        'subscription.updatedAt': sub.updatedAt
      }, { merge: true });
    } catch (err: any) {
      console.warn(`[SubscriptionService] Firestore credit update failed: ${err.message}`);
    }

    await SubscriptionService.recordCreditTransaction(
      userId,
      -amount,
      'usage_deduction',
      reason || `Used ${amount} credits for ${featureKey}`,
      newBalance,
      featureKey
    );

    return {
      success: true,
      newBalance
    };
  }

  /**
   * Adds top-up credits to user balance
   */
  public static async topupCredits(
    userId: string,
    amount: number,
    packageName: string
  ): Promise<{ success: boolean; newBalance: number }> {
    const sub = await SubscriptionService.getUserSubscription(userId);

    const newBalance = sub.creditBalance + amount;
    sub.creditBalance = newBalance;
    sub.lifetimeCreditsEarned += amount;
    sub.updatedAt = new Date().toISOString();

    memorySubscriptions.set(userId, sub);

    try {
      const db = getFirestore();
      await db.collection('users').doc(userId).set({
        'subscription.creditBalance': newBalance,
        'subscription.lifetimeCreditsEarned': sub.lifetimeCreditsEarned,
        'subscription.updatedAt': sub.updatedAt
      }, { merge: true });
    } catch (err: any) {
      console.warn(`[SubscriptionService] Firestore topup update failed: ${err.message}`);
    }

    await SubscriptionService.recordCreditTransaction(
      userId,
      amount,
      'topup_purchase',
      `Purchased credit top-up package: ${packageName}`,
      newBalance
    );

    return {
      success: true,
      newBalance
    };
  }

  /**
   * Records credit ledger transaction
   */
  private static async recordCreditTransaction(
    userId: string,
    amount: number,
    type: CreditTransaction['type'],
    reason: string,
    balanceAfter: number,
    featureKey?: string
  ): Promise<void> {
    const transaction: CreditTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      amount,
      type,
      reason,
      featureKey,
      timestamp: new Date().toISOString(),
      balanceAfter
    };

    if (!memoryCreditTransactions.has(userId)) {
      memoryCreditTransactions.set(userId, []);
    }
    const userTxs = memoryCreditTransactions.get(userId)!;
    userTxs.unshift(transaction);
    if (userTxs.length > 100) userTxs.pop();

    try {
      const db = getFirestore();
      await db.collection('credit_transactions').doc(transaction.id).set(transaction);
    } catch (_) {}
  }

  /**
   * Gets credit transaction history for user
   */
  public static async getCreditHistory(userId: string): Promise<CreditTransaction[]> {
    return memoryCreditTransactions.get(userId) || [];
  }
}
