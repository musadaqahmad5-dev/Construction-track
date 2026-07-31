import { getFirestore } from 'firebase-admin/firestore';
import { UserCreditBalance, CreditValidationResult, AIUsageRecord, CreditType } from './types';
import { PlanService } from './planService';
import { LimitService } from './limitService';
import { UsageService } from './usageService';

// Memory store for user credit balances when Firestore is offline/mock mode
const memoryUserCredits = new Map<string, UserCreditBalance>();

export class CreditService {
  /**
   * Retrieves user credit balance across resource pools (image, video, tryOn, premium)
   */
  public static async getUserCreditBalance(userId: string, planTier: string = 'FREE'): Promise<UserCreditBalance> {
    const cleanUserId = userId || 'guest-sartorialist-user-100';

    try {
      const db = getFirestore();
      const userDoc = await db.collection('users').doc(cleanUserId).get();

      if (userDoc.exists) {
        const data = userDoc.data() || {};
        const credits = data.credits || {};

        if (typeof credits.imageCredits === 'number') {
          return {
            imageCredits: credits.imageCredits,
            videoCredits: credits.videoCredits ?? 10,
            tryOnCredits: credits.tryOnCredits ?? 30,
            premiumCredits: credits.premiumCredits ?? 10,
            lastUpdated: credits.lastUpdated || new Date().toISOString()
          };
        }
      }
    } catch (err: any) {
      console.info(`[CreditService] Firestore read offline/unreachable. Using in-memory credits.`);
    }

    if (!memoryUserCredits.has(cleanUserId)) {
      const planConfig = PlanService.getPlanConfig(planTier);
      const defaultBalance: UserCreditBalance = {
        imageCredits: planConfig.monthlyImageCredits,
        videoCredits: planConfig.monthlyVideoCredits,
        tryOnCredits: planConfig.monthlyTryOnCredits,
        premiumCredits: planConfig.monthlyPremiumCredits,
        lastUpdated: new Date().toISOString()
      };
      memoryUserCredits.set(cleanUserId, defaultBalance);
    }

    return memoryUserCredits.get(cleanUserId)!;
  }

  /**
   * Validates if user has sufficient credits and meets generation rate/concurrency limits
   */
  public static async validateCredits(
    userId: string,
    planTier: string,
    featureType: string,
    requestType: string = 'standard_2k'
  ): Promise<CreditValidationResult> {
    const costRule = PlanService.getCostRule(featureType, requestType);
    const requiredCredits = costRule.baseCost;
    const creditType = costRule.creditType;

    // 1. Check rate limits & daily caps
    const limitCheck = LimitService.checkLimits(userId, planTier, featureType);
    if (!limitCheck.allowed) {
      return {
        valid: false,
        userCredits: 0,
        requiredCredits,
        creditType,
        planTier,
        reason: limitCheck.reason
      };
    }

    // 2. Check resource credit balance
    const balance = await CreditService.getUserCreditBalance(userId, planTier);
    let availableCredits = balance.imageCredits;
    if (creditType === 'video') availableCredits = balance.videoCredits;
    else if (creditType === 'tryOn') availableCredits = balance.tryOnCredits;
    else if (creditType === 'premium') availableCredits = balance.premiumCredits;

    if (availableCredits < requiredCredits) {
      return {
        valid: false,
        userCredits: availableCredits,
        requiredCredits,
        creditType,
        planTier,
        reason: `Insufficient ${creditType.toUpperCase()} credits. Required: ${requiredCredits}, Available: ${availableCredits}. Top up or upgrade to ${planTier === 'FREE' ? 'PREMIUM' : 'CREATOR_PRO'}.`
      };
    }

    const reserveToken = `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      valid: true,
      userCredits: availableCredits,
      requiredCredits,
      creditType,
      planTier,
      reserveToken
    };
  }

  /**
   * Deducts credits, logs usage history, and acquires concurrency lock
   */
  public static async reserveAndDeductCredits(
    userId: string,
    planTier: string,
    featureType: string,
    requestType: string = 'standard_2k',
    metadata?: Record<string, any>
  ): Promise<{
    success: boolean;
    jobId?: string;
    usageRecordId?: string;
    newBalance?: number;
    error?: string;
  }> {
    const validation = await CreditService.validateCredits(userId, planTier, featureType, requestType);
    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    const costRule = PlanService.getCostRule(featureType, requestType);
    const balance = await CreditService.getUserCreditBalance(userId, planTier);
    const creditType = costRule.creditType;
    const deduction = costRule.baseCost;

    // Deduct from correct pool
    if (creditType === 'image') balance.imageCredits = Math.max(0, balance.imageCredits - deduction);
    else if (creditType === 'video') balance.videoCredits = Math.max(0, balance.videoCredits - deduction);
    else if (creditType === 'tryOn') balance.tryOnCredits = Math.max(0, balance.tryOnCredits - deduction);
    else if (creditType === 'premium') balance.premiumCredits = Math.max(0, balance.premiumCredits - deduction);

    balance.lastUpdated = new Date().toISOString();
    memoryUserCredits.set(userId, balance);

    // Save balance update to Firestore
    try {
      const db = getFirestore();
      await db.collection('users').doc(userId).set({ credits: balance }, { merge: true });
    } catch (err: any) {
      console.warn(`[CreditService] Firestore credit update error: ${err.message}`);
    }

    // Acquire concurrency lock & log usage history
    const jobId = LimitService.acquireLock(userId, featureType);
    const usageRecord = await UsageService.logUsage({
      userId,
      featureType,
      creditType,
      creditsUsed: deduction,
      requestType,
      metadata
    });

    return {
      success: true,
      jobId,
      usageRecordId: usageRecord.id,
      newBalance: balance.imageCredits
    };
  }

  /**
   * Refunds credits to user balance if AI generation fails or is cancelled
   */
  public static async refundCredits(
    userId: string,
    usageRecordId: string,
    refundReason: string,
    planTier: string = 'FREE'
  ): Promise<{ success: boolean; refundedCredits?: number }> {
    const refundRes = await UsageService.refundUsage(usageRecordId, refundReason);
    if (!refundRes.success || !refundRes.record) {
      return { success: false };
    }

    const record = refundRes.record;
    const balance = await CreditService.getUserCreditBalance(userId, planTier);

    if (record.creditType === 'image') balance.imageCredits += record.creditsUsed;
    else if (record.creditType === 'video') balance.videoCredits += record.creditsUsed;
    else if (record.creditType === 'tryOn') balance.tryOnCredits += record.creditsUsed;
    else if (record.creditType === 'premium') balance.premiumCredits += record.creditsUsed;

    balance.lastUpdated = new Date().toISOString();
    memoryUserCredits.set(userId, balance);

    try {
      const db = getFirestore();
      await db.collection('users').doc(userId).set({ credits: balance }, { merge: true });
    } catch (_) {}

    return {
      success: true,
      refundedCredits: record.creditsUsed
    };
  }

  /**
   * Grants or resets monthly credits based on subscription plan
   */
  public static async grantMonthlyPlanCredits(
    userId: string,
    planTier: string
  ): Promise<UserCreditBalance> {
    const planConfig = PlanService.getPlanConfig(planTier);
    const newBalance: UserCreditBalance = {
      imageCredits: planConfig.monthlyImageCredits,
      videoCredits: planConfig.monthlyVideoCredits,
      tryOnCredits: planConfig.monthlyTryOnCredits,
      premiumCredits: planConfig.monthlyPremiumCredits,
      lastUpdated: new Date().toISOString()
    };

    memoryUserCredits.set(userId, newBalance);

    try {
      const db = getFirestore();
      await db.collection('users').doc(userId).set({ credits: newBalance }, { merge: true });
    } catch (_) {}

    return newBalance;
  }

  /**
   * Pipeline Integration Wrapper: Safely wraps AI generation execution with credit validation, deduction, and automatic refund on error.
   */
  public static async executeWithCreditGuard<T>(
    params: {
      userId: string;
      planTier: string;
      featureType: string;
      requestType?: string;
      metadata?: Record<string, any>;
    },
    aiFn: () => Promise<T>
  ): Promise<{ success: boolean; data?: T; error?: string; creditsDeducted?: number }> {
    const startTime = Date.now();
    const reservation = await CreditService.reserveAndDeductCredits(
      params.userId,
      params.planTier,
      params.featureType,
      params.requestType || 'standard_2k',
      params.metadata
    );

    if (!reservation.success || !reservation.usageRecordId || !reservation.jobId) {
      return { success: false, error: reservation.error || 'Credit deduction failed' };
    }

    try {
      // Execute the actual AI model generation function
      const result = await aiFn();

      // Release lock & mark usage as success
      LimitService.releaseLock(params.userId, reservation.jobId);
      await UsageService.updateUsageStatus(reservation.usageRecordId, 'success', {
        executionTimeMs: Date.now() - startTime
      });

      return {
        success: true,
        data: result
      };
    } catch (aiError: any) {
      // Release lock, mark failed & issue automatic credit refund
      LimitService.releaseLock(params.userId, reservation.jobId);
      const errorMsg = aiError.message || 'AI Generation failed execution';

      await CreditService.refundCredits(
        params.userId,
        reservation.usageRecordId,
        `AI Execution Error: ${errorMsg}`,
        params.planTier
      );

      return {
        success: false,
        error: `AI Generation Error: ${errorMsg}. Your credits have been automatically refunded.`
      };
    }
  }
}
