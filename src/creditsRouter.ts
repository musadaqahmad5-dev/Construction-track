import express, { Request, Response } from 'express';
import { CreditService } from './services/credits/creditService';
import { UsageService } from './services/credits/usageService';
import { LimitService } from './services/credits/limitService';
import { PlanService } from './services/credits/planService';

const router = express.Router();

function getUserIdFromRequest(req: Request): string {
  return (req as any).user?.uid || (req.headers['x-user-id'] as string) || 'guest-sartorialist-user-100';
}

function getUserPlanFromRequest(req: Request): string {
  return (req.headers['x-user-plan'] as string) || (req.query.planTier as string) || 'FREE';
}

/**
 * 1. GET /api/credits/status or /api/status or /api/credits/balance
 * Returns complete AI credit balance, limits, and plan details
 */
router.get(['/credits/status', '/status', '/credits/balance', '/balance'], async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const planTier = getUserPlanFromRequest(req);

    const balance = await CreditService.getUserCreditBalance(userId, planTier);
    const limitStats = LimitService.getUserLimitStats(userId, planTier);
    const planConfig = PlanService.getPlanConfig(planTier);
    const summary = await UsageService.getUsageSummary(userId);

    res.json({
      success: true,
      data: {
        userId,
        planTier,
        credits: balance,
        limits: limitStats,
        planConfig,
        summary
      }
    });
  } catch (err: any) {
    console.error(`[CreditsRouter] Error fetching status: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve AI credit status',
      details: err.message
    });
  }
});

/**
 * 2. GET /api/usage/history or /api/credits/history or /api/history
 * Returns user AI generation history and metrics
 */
router.get(['/usage/history', '/credits/history', '/history', '/usage'], async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const limit = parseInt((req.query.limit as string) || '50', 10);

    const history = await UsageService.getUsageHistory(userId, limit);
    const summary = await UsageService.getUsageSummary(userId);

    res.json({
      success: true,
      data: {
        history,
        summary
      }
    });
  } catch (err: any) {
    console.error(`[CreditsRouter] Error fetching usage history: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve usage history',
      details: err.message
    });
  }
});

/**
 * 3. POST /api/credits/validate
 * Validates if user has available credits and generation capacity
 */
router.post(['/credits/validate', '/validate'], async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const planTier = req.body.planTier || getUserPlanFromRequest(req);
    const { featureType, requestType = 'standard_2k' } = req.body || {};

    if (!featureType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: featureType'
      });
    }

    const validation = await CreditService.validateCredits(userId, planTier, featureType, requestType);

    res.json({
      success: true,
      data: validation
    });
  } catch (err: any) {
    console.error(`[CreditsRouter] Error validating credits: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Credit validation check failed',
      details: err.message
    });
  }
});

/**
 * 4. POST /api/credits/deduct
 * Deducts credits, acquires lock & logs usage before AI processing
 */
router.post(['/credits/deduct', '/deduct'], async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const planTier = req.body.planTier || getUserPlanFromRequest(req);
    const { featureType, requestType = 'standard_2k', metadata } = req.body || {};

    if (!featureType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: featureType'
      });
    }

    const result = await CreditService.reserveAndDeductCredits(
      userId,
      planTier,
      featureType,
      requestType,
      metadata
    );

    if (!result.success) {
      return res.status(402).json({
        success: false,
        error: result.error || 'Insufficient credits or generation limits exceeded'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    console.error(`[CreditsRouter] Error deducting credits: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Credit deduction failed',
      details: err.message
    });
  }
});

/**
 * 5. POST /api/credits/refund
 * Refunds credits if AI generation fails or is cancelled
 */
router.post(['/credits/refund', '/refund'], async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const planTier = req.body.planTier || getUserPlanFromRequest(req);
    const { usageRecordId, reason = 'Generation failed' } = req.body || {};

    if (!usageRecordId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: usageRecordId'
      });
    }

    const result = await CreditService.refundCredits(userId, usageRecordId, reason, planTier);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Failed to process credit refund. Record not found or already refunded.'
      });
    }

    res.json({
      success: true,
      message: 'Credits refunded successfully',
      data: result
    });
  } catch (err: any) {
    console.error(`[CreditsRouter] Error refunding credits: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Credit refund failed',
      details: err.message
    });
  }
});

/**
 * 6. POST /api/credits/replenish or /api/credits/topup
 * System endpoint to grant plan monthly credits or top-up bonuses
 */
router.post(['/credits/replenish', '/replenish', '/credits/topup', '/topup'], async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { planTier = 'PREMIUM', action = 'grant_monthly' } = req.body || {};

    if (action === 'grant_monthly') {
      const balance = await CreditService.grantMonthlyPlanCredits(userId, planTier);
      return res.json({
        success: true,
        message: `Monthly credits granted for plan ${planTier}`,
        data: { credits: balance }
      });
    }

    res.status(400).json({
      success: false,
      error: 'Unsupported replenish action'
    });
  } catch (err: any) {
    console.error(`[CreditsRouter] Error replenishing credits: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Replenishment failed',
      details: err.message
    });
  }
});

export default router;
