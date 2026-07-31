import express, { Request, Response } from 'express';
import { PaymentService } from './services/payment/paymentService';
import { SubscriptionService } from './services/payment/subscriptionService';
import { FeatureAccessService } from './services/payment/featureAccessService';
import { WebhookService } from './services/payment/webhookService';
import { PlanService } from './services/payment/planService';
import { SubscriptionTier } from './services/payment/IPaymentProvider';
import { FeatureKey } from './services/payment/types';

const router = express.Router();

/**
 * Helper to resolve request userId from auth context or request headers
 */
function getUserIdFromRequest(req: Request): string {
  return (req as any).user?.uid || (req.headers['x-user-id'] as string) || 'guest-sartorialist-user-100';
}

function getUserEmailFromRequest(req: Request): string {
  return (req as any).user?.email || (req.headers['x-user-email'] as string) || 'sartorialist@lookvision.ai';
}

// 1. GET /api/subscription/status
router.get('/subscription/status', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const statusData = await PaymentService.getSubscriptionStatus(userId);
    res.json({
      success: true,
      data: statusData
    });
  } catch (err: any) {
    console.error(`[PaymentRouter] Error fetching status: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription status',
      details: err.message
    });
  }
});

// 2. POST /api/subscription/create
router.post('/subscription/create', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const userEmail = getUserEmailFromRequest(req);
    const { planId, billingCycle = 'monthly', redirectUrl, providerId = 'lemonsqueezy' } = req.body || {};

    if (!planId || !['FREE', 'PREMIUM', 'CREATOR_PRO', 'ENTERPRISE'].includes(planId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid planId. Must be one of: FREE, PREMIUM, CREATOR_PRO, ENTERPRISE'
      });
    }

    const checkoutResult = await PaymentService.createCheckout(
      {
        userId,
        userEmail,
        planId: planId as SubscriptionTier,
        billingCycle,
        redirectUrl
      },
      providerId
    );

    res.json({
      success: true,
      data: checkoutResult
    });
  } catch (err: any) {
    console.error(`[PaymentRouter] Error creating checkout: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to create subscription checkout',
      details: err.message
    });
  }
});

// 3. POST /api/subscription/upgrade (Direct tier activation)
router.post('/subscription/upgrade', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { planId } = req.body || {};

    if (!planId || !['FREE', 'PREMIUM', 'CREATOR_PRO', 'ENTERPRISE'].includes(planId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid planId provided'
      });
    }

    const updatedSub = await PaymentService.changeSubscriptionPlan(userId, planId as SubscriptionTier);
    res.json({
      success: true,
      data: updatedSub,
      message: `Subscription plan upgraded to ${planId}`
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 4. POST /api/subscription/cancel
router.post('/subscription/cancel', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const currentSub = await SubscriptionService.getUserSubscription(userId);

    const updatedSub = await SubscriptionService.updateUserSubscription(userId, {
      planId: currentSub.planId,
      cancelAtPeriodEnd: true,
      status: 'canceled'
    });

    res.json({
      success: true,
      data: updatedSub,
      message: 'Subscription marked to cancel at end of current billing period'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 5. GET /api/features/access
router.get('/features/access', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const featureKey = req.query.featureKey as FeatureKey;

    if (!featureKey) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter featureKey is required'
      });
    }

    const accessResult = await FeatureAccessService.checkFeatureAccess(userId, featureKey);
    res.json({
      success: true,
      data: accessResult
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 6. POST /api/credits/deduct
router.post('/credits/deduct', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { amount = 10, featureKey = 'AI_IMAGE_GEN', reason } = req.body || {};

    const result = await PaymentService.deductCredits(userId, Number(amount), featureKey, reason);

    if (!result.success) {
      return res.status(402).json({
        success: false,
        error: result.error,
        remainingBalance: result.newBalance
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 7. POST /api/credits/topup
router.post('/credits/topup', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { packageId = 'standard' } = req.body || {};

    let amount = 1000;
    let packageName = 'Standard 1,000 AI Credits Top-Up ($10)';

    if (packageId === 'pro') {
      amount = 3000;
      packageName = 'Pro 3,000 AI Credits Top-Up ($25)';
    } else if (packageId === 'ultra') {
      amount = 7500;
      packageName = 'Ultra 7,500 AI Credits Top-Up ($50)';
    }

    const result = await SubscriptionService.topupCredits(userId, amount, packageName);

    res.json({
      success: true,
      data: result,
      message: `Successfully credited ${amount} AI fashion credits to balance.`
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 8. GET /api/credits/history
router.get('/credits/history', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const history = await SubscriptionService.getCreditHistory(userId);
    res.json({
      success: true,
      data: history
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 9. GET /api/plans
router.get('/plans', async (_req: Request, res: Response) => {
  try {
    const plans = PlanService.getAllPlans();
    const definitions = PlanService.getPlanDefinitions();
    res.json({
      success: true,
      data: {
        plans,
        definitions
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription plans',
      details: err.message
    });
  }
});

// 10. POST /api/payment/webhook
router.post('/payment/webhook', async (req: Request, res: Response) => {
  try {
    const rawBody = (req as any).rawBody || req.body;
    const result = await WebhookService.processLemonSqueezyEvent(rawBody, req.headers);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err: any) {
    console.error(`[Lemon Squeezy Webhook Error] ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
      details: err.message
    });
  }
});

// 11. POST /api/webhooks/payment (Legacy alias)
router.post('/webhooks/payment', async (req: Request, res: Response) => {
  try {
    const providerId = (req.query.provider as string) || 'lemonsqueezy';
    const rawBody = (req as any).rawBody || req.body;
    const result = await PaymentService.handleWebhook(rawBody, req.headers, providerId);

    res.json({
      received: true,
      result
    });
  } catch (err: any) {
    console.error(`[Payment Webhook Error] ${err.message}`);
    res.status(500).json({
      error: 'Webhook processing failed',
      details: err.message
    });
  }
});

// 12. POST /api/subscription/sync
router.post('/subscription/sync', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const sub = await SubscriptionService.getUserSubscription(userId);
    res.json({
      success: true,
      data: sub,
      message: 'Subscription state synchronized'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
