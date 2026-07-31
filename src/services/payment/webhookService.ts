import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { SubscriptionService } from './subscriptionService';
import { CreditService } from '../credits/creditService';
import { SubscriptionTier, SubscriptionStatus } from './IPaymentProvider';

// Set to track processed event IDs for idempotency
const processedEventIds = new Set<string>();

export interface WebhookEventPayload {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
      plan_id?: string;
      billing_cycle?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id?: number;
      status?: string;
      user_name?: string;
      user_email?: string;
      renews_at?: string;
      ends_at?: string;
      created_at?: string;
      total?: number;
      custom_data?: {
        user_id?: string;
        plan_id?: string;
      };
    };
  };
}

export class WebhookService {
  /**
   * Verifies Lemon Squeezy HMAC SHA256 signature
   */
  public static verifySignature(rawBody: string | Buffer, signatureHeader?: string): boolean {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    // If secret is not configured in environment, permit sandbox signature verification
    if (!secret) {
      console.warn('[WebhookService] LEMON_SQUEEZY_WEBHOOK_SECRET not set. Signature validation running in sandbox pass-through mode.');
      return true;
    }

    if (!signatureHeader) {
      console.error('[WebhookService] Missing x-signature header');
      return false;
    }

    try {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signature = Buffer.from(signatureHeader, 'utf8');

      return crypto.timingSafeEqual(digest, signature);
    } catch (err: any) {
      console.error(`[WebhookService] Signature verification exception: ${err.message}`);
      return false;
    }
  }

  /**
   * Main webhook payload execution engine with idempotency check
   */
  public static async processLemonSqueezyEvent(
    rawBody: string | Buffer,
    headers: Record<string, any>
  ): Promise<{
    success: boolean;
    eventId?: string;
    eventName?: string;
    userId?: string;
    planId?: string;
    message: string;
    duplicate?: boolean;
  }> {
    const signature = (headers['x-signature'] as string) || (headers['X-Signature'] as string);

    // 1. Verify HMAC Signature
    if (!WebhookService.verifySignature(rawBody, signature)) {
      return {
        success: false,
        message: 'Invalid webhook signature. Request rejected.'
      };
    }

    let payload: WebhookEventPayload;
    try {
      const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');
      payload = JSON.parse(bodyStr);
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to parse JSON body: ${err.message}`
      };
    }

    const eventName = headers['x-event-name'] || payload.meta?.event_name || 'unknown';
    const eventId = payload.data?.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // 2. Idempotency Check
    if (processedEventIds.has(eventId)) {
      console.log(`[WebhookService] Duplicate event ${eventId} ignored.`);
      return {
        success: true,
        eventId,
        eventName,
        message: 'Duplicate event already processed.',
        duplicate: true
      };
    }

    // Resolve User ID and Plan ID
    const customData = payload.meta?.custom_data || payload.data?.attributes?.custom_data || {};
    const userId = customData.user_id || 'guest-sartorialist-user-100';
    const planId: SubscriptionTier = (customData.plan_id || 'PREMIUM').toUpperCase() as SubscriptionTier;

    console.log(`[WebhookService] Processing Verified Event: '${eventName}' (ID: ${eventId}) for User: ${userId}, Plan: ${planId}`);

    // Mark event as processed
    processedEventIds.add(eventId);
    if (processedEventIds.size > 500) {
      const oldest = Array.from(processedEventIds)[0];
      processedEventIds.delete(oldest);
    }

    // 3. Handle specific subscription lifecycle events
    let resultMessage = '';

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_payment_success':
      case 'payment_success': {
        const lsStatus = payload.data?.attributes?.status || 'active';
        const mappedStatus: SubscriptionStatus = lsStatus === 'active' ? 'active' : 'active';

        // Update User Subscription in Firestore & Memory
        await SubscriptionService.updateUserSubscription(userId, {
          planId,
          status: mappedStatus,
          provider: 'lemonsqueezy',
          subscriptionId: payload.data?.id || `sub_ls_${userId}`,
          customerId: String(payload.data?.attributes?.customer_id || `cust_ls_${userId}`),
          endDate: payload.data?.attributes?.renews_at || new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
          renewalDate: payload.data?.attributes?.renews_at || new Date(Date.now() + 30 * 86400 * 1000).toISOString()
        });

        // Trigger Automated AI Credit Grant for the activated plan
        const newCreditBalance = await CreditService.grantMonthlyPlanCredits(userId, planId);

        resultMessage = `Subscription '${eventName}' active. Allocated monthly credits for plan ${planId}.`;
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'payment_failed': {
        const isCancelled = eventName.includes('cancelled') || eventName.includes('expired');
        const nextStatus: SubscriptionStatus = eventName.includes('failed') ? 'past_due' : 'canceled';
        const nextPlan: SubscriptionTier = isCancelled ? 'FREE' : planId;

        await SubscriptionService.updateUserSubscription(userId, {
          planId: nextPlan,
          status: nextStatus,
          cancelAtPeriodEnd: isCancelled
        });

        // Reset user credits to FREE tier if subscription expired or cancelled
        if (isCancelled) {
          await CreditService.grantMonthlyPlanCredits(userId, 'FREE');
        }

        resultMessage = `Subscription status updated to '${nextStatus}'. Reverted plan to ${nextPlan}.`;
        break;
      }

      case 'order_created': {
        const total = payload.data?.attributes?.total || 0;
        let creditsAdded = 1000;
        if (total >= 5000) creditsAdded = 7500;
        else if (total >= 2500) creditsAdded = 3000;

        await SubscriptionService.topupCredits(userId, creditsAdded, `Lemon Squeezy Order Topup (${total} cents)`);
        resultMessage = `Order processed. Added ${creditsAdded} top-up credits to user ${userId}.`;
        break;
      }

      default:
        resultMessage = `Event '${eventName}' acknowledged.`;
        break;
    }

    // Persist event audit trail to Firestore
    try {
      const db = getFirestore();
      await db.collection('webhookEvents').doc(eventId).set({
        eventId,
        eventName,
        userId,
        planId,
        timestamp: new Date().toISOString(),
        payloadSummary: {
          storeId: payload.data?.attributes?.store_id,
          customerId: payload.data?.attributes?.customer_id,
          status: payload.data?.attributes?.status
        }
      });
    } catch (_) {}

    return {
      success: true,
      eventId,
      eventName,
      userId,
      planId,
      message: resultMessage
    };
  }
}
