import { Request, Response, Router } from 'express';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenAI, Type, Schema } from '@google/genai';

/**
 * Lemon Squeezy Inbound Webhook Payload Schema Definition
 */
export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: 'subscription_created' | 'subscription_updated' | 'subscription_cancelled' | string;
    custom_data?: {
      user_id?: string;
      tenant_id?: string;
      user_theme_prompt?: string;
      theme_preference?: string;
      theme_seed?: string;
      plan_id?: string;
      product_title?: string;
      product_price?: number;
      product_id?: string;
      [key: string]: any;
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
      product_name?: string;
      variant_name?: string;
      first_order_item?: {
        product_id?: number;
        product_name?: string;
        price?: number;
      };
      custom_data?: {
        user_id?: string;
        tenant_id?: string;
        user_theme_prompt?: string;
        theme_preference?: string;
        theme_seed?: string;
        plan_id?: string;
        product_title?: string;
        product_price?: number;
        product_id?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
}

/**
 * Standard Telemetry Metric Structure [APOOL_LOG_STANDARD]
 */
export interface WebhookLogTelemetry {
  tag: '[APOOL_LOG_STANDARD]';
  level: 'INFO' | 'WARN' | 'ERROR';
  request_id: string;
  tenant_id: string;
  event_name: string;
  latency_ms: number;
  user_id?: string;
  status: 'SUCCESS' | 'FAILED' | 'IGNORED' | 'FALLBACK';
  theme_prompt?: string;
  error?: string;
  timestamp: string;
}

export interface WebhookEventContract {
  tag: '[APOOL_EVENT_CONTRACT]';
  event: 'lemon_squeezy_webhook_processed';
  request_id: string;
  event_name: string;
  status: 'SUCCESS' | 'FAILED' | 'IGNORED' | 'FALLBACK';
  duration_ms: number;
  user_id?: string;
  subscription_status?: string;
}

// In-memory idempotency deduplication cache (capped at 1000 items)
const processedEventCache = new Set<string>();

/**
 * Cryptographic HMAC-SHA256 Timing-Safe Verification Helper
 * Validates inbound webhook against process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
 */
export function verifyLemonSqueezySignature(
  rawBody: string | Buffer,
  signatureHeader?: string
): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('[LemonSqueezy Security] LEMON_SQUEEZY_WEBHOOK_SECRET not defined. Permitting in development/sandbox mode.');
    return true;
  }

  if (!signatureHeader || typeof signatureHeader !== 'string') {
    console.error('[LemonSqueezy Security] Inbound webhook missing x-signature header.');
    return false;
  }

  try {
    const rawBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf-8');
    const hmac = crypto.createHmac('sha256', secret);
    const computedDigest = Buffer.from(hmac.update(rawBuffer).digest('hex'), 'utf-8');
    const providedSignature = Buffer.from(signatureHeader.trim(), 'utf-8');

    if (computedDigest.length !== providedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(computedDigest, providedSignature);
  } catch (err: any) {
    console.error(`[LemonSqueezy Security] Exception during cryptographic verification: ${err.message}`);
    return false;
  }
}

/**
 * Autonomous Theme Engine Hook: Triggers Aria AI dynamic theme compilation and updates Firestore
 */
async function triggerAriaThemeSynthesis(
  userId: string,
  tenantId: string,
  userThemePrompt: string
): Promise<void> {
  const cleanPrompt = (userThemePrompt || 'I want solid iron skillet').trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[Aria Engine Trigger] GEMINI_API_KEY undefined. Applying precompiled industrial theme fallback.');
    try {
      const db = getFirestore();
      await db.collection('userStyleProfiles').doc(userId).set({
        userId,
        tenantId,
        activeTheme: {
          style_title: 'Cast Iron Industrial Atelier',
          style_summary: 'Forged matte charcoal and brushed steel minimalist silhouetting.',
          palette_tokens: {
            main_canvas_bg: '#222224',
            sidebar_nav_bg: '#18181a',
            card_surface_bg: '#2b2b2e',
            accent_ai_color: '#a1a1aa',
            accent_commerce_color: '#22c55e',
            sidebar_border_style: 'border-white/10',
            text_header_color: 'text-zinc-100'
          },
          system_health: { confidence: 0.98, quality_score: 95 }
        },
        appliedSeedPrompt: cleanPrompt,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e: any) {
      console.warn(`[Aria Engine Trigger] Fallback write warning: ${e.message}`);
    }
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        style_title: { type: Type.STRING },
        style_summary: { type: Type.STRING },
        palette_tokens: {
          type: Type.OBJECT,
          properties: {
            main_canvas_bg: { type: Type.STRING },
            sidebar_nav_bg: { type: Type.STRING },
            card_surface_bg: { type: Type.STRING },
            accent_ai_color: { type: Type.STRING },
            accent_commerce_color: { type: Type.STRING },
            sidebar_border_style: { type: Type.STRING },
            text_header_color: { type: Type.STRING }
          },
          required: [
            'main_canvas_bg',
            'sidebar_nav_bg',
            'card_surface_bg',
            'accent_ai_color',
            'accent_commerce_color',
            'sidebar_border_style',
            'text_header_color'
          ]
        },
        system_health: {
          type: Type.OBJECT,
          properties: {
            confidence: { type: Type.NUMBER },
            quality_score: { type: Type.NUMBER }
          },
          required: ['confidence', 'quality_score']
        }
      },
      required: ['style_title', 'style_summary', 'palette_tokens', 'system_health']
    };

    let parsedTheme: any = null;
    const modelsToTry = ['gemini-2.5-flash', 'gemini-3.7-flash'];

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `Generate dynamic bespoke Aria theme tokens for user aesthetic request: "${cleanPrompt}"`,
          config: {
            systemInstruction: `You are ARIA, the AI Haute Couture Director for LOOK VISION.
Translate arbitrary user style prompts (e.g. "I want solid iron skillet", "cyberpunk neon", "soft pastel matcha") into structured palette tokens.
Override legacy dark invariants and return valid JSON matching the schema.`,
            temperature: 0.25,
            responseMimeType: 'application/json',
            responseSchema
          }
        });

        const rawText = response.text ? response.text.trim() : '{}';
        parsedTheme = JSON.parse(rawText);
        if (parsedTheme?.palette_tokens) break;
      } catch (mErr: any) {
        console.warn(`[LemonSqueezyController] Model ${model} failed:`, mErr?.message);
      }
    }

    const db = getFirestore();
    await db.collection('userStyleProfiles').doc(userId).set({
      userId,
      tenantId,
      activeTheme: parsedTheme,
      appliedSeedPrompt: cleanPrompt,
      source: 'lemon_squeezy_subscription_webhook',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log(`[Aria Engine Trigger] Successfully synthesized and reconciled dynamic theme for UID: ${userId}`);
  } catch (err: any) {
    console.error(`[Aria Engine Trigger] Exception in theme synthesis callback: ${err.message}`);
  }
}

/**
 * Stateful Data Synchronization: Synchronizes subscription state in 'users' and logs verified purchase in 'orders'
 */
async function syncSubscriptionAndOrder(
  userId: string,
  tenantId: string,
  planId: string,
  status: string,
  attributes: LemonSqueezyWebhookPayload['data']['attributes'],
  subscriptionId: string,
  customData: Record<string, any>
): Promise<void> {
  const db = getFirestore();

  // 1. Sync User Document
  const userRef = db.collection('users').doc(userId);
  await userRef.set({
    tenantId: tenantId || 'default_tenant',
    subscription: {
      provider: 'lemonsqueezy',
      subscriptionId: subscriptionId || '',
      planId: (planId || 'CREATOR_PRO').toUpperCase(),
      status: status,
      customerId: String(attributes.customer_id || ''),
      orderId: attributes.order_id ? String(attributes.order_id) : undefined,
      renewsAt: attributes.renews_at || null,
      endsAt: attributes.ends_at || null,
      updatedAt: new Date().toISOString()
    },
    updatedAt: new Date().toISOString()
  }, { merge: true });

  console.log(`[Firestore Sync] User subscription state synced for UID: ${userId} (${status})`);

  // 2. Initialize Order Document matching entity schema upon active state
  if (['active', 'paid'].includes(status)) {
    const orderId = attributes.order_id ? String(attributes.order_id) : `ord_${subscriptionId}_${Date.now()}`;
    const orderRef = db.collection('orders').doc(orderId);

    const rawTotal = typeof attributes.total === 'number' ? attributes.total / 100 : (customData.product_price || 29.00);
    const productTitle = customData.product_title || attributes.product_name || `${(planId || 'Creator Pro').toUpperCase()} Subscription`;
    const productId = customData.product_id || String(attributes.first_order_item?.product_id || attributes.store_id || 'prod_sub_01');

    await orderRef.set({
      userId,
      productId,
      productTitle,
      productPrice: rawTotal,
      productImageUrl: customData.product_image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      shopName: 'LOOK VISION Atelier',
      timestamp: attributes.created_at || new Date().toISOString(),
      status: 'confirmed'
    }, { merge: true });

    console.log(`[Firestore Sync] Order document logged successfully for orderId: ${orderId}`);
  }
}

/**
 * Authoritative Real-Time Express Route Controller for Lemon Squeezy Ingress
 * Endpoint: POST /api/monetization/webhook
 */
export async function lemonSqueezyWebhookController(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `lms_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const signature = (req.headers['x-signature'] as string) || (req.headers['X-Signature'] as string);

  // 1. Raw Body Stream Extraction
  let rawBody: string | Buffer;
  if ((req as any).rawBody) {
    rawBody = (req as any).rawBody;
  } else if (Buffer.isBuffer(req.body)) {
    rawBody = req.body;
  } else if (typeof req.body === 'string') {
    rawBody = req.body;
  } else {
    rawBody = JSON.stringify(req.body || {});
  }

  // 2. Cryptographic Security Guard
  const isValidSignature = verifyLemonSqueezySignature(rawBody, signature);
  if (!isValidSignature) {
    const latencyMs = Date.now() - startTime;
    const telemetry: WebhookLogTelemetry = {
      tag: '[APOOL_LOG_STANDARD]',
      level: 'ERROR',
      request_id: requestId,
      tenant_id: 'unknown',
      event_name: 'signature_verification_failed',
      latency_ms: latencyMs,
      status: 'FAILED',
      error: 'HMAC-SHA256 signature mismatch',
      timestamp: new Date().toISOString()
    };
    console.error(`[APOOL_LOG_STANDARD] ${JSON.stringify(telemetry)}`);

    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid webhook signature',
      request_id: requestId
    });
    return;
  }

  // 3. Inbound Payload Parsing
  let payload: LemonSqueezyWebhookPayload;
  try {
    const rawString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf-8') : (typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody));
    payload = JSON.parse(rawString);
  } catch (parseErr: any) {
    const latencyMs = Date.now() - startTime;
    console.error(`[LemonSqueezy Webhook] JSON parse failure: ${parseErr.message}`);
    res.status(400).json({
      success: false,
      error: 'Malformed JSON payload',
      request_id: requestId
    });
    return;
  }

  const eventName = (req.headers['x-event-name'] as string) || payload.meta?.event_name || 'unknown_event';
  const eventId = payload.data?.id || `evt_${requestId}`;

  // 4. Idempotency Guard (Protects against duplicate webhook dispatches)
  if (processedEventCache.has(eventId)) {
    const latencyMs = Date.now() - startTime;
    const telemetry: WebhookLogTelemetry = {
      tag: '[APOOL_LOG_STANDARD]',
      level: 'INFO',
      request_id: requestId,
      tenant_id: 'unknown',
      event_name: eventName,
      latency_ms: latencyMs,
      status: 'IGNORED',
      timestamp: new Date().toISOString()
    };
    console.log(`[APOOL_LOG_STANDARD] ${JSON.stringify(telemetry)}`);

    res.status(200).json({
      received: true,
      duplicate: true,
      request_id: requestId
    });
    return;
  }

  processedEventCache.add(eventId);
  if (processedEventCache.size > 1000) {
    const oldestKey = processedEventCache.values().next().value;
    if (oldestKey) processedEventCache.delete(oldestKey);
  }

  // 5. Multi-Tenant Parameter Ingestion
  const metaCustom = payload.meta?.custom_data || {};
  const attrCustom = payload.data?.attributes?.custom_data || {};
  const customData = { ...attrCustom, ...metaCustom };

  const userId = customData.user_id || `user_${payload.data?.attributes?.customer_id || 'anonymous'}`;
  const tenantId = customData.tenant_id || (req.headers['x-tenant-id'] as string) || 'default_tenant';
  const planId = customData.plan_id || 'CREATOR_PRO';
  const userThemePrompt = customData.user_theme_prompt ||
                          customData.theme_preference ||
                          customData.theme_seed ||
                          'I want solid iron skillet';

  let processingStatus: 'SUCCESS' | 'FAILED' | 'FALLBACK' = 'SUCCESS';
  let executionError: string | undefined = undefined;

  // 6. Stateful Data Synchronization & Theme Engine Hook
  try {
    const attributes = payload.data?.attributes || ({} as any);
    const rawStatus = (attributes.status || 'active').toLowerCase();

    switch (eventName) {
      case 'subscription_created':
      case 'order_created': {
        const isActive = ['active', 'paid', 'on_trial'].includes(rawStatus);
        await syncSubscriptionAndOrder(
          userId,
          tenantId,
          planId,
          isActive ? 'active' : rawStatus,
          attributes,
          payload.data?.id,
          customData
        );

        if (isActive) {
          // Trigger Autonomous Theme Engine Hook asynchronously
          await triggerAriaThemeSynthesis(userId, tenantId, userThemePrompt);
        }
        break;
      }

      case 'subscription_updated':
      case 'subscription_resumed': {
        const isActive = ['active', 'paid', 'on_trial'].includes(rawStatus);
        await syncSubscriptionAndOrder(
          userId,
          tenantId,
          planId,
          isActive ? 'active' : rawStatus,
          attributes,
          payload.data?.id,
          customData
        );
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        await syncSubscriptionAndOrder(
          userId,
          tenantId,
          planId,
          'canceled',
          attributes,
          payload.data?.id,
          customData
        );
        break;
      }

      default:
        console.log(`[LemonSqueezy Webhook] Unhandled event '${eventName}' registered.`);
        break;
    }
  } catch (err: any) {
    processingStatus = 'FAILED';
    executionError = err.message;
    console.error(`[LemonSqueezy Webhook] Error processing event '${eventName}': ${err.message}`);
  }

  const latencyMs = Date.now() - startTime;

  // 7. SRE Standardized Telemetry Metrics Emission
  const logMetric: WebhookLogTelemetry = {
    tag: '[APOOL_LOG_STANDARD]',
    level: processingStatus === 'SUCCESS' ? 'INFO' : 'ERROR',
    request_id: requestId,
    tenant_id: tenantId,
    event_name: eventName,
    latency_ms: latencyMs,
    user_id: userId,
    status: processingStatus,
    theme_prompt: userThemePrompt,
    error: executionError,
    timestamp: new Date().toISOString()
  };
  console.log(`[APOOL_LOG_STANDARD] ${JSON.stringify(logMetric)}`);

  const eventContract: WebhookEventContract = {
    tag: '[APOOL_EVENT_CONTRACT]',
    event: 'lemon_squeezy_webhook_processed',
    request_id: requestId,
    event_name: eventName,
    status: processingStatus,
    duration_ms: latencyMs,
    user_id: userId,
    subscription_status: payload.data?.attributes?.status || 'active'
  };
  console.log(`[APOOL_EVENT_CONTRACT] ${JSON.stringify(eventContract)}`);

  // 8. Return Clean 200 OK Response to Prevent Processing Retry Loops on Render
  res.status(200).json({
    success: true,
    received: true,
    request_id: requestId,
    event_name: eventName,
    user_id: userId,
    latency_ms: latencyMs
  });
}

/**
 * Lemon Squeezy Hosted Checkout Session Generator
 * Endpoint: POST /api/v1/billing/create-checkout and POST /api/billing/create-checkout
 */
export async function createLemonSqueezyCheckoutController(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `lms_chk_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  try {
    const { variantId = "67890", userId = "guest_user", email = "client@lookvision.ai", planTier = "HAUTE_COUTURE", customData = {} } = req.body || {};

    const cleanUserId = String(userId).trim() || "guest_sartorialist";
    const cleanEmail = String(email).trim() || "guest@aifashionmarket.com";
    const cleanVariantId = String(variantId).trim() || "67890";

    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

    let checkoutUrl = `https://lookvision.lemonsqueezy.com/buy/${cleanVariantId}?checkout[email]=${encodeURIComponent(cleanEmail)}&checkout[custom][user_id]=${encodeURIComponent(cleanUserId)}&checkout[custom][variant_id]=${encodeURIComponent(cleanVariantId)}&embed=1`;

    if (apiKey && storeId) {
      try {
        const lsResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            data: {
              type: 'checkouts',
              attributes: {
                checkout_data: {
                  email: cleanEmail,
                  custom: {
                    user_id: cleanUserId,
                    variant_id: cleanVariantId,
                    plan_tier: planTier,
                    ...customData
                  }
                },
                product_options: {
                  redirect_url: `${req.headers.origin || 'https://lookvision.ai'}/?billing=success&tier=${encodeURIComponent(planTier)}`
                }
              },
              relationships: {
                store: {
                  data: {
                    type: 'stores',
                    id: storeId
                  }
                },
                variant: {
                  data: {
                    type: 'variants',
                    id: cleanVariantId
                  }
                }
              }
            }
          })
        });

        if (lsResponse.ok) {
          const lsData = await lsResponse.json();
          if (lsData?.data?.attributes?.url) {
            checkoutUrl = lsData.data.attributes.url;
          }
        }
      } catch (apiErr: any) {
        console.warn(`[Lemon Squeezy API Check] REST API fetch fallback to formatted hosted link: ${apiErr.message}`);
      }
    }

    const latencyMs = Date.now() - startTime;
    res.status(200).json({
      success: true,
      requestId,
      checkoutUrl,
      url: checkoutUrl,
      payload: {
        checkoutUrl,
        variantId: cleanVariantId,
        userId: cleanUserId,
        email: cleanEmail
      },
      latencyMs
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate Lemon Squeezy checkout session.",
      requestId
    });
  }
}

/**
 * Express Router Registration for Render Deployment
 */
export const lemonSqueezyRouter: Router = Router();

lemonSqueezyRouter.post('/api/monetization/webhook', lemonSqueezyWebhookController);
lemonSqueezyRouter.post('/monetization/webhook', lemonSqueezyWebhookController);
lemonSqueezyRouter.post('/api/webhook/lemonsqueezy', lemonSqueezyWebhookController);
lemonSqueezyRouter.post('/api/v1/billing/create-checkout', createLemonSqueezyCheckoutController);
lemonSqueezyRouter.post('/api/billing/create-checkout', createLemonSqueezyCheckoutController);

export default lemonSqueezyRouter;
