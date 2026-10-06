/**
 * EAOS Look Vision AI Fashion OS - Lemon Squeezy Payment Gateway & Subscription Controller
 * Path: packages/platform-services/src/LemonSqueezyWebhookController.ts
 * Subsystem: Webhook Signature Verification, Cloud PostgreSQL Billing Sync & Firestore Multi-Tenant State Alignment
 */

import crypto from 'crypto';
import { Request, Response } from 'express';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// ============================================================================
// STRICT DOMAIN CONTRACTS & TYPE DEFINITIONS
// ============================================================================

export type LemonSqueezyEventName =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_resumed'
  | 'subscription_expired'
  | 'subscription_paused';

export interface LemonSqueezyCustomData {
  userId?: string;
  tenantId?: string;
  [key: string]: unknown;
}

export interface LemonSqueezySubscriptionAttributes {
  store_id?: number;
  customer_id?: number;
  order_id?: number;
  product_id?: number;
  variant_id?: number;
  product_name?: string;
  variant_name: string;
  user_name?: string;
  user_email?: string;
  status?: string;
  status_formatted?: string;
  card_brand?: string;
  card_last_four?: string;
  pause?: unknown;
  cancelled?: boolean;
  trial_ends_at?: string | null;
  billing_anchor?: number;
  renews_at?: string;
  ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface LemonSqueezyPayload {
  meta: {
    event_name: LemonSqueezyEventName;
    custom_data?: LemonSqueezyCustomData;
  };
  data: {
    id: string;
    type?: string;
    attributes: LemonSqueezySubscriptionAttributes;
    relationships?: Record<string, unknown>;
  };
}

export interface DatabasePoolClient {
  query: (sql: string, params?: unknown[]) => Promise<{ rowCount?: number; rows?: unknown[] }>;
  release?: () => void;
}

export interface DatabasePool {
  query: (sql: string, params?: unknown[]) => Promise<{ rowCount?: number; rows?: unknown[] }>;
  connect?: () => Promise<DatabasePoolClient>;
}

export interface LemonSqueezyWebhookControllerOptions {
  webhookSecret?: string;
  dbPool?: DatabasePool;
  firestoreInstance?: any;
}

export interface TierQuotaResolution {
  planTierString: string;
  requestLimitMax: number;
}

// ============================================================================
// LEMON SQUEEZY WEBHOOK CONTROLLER IMPLEMENTATION
// ============================================================================

export class LemonSqueezyWebhookController {
  private readonly webhookSecret: string | null;
  private readonly dbPool: DatabasePool | null;
  private readonly customFirestore: any;

  constructor(options?: LemonSqueezyWebhookControllerOptions) {
    this.webhookSecret =
      options?.webhookSecret || process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || null;
    this.dbPool = options?.dbPool || null;
    this.customFirestore = options?.firestoreInstance || null;
  }

  /**
   * Resolves the configured Lemon Squeezy Webhook Secret
   */
  private getWebhookSecret(): string {
    const secret = this.webhookSecret || process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error(
        '[LEMON SQUEEZY ERROR] LEMON_SQUEEZY_WEBHOOK_SECRET environment variable is required to cryptographically verify incoming webhook payloads.'
      );
    }
    return secret;
  }

  /**
   * Generates or extracts active correlation trace ID
   */
  private extractTraceId(req: Request): string {
    const headerTrace = req.headers['x-trace-id'];
    if (typeof headerTrace === 'string' && headerTrace.trim()) {
      return headerTrace.trim();
    }
    return `trc_ls_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Timing-safe cryptographic HMAC-SHA256 signature verification
   */
  public verifySignature(rawPayload: string | Buffer, signatureHeader: string): boolean {
    if (!rawPayload || !signatureHeader) {
      return false;
    }

    try {
      const secret = this.getWebhookSecret();
      const rawString = typeof rawPayload === 'string' ? rawPayload : rawPayload.toString('utf8');

      const hmac = crypto.createHmac('sha256', secret);
      const computedDigest = hmac.update(rawString).digest('hex');

      const expectedBuffer = Buffer.from(computedDigest, 'hex');
      const receivedBuffer = Buffer.from(signatureHeader.trim(), 'hex');

      if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    } catch (cryptoErr: unknown) {
      const errorMsg = cryptoErr instanceof Error ? cryptoErr.message : String(cryptoErr);
      console.error(`[LEMON SQUEEZY SECURITY ALERT] Signature verification error: ${errorMsg}`);
      return false;
    }
  }

  /**
   * Maps subscription variant name to canonical platform quotas and tier strings
   */
  private resolveTierQuotas(variantName: string): TierQuotaResolution {
    const normalized = (variantName || '').toLowerCase().trim();

    if (
      normalized.includes('enterprise') ||
      normalized.includes('atelier') ||
      normalized.includes('couture-atelier')
    ) {
      return {
        planTierString: 'atelier-enterprise',
        requestLimitMax: 10000
      };
    }

    if (
      normalized.includes('pro') ||
      normalized.includes('haute-couture') ||
      normalized.includes('premium')
    ) {
      return {
        planTierString: 'haute-couture-pro',
        requestLimitMax: 300
      };
    }

    if (normalized.includes('starter') || normalized.includes('pret-a-porter')) {
      return {
        planTierString: 'pret-a-porter-starter',
        requestLimitMax: 75
      };
    }

    // Default paid upgrade to Standard Pro Tier
    return {
      planTierString: 'haute-couture-pro',
      requestLimitMax: 300
    };
  }

  /**
   * Executes a write-through SQL transaction on eaos.billing_counters in the PostgreSQL cluster
   */
  private async updatePostgresBillingCounters(
    userId: string,
    activePlan: string,
    requestLimitMax: number,
    traceId: string
  ): Promise<void> {
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

    const params = [userId, activePlan, requestLimitMax];

    if (this.dbPool) {
      await this.dbPool.query(upsertSql, params);
      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'POSTGRES_BILLING_COUNTER_SYNCED',
          'x-trace-id': traceId,
          userId,
          activePlan,
          requestLimitMax,
          timestamp: new Date().toISOString()
        })
      );
    } else {
      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'POSTGRES_BILLING_COUNTER_IN_MEMORY_FALLBACK',
          'x-trace-id': traceId,
          userId,
          activePlan,
          requestLimitMax,
          timestamp: new Date().toISOString()
        })
      );
    }
  }

  /**
   * Updates multi-tenant real-time document listeners in Cloud Firestore
   */
  private async updateFirestoreUserState(
    userId: string,
    planTier: string,
    status: 'active' | 'cancelled',
    traceId: string
  ): Promise<void> {
    try {
      const db = this.customFirestore || getFirestore();
      const userDocRef = db.collection('users').doc(userId);

      const updateData: Record<string, any> = {
        planTier,
        status,
        updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date().toISOString(),
        lastBillingSyncTraceId: traceId
      };

      await userDocRef.set(updateData, { merge: true });

      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'FIRESTORE_USER_STATE_ALIGNED',
          'x-trace-id': traceId,
          userId,
          planTier,
          status,
          timestamp: new Date().toISOString()
        })
      );
    } catch (firestoreErr: unknown) {
      const errorMsg = firestoreErr instanceof Error ? firestoreErr.message : String(firestoreErr);
      console.warn(
        JSON.stringify({
          level: 'WARN',
          event: 'FIRESTORE_USER_STATE_SYNC_DEGRADED',
          'x-trace-id': traceId,
          userId,
          reason: errorMsg,
          timestamp: new Date().toISOString()
        })
      );
    }
  }

  /**
   * Processes active subscription upgrade/renewal lifecycle events
   */
  private async handleSubscriptionActive(
    payload: LemonSqueezyPayload,
    userId: string,
    traceId: string
  ): Promise<void> {
    const variantName = payload.data.attributes.variant_name || 'Haute Couture Pro Tier';
    const { planTierString, requestLimitMax } = this.resolveTierQuotas(variantName);

    console.info(
      JSON.stringify({
        level: 'INFO',
        event: 'PROCESSING_SUBSCRIPTION_ACTIVE',
        'x-trace-id': traceId,
        userId,
        variantName,
        resolvedPlan: planTierString,
        requestLimitMax,
        subscriptionId: payload.data.id,
        timestamp: new Date().toISOString()
      })
    );

    // 1. Update PostgreSQL billing counters with quota reset
    await this.updatePostgresBillingCounters(userId, planTierString, requestLimitMax, traceId);

    // 2. Align Cloud Firestore real-time state
    await this.updateFirestoreUserState(userId, variantName, 'active', traceId);
  }

  /**
   * Processes subscription termination and cancellation events
   */
  private async handleSubscriptionCancelled(
    payload: LemonSqueezyPayload,
    userId: string,
    traceId: string
  ): Promise<void> {
    const freePlanTier = 'pret-a-porter-free';
    const freeLimitMax = 15;

    console.warn(
      JSON.stringify({
        level: 'WARN',
        event: 'PROCESSING_SUBSCRIPTION_CANCELLED',
        'x-trace-id': traceId,
        userId,
        subscriptionId: payload.data.id,
        downgradedTo: freePlanTier,
        requestLimitMax: freeLimitMax,
        timestamp: new Date().toISOString()
      })
    );

    // 1. Downgrade PostgreSQL billing counters
    await this.updatePostgresBillingCounters(userId, freePlanTier, freeLimitMax, traceId);

    // 2. Mark Firestore user record as cancelled to block AI generation filters
    await this.updateFirestoreUserState(userId, 'Free Tier', 'cancelled', traceId);
  }

  /**
   * Express Route Handler: Ingests, cryptographically validates, and routes Lemon Squeezy webhooks
   */
  public handleWebhook = async (req: Request, res: Response): Promise<void> => {
    const startTime = performance.now();
    const traceId = this.extractTraceId(req);
    res.setHeader('x-trace-id', traceId);

    // 1. Signature Header Presence Check
    const signatureHeader = (req.headers['x-signature'] || req.headers['X-Signature']) as string;
    if (!signatureHeader || typeof signatureHeader !== 'string') {
      console.warn(
        JSON.stringify({
          level: 'WARN',
          event: 'LEMON_SQUEEZY_MISSING_SIGNATURE_HEADER',
          'x-trace-id': traceId,
          timestamp: new Date().toISOString()
        })
      );
      res.status(401).json({
        error: 'Unauthorized: Missing X-Signature verification header.',
        traceId
      });
      return;
    }

    // 2. Cryptographic Validation
    const rawBody = (req as any).rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    const isSignatureValid = this.verifySignature(rawBody, signatureHeader);

    if (!isSignatureValid) {
      console.error(
        JSON.stringify({
          level: 'SECURITY_ALERT',
          event: 'LEMON_SQUEEZY_INVALID_SIGNATURE',
          'x-trace-id': traceId,
          timestamp: new Date().toISOString()
        })
      );
      res.status(401).json({
        error: 'Unauthorized: Webhook HMAC signature verification failed.',
        traceId
      });
      return;
    }

    // 3. Payload Parsing and Tenant Resolution
    try {
      const payload: LemonSqueezyPayload =
        typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!payload || !payload.meta || !payload.data) {
        res.status(422).json({
          error: 'Unprocessable Entity: Malformed Lemon Squeezy payload structure.',
          traceId
        });
        return;
      }

      const eventName = payload.meta.event_name;
      const userId =
        payload.meta.custom_data?.userId ||
        payload.meta.custom_data?.tenantId ||
        (payload.data.attributes as any)?.user_id ||
        (payload.data.attributes as any)?.custom?.user_id;

      if (!userId || typeof userId !== 'string' || !userId.trim()) {
        console.warn(
          JSON.stringify({
            level: 'WARN',
            event: 'LEMON_SQUEEZY_OMITTED_USER_ID',
            'x-trace-id': traceId,
            eventName,
            subscriptionId: payload.data.id,
            timestamp: new Date().toISOString()
          })
        );
        res.status(200).json({
          received: true,
          status: 'SKIPPED_NO_USER_ID',
          traceId
        });
        return;
      }

      const cleanUserId = userId.trim();

      // 4. Lifecycle Event State Machine Routing
      switch (eventName) {
        case 'subscription_created':
        case 'subscription_updated':
        case 'subscription_resumed': {
          await this.handleSubscriptionActive(payload, cleanUserId, traceId);
          break;
        }

        case 'subscription_cancelled':
        case 'subscription_expired':
        case 'subscription_paused': {
          await this.handleSubscriptionCancelled(payload, cleanUserId, traceId);
          break;
        }

        default:
          console.info(
            JSON.stringify({
              level: 'INFO',
              event: 'LEMON_SQUEEZY_UNHANDLED_EVENT',
              'x-trace-id': traceId,
              eventName,
              timestamp: new Date().toISOString()
            })
          );
          break;
      }

      const latencyMs = (performance.now() - startTime).toFixed(2);
      console.info(
        JSON.stringify({
          level: 'INFO',
          event: 'LEMON_SQUEEZY_WEBHOOK_PROCESSED',
          'x-trace-id': traceId,
          eventName,
          userId: cleanUserId,
          latencyMs,
          timestamp: new Date().toISOString()
        })
      );

      res.status(200).json({
        received: true,
        event: eventName,
        userId: cleanUserId,
        traceId,
        latencyMs
      });
    } catch (processError: unknown) {
      const latencyMs = (performance.now() - startTime).toFixed(2);
      const errMsg = processError instanceof Error ? processError.message : String(processError);

      console.error(
        JSON.stringify({
          level: 'ERROR',
          event: 'LEMON_SQUEEZY_WEBHOOK_FAILED',
          'x-trace-id': traceId,
          error: errMsg,
          latencyMs,
          timestamp: new Date().toISOString()
        })
      );

      // Protect internal database exceptions from leaking to client response
      res.status(500).json({
        error: 'An internal error occurred while processing the billing lifecycle event.',
        traceId
      });
    }
  };
}
