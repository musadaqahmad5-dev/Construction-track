/**
 * EAOS Look Vision AI Fashion OS - Payment Gateway & Subscription Monetization Engine
 * Path: packages/platform-services/src/StripeMonetizationController.ts
 * Subsystem: Stripe Webhook Ingestion, Cryptographic Verification & Billing Counter Synchronization
 */

import Stripe from 'stripe';

export interface StripeWebhookEvent {
  id: string;
  type: string;
  created: number;
  data: {
    object: Record<string, unknown>;
  };
}

export interface UserBillingTierSpec {
  userId: string;
  activePlanString: string;
  requestLimitMax: number;
  cycleResetDate: string | Date;
}

export interface DatabasePoolClient {
  query: (sql: string, params?: unknown[]) => Promise<{ rowCount?: number; rows?: unknown[] }>;
  release?: () => void;
}

export interface DatabasePool {
  query: (sql: string, params?: unknown[]) => Promise<{ rowCount?: number; rows?: unknown[] }>;
  connect?: () => Promise<DatabasePoolClient>;
}

export interface StripeMonetizationControllerOptions {
  stripeApiKey?: string;
  webhookSecret?: string;
  dbPool?: DatabasePool;
}

export class StripeMonetizationController {
  private stripeClient: Stripe | null = null;
  private webhookSecret: string | null = null;
  private dbPool: DatabasePool | null = null;

  constructor(options?: StripeMonetizationControllerOptions) {
    this.webhookSecret = options?.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || null;
    this.dbPool = options?.dbPool || null;

    const apiKey = options?.stripeApiKey || process.env.STRIPE_SECRET_KEY;
    if (apiKey) {
      this.stripeClient = new Stripe(apiKey, {
        apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion
      });
    }
  }

  /**
   * Lazily resolves and returns the initialized Stripe SDK client instance
   */
  private getStripeClient(): Stripe {
    if (!this.stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error(
          '[STRIPE CONTROLLER ERROR] STRIPE_SECRET_KEY environment variable is required to process billing operations.'
        );
      }
      this.stripeClient = new Stripe(key, {
        apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion
      });
    }
    return this.stripeClient;
  }

  /**
   * Resolves the configured Webhook Signing Secret
   */
  private getWebhookSecret(): string {
    const secret = this.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error(
        '[STRIPE CONTROLLER ERROR] STRIPE_WEBHOOK_SECRET environment variable is required to cryptographically verify incoming webhook payloads.'
      );
    }
    return secret;
  }

  /**
   * Maps an incoming plan tier string from checkout metadata to canonical EAOS platform quotas
   */
  private resolveBillingTierSpecs(planTier: string, userId: string): UserBillingTierSpec {
    const normalized = (planTier || '').toLowerCase().trim();

    let activePlanString = 'haute-couture-pro';
    let requestLimitMax = 300;

    switch (normalized) {
      case 'enterprise':
      case 'atelier-enterprise':
      case 'couture-atelier':
        activePlanString = 'atelier-enterprise';
        requestLimitMax = 1500;
        break;
      case 'premium':
      case 'pro':
      case 'haute-couture-pro':
      case 'couture-pro':
        activePlanString = 'haute-couture-pro';
        requestLimitMax = 300;
        break;
      case 'starter':
      case 'pret-a-porter-starter':
        activePlanString = 'pret-a-porter-starter';
        requestLimitMax = 75;
        break;
      case 'free':
      case 'pret-a-porter-free':
      default:
        if (normalized === 'free' || normalized === 'pret-a-porter-free') {
          activePlanString = 'pret-a-porter-free';
          requestLimitMax = 10;
        } else {
          // Default unrecognized paid checkout upgrades to Haute Couture Pro tier
          activePlanString = 'haute-couture-pro';
          requestLimitMax = 300;
        }
        break;
    }

    const cycleReset = new Date();
    cycleReset.setMonth(cycleReset.getMonth() + 1);

    return {
      userId,
      activePlanString,
      requestLimitMax,
      cycleResetDate: cycleReset.toISOString()
    };
  }

  /**
   * Executes an atomic write-through database update on eaos.billing_counters
   */
  private async updateBillingCounterInDb(spec: UserBillingTierSpec): Promise<void> {
    const upsertSql = `
      INSERT INTO eaos.billing_counters (
        user_id,
        active_plan,
        request_count_current,
        request_limit_max,
        cycle_start_date,
        cycle_reset_date
      )
      VALUES (
        $1,
        $2,
        0,
        $3,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP + INTERVAL '1 month'
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        active_plan = EXCLUDED.active_plan,
        request_count_current = 0,
        request_limit_max = EXCLUDED.request_limit_max,
        cycle_start_date = CURRENT_TIMESTAMP,
        cycle_reset_date = CURRENT_TIMESTAMP + INTERVAL '1 month';
    `;

    const params = [
      spec.userId,
      spec.activePlanString,
      spec.requestLimitMax
    ];

    if (this.dbPool) {
      await this.dbPool.query(upsertSql, params);
      console.info(
        `[STRIPE BILLING DB] Synchronized user "${spec.userId}" to plan "${spec.activePlanString}" (Quota: ${spec.requestLimitMax}/mo)`
      );
    } else {
      console.info(
        `[STRIPE BILLING MOCK-DB] Executed write-through transaction for user "${spec.userId}" -> Tier: ${spec.activePlanString}, MaxLimit: ${spec.requestLimitMax}`
      );
    }
  }

  /**
   * Processes the 'checkout.session.completed' lifecycle event
   */
  private async processCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.client_reference_id;
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      throw new Error(
        `[STRIPE CONTROLLER] Invariant violation: Missing or invalid 'client_reference_id' in session '${session.id}'. Skipping tenant state mutation.`
      );
    }

    const metadataPlanTier = (session.metadata?.planTier || session.metadata?.plan || 'premium') as string;
    const tierSpec = this.resolveBillingTierSpecs(metadataPlanTier, userId.trim());

    console.info(
      `[STRIPE CONTROLLER] Processing completed checkout session '${session.id}' for tenant user '${userId}' (Requested Tier: ${metadataPlanTier})`
    );

    await this.updateBillingCounterInDb(tierSpec);
  }

  /**
   * Primary entry point to cryptographically verify and process incoming Stripe webhook events
   */
  public async handleWebhookEvent(rawBody: string, signatureHeader: string): Promise<void> {
    const startTime = performance.now();

    if (!rawBody || typeof rawBody !== 'string') {
      throw new Error('[STRIPE CONTROLLER] Invalid payload: rawBody must be a non-empty string buffer.');
    }

    if (!signatureHeader || typeof signatureHeader !== 'string') {
      throw new Error('[STRIPE CONTROLLER] Invalid request: Missing or malformed Stripe-Signature header.');
    }

    const stripe = this.getStripeClient();
    const webhookSecret = this.getWebhookSecret();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
    } catch (cryptoErr: unknown) {
      const message = cryptoErr instanceof Error ? cryptoErr.message : String(cryptoErr);
      console.error(`[STRIPE SECURITY ALERT] Cryptographic signature verification failed: ${message}`);
      throw new Error(`Webhook Signature Verification Failed: ${message}`);
    }

    console.info(`[STRIPE WEBHOOK RECEIVED] Event ID: ${event.id} | Type: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.processCheckoutSessionCompleted(session);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
          console.warn(
            `[STRIPE SUBSCRIPTION CANCELLED] Subscription '${subscription.id}' terminated for customer '${customerId}'.`
          );
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          console.warn(
            `[STRIPE PAYMENT FAILED] Invoice payment failed for customer '${invoice.customer}'. Amount Due: ${invoice.amount_due}`
          );
          break;
        }

        default:
          console.info(`[STRIPE WEBHOOK UNHANDLED] Event type '${event.type}' ignored.`);
          break;
      }

      const elapsed = (performance.now() - startTime).toFixed(1);
      console.info(`[STRIPE WEBHOOK SUCCESS] Event '${event.id}' (${event.type}) processed in ${elapsed}ms`);
    } catch (processError: unknown) {
      const errorMsg = processError instanceof Error ? processError.message : String(processError);
      console.error(
        `[STRIPE WEBHOOK ERROR] Failure processing event payload '${event.id}' (${event.type}): ${errorMsg}`
      );
      throw processError;
    }
  }
}
