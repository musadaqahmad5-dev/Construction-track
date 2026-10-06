import { Request, Response, Router } from 'express';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenAI, Type } from '@google/genai';

/**
 * Interface representing the structured ARIA dynamic theme palette
 */
export interface AriaTheme {
  background: string;
  sidebar: string;
  accentAI: string;
  typographyHeader: string;
}

/**
 * Standard SRE Structured Telemetry Payload
 */
export interface SREWebhookTelemetry {
  level: 'INFO' | 'WARN' | 'ERROR';
  type: 'MONETIZATION_WEBHOOK_TELEMETRY';
  request_id: string;
  tenant_id: string;
  event_name: string;
  latency_ms: number;
  user_id?: string;
  status: 'SUCCESS' | 'FAILED' | 'IGNORED' | 'FALLBACK';
  theme_seed?: string;
  theme_generated?: AriaTheme;
  error?: string;
  timestamp: string;
}

/**
 * Lemon Squeezy Inbound Webhook Payload Schema
 */
export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
      tenant_id?: string;
      theme_preference?: string;
      theme_seed?: string;
      theme?: string;
      custom_theme?: string;
      style_preference?: string;
      raw_theme_input?: string;
      plan_id?: string;
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
      custom_data?: {
        user_id?: string;
        tenant_id?: string;
        theme_preference?: string;
        theme_seed?: string;
        theme?: string;
        custom_theme?: string;
        style_preference?: string;
        raw_theme_input?: string;
        plan_id?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
}

/**
 * Clean Corporate Light Contrast Fallback Template
 * Used when user input is ambiguous, garbage text, or when AI engine fails.
 */
export const CORPORATE_LIGHT_FALLBACK_THEME: Readonly<AriaTheme> = Object.freeze({
  background: '#f8fafc',
  sidebar: '#ffffff',
  accentAI: '#4f46e5',
  typographyHeader: '#0f172a'
});

// Idempotency tracking cache (cleared after 1000 events to manage memory)
const processedEventCache = new Set<string>();

/**
 * Lazy Google GenAI Client Singleton
 */
let genAIInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-monetization'
        }
      }
    });
  }
  return genAIInstance;
}

/**
 * 1. Cryptographic HMAC-SHA256 Timing-Safe Signature Validation
 */
export function verifyLemonSqueezySignature(
  rawBody: string | Buffer,
  signatureHeader?: string
): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('[Webhook Security] LEMON_SQUEEZY_WEBHOOK_SECRET is not configured. Permitting request in sandbox/dev fallback mode.');
    return true;
  }

  if (!signatureHeader || typeof signatureHeader !== 'string') {
    console.error('[Webhook Security] Missing or invalid x-signature header on monetization webhook.');
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
    console.error(`[Webhook Security] Cryptographic signature validation exception: ${err.message}`);
    return false;
  }
}

/**
 * 2. Real-Time Gemini AI Theme Parsing Loop
 * Dynamically resolves unpredictable user phrase inputs (e.g. "black rose", "soft pastel pink",
 * "neon cyberpunk", or Roman Urdu "mujhe clean white look chahiye") into structured HEX theme objects.
 */
export async function parseUserThemeWithGemini(userPhrase: string): Promise<AriaTheme> {
  const cleanInput = (userPhrase || '').trim();

  if (!cleanInput || cleanInput.length === 0) {
    return { ...CORPORATE_LIGHT_FALLBACK_THEME };
  }

  const ai = getGenAI();
  if (!ai) {
    console.warn('[Theme Engine] GEMINI_API_KEY unavailable. Returning corporate light fallback theme.');
    return { ...CORPORATE_LIGHT_FALLBACK_THEME };
  }

  const systemInstruction = `You are the lead Haute Couture UI/UX Design System AI for LOOK VISION / Fashion OS.
Your task is to interpret arbitrary, unpredictable user theme requests (which may be in English, Roman Urdu, slang, abstract metaphors, or color names like "black rose", "soft pastel pink", "neon cyberpunk", "mujhe clean white look chahiye", "dark aesthetic", "barbiecore", "emerald velvet") and generate a cohesive, mathematically balanced, high-contrast UI color palette.

Requirements:
1. Output MUST be valid JSON conforming exactly to the schema:
   {
     "background": string (HEX color code, e.g. "#0a0a0f", "#ffffff", "#180a0a"),
     "sidebar": string (HEX color code harmonized with background, e.g. "#120d14", "#f1f5f9"),
     "accentAI": string (Vibrant HEX color code for AI operations, e.g. "#e11d48", "#8b5cf6", "#10b981"),
     "typographyHeader": string (High-contrast HEX color for headings ensuring WCAG AA readability against background)
   }
2. If the user input is meaningless garbage, spam, or ambiguous characters, respond with the Clean Corporate Light Contrast palette:
   {
     "background": "#f8fafc",
     "sidebar": "#ffffff",
     "accentAI": "#4f46e5",
     "typographyHeader": "#0f172a"
   }
3. If the input specifies a theme like "black rose", generate an ultra-luxurious dark palette with deep charcoal/black background, muted dark crimson/wine undertone sidebar, vivid rose/magenta AI accent, and crisp light typography.
4. Ensure all colors are valid 6-digit HEX format (e.g. #RRGGBB).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Parse this user style preference and return the structured JSON theme: "${cleanInput}"`,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            background: { type: Type.STRING },
            sidebar: { type: Type.STRING },
            accentAI: { type: Type.STRING },
            typographyHeader: { type: Type.STRING }
          },
          required: ['background', 'sidebar', 'accentAI', 'typographyHeader']
        }
      }
    });

    const rawText = response.text ? response.text.trim() : '{}';
    const parsed = JSON.parse(rawText) as AriaTheme;

    // Validate that required hex color fields exist and are non-empty
    if (
      parsed &&
      typeof parsed.background === 'string' &&
      typeof parsed.sidebar === 'string' &&
      typeof parsed.accentAI === 'string' &&
      typeof parsed.typographyHeader === 'string' &&
      parsed.background.startsWith('#')
    ) {
      return parsed;
    }

    console.warn('[Theme Engine] AI generated schema was incomplete. Activating corporate light fallback.');
    return { ...CORPORATE_LIGHT_FALLBACK_THEME };
  } catch (err: any) {
    console.error(`[Theme Engine] Gemini parsing error for phrase "${cleanInput}": ${err.message}. Defaulting to fallback.`);
    return { ...CORPORATE_LIGHT_FALLBACK_THEME };
  }
}

/**
 * 3. Firestore State Persistence
 * Updates permanent user profile, active custom theme matrix (overriding AGENTS.md dark invariants),
 * and subscription metadata.
 */
export async function commitUserSubscriptionAndThemeToFirestore(
  userId: string,
  tenantId: string,
  subscriptionData: {
    planId: string;
    status: string;
    subscriptionId?: string;
    customerId?: string;
    renewsAt?: string;
    endsAt?: string;
  },
  themeSeed?: string,
  generatedTheme?: AriaTheme
): Promise<void> {
  try {
    const db = getFirestore();
    const userDocRef = db.collection('users').doc(userId);

    const updatePayload: Record<string, any> = {
      tenantId: tenantId || 'default_tenant',
      subscription: {
        tier: subscriptionData.planId.toLowerCase(),
        status: subscriptionData.status,
        provider: 'lemonsqueezy',
        subscriptionId: subscriptionData.subscriptionId || '',
        customerId: subscriptionData.customerId || '',
        renewsAt: subscriptionData.renewsAt || null,
        endsAt: subscriptionData.endsAt || null,
        updatedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    // If dynamic theme was parsed, commit custom theme matrix to user profile
    if (generatedTheme) {
      updatePayload.ariaTheme = generatedTheme;
      updatePayload.themeSeed = themeSeed || 'default';
      updatePayload.customThemeActive = true;
      updatePayload.styleProfile = {
        theme: generatedTheme,
        activePalette: themeSeed || 'custom_ai_seed',
        overrideStandardInvariants: true,
        lastGeneratedAt: new Date().toISOString()
      };
    }

    await userDocRef.set(updatePayload, { merge: true });

    // Also persist in the dedicated styleProfile sub-collection for granular version tracking
    if (generatedTheme) {
      await userDocRef.collection('styleProfiles').doc('current').set({
        ariaTheme: generatedTheme,
        seed: themeSeed || 'custom',
        source: 'lemon_squeezy_monetization_hook',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    console.log(`[Firestore Commit] Successfully updated user profile and theme for UID: ${userId}`);
  } catch (err: any) {
    console.error(`[Firestore Commit Error] Failed to update user document for ${userId}: ${err.message}`);
    // Non-blocking: don't throw to prevent webhook 500 retry loops
  }
}

/**
 * 4. Main Route Controller for POST /api/monetization/webhook
 */
export async function monetizationWebhookController(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `wh_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const signature = (req.headers['x-signature'] as string) || (req.headers['X-Signature'] as string);

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

  // 1. Cryptographic Handshake Verification
  const isSignatureValid = verifyLemonSqueezySignature(rawBody, signature);
  if (!isSignatureValid) {
    const latencyMs = Date.now() - startTime;
    const telemetry: SREWebhookTelemetry = {
      level: 'ERROR',
      type: 'MONETIZATION_WEBHOOK_TELEMETRY',
      request_id: requestId,
      tenant_id: 'unknown',
      event_name: 'signature_verification_failed',
      latency_ms: latencyMs,
      status: 'FAILED',
      error: 'Invalid HMAC-SHA256 signature.',
      timestamp: new Date().toISOString()
    };
    console.error(`[TELEMETRY SINK] ${JSON.stringify(telemetry)}`);
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Cryptographic signature mismatch.',
      request_id: requestId
    });
    return;
  }

  // 2. Parse Inbound Payload
  let payload: LemonSqueezyWebhookPayload;
  try {
    const rawString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf-8') : (typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody));
    payload = JSON.parse(rawString);
  } catch (parseErr: any) {
    const latencyMs = Date.now() - startTime;
    console.error(`[Webhook Controller] JSON Parse Error (Request ${requestId}): ${parseErr.message}`);
    res.status(400).json({
      success: false,
      error: `Malformed JSON payload: ${parseErr.message}`,
      request_id: requestId
    });
    return;
  }

  const eventName = (req.headers['x-event-name'] as string) || payload.meta?.event_name || 'unknown_event';
  const eventId = payload.data?.id || `evt_${requestId}`;

  // 3. Idempotency Check
  if (processedEventCache.has(eventId)) {
    const latencyMs = Date.now() - startTime;
    const telemetry: SREWebhookTelemetry = {
      level: 'INFO',
      type: 'MONETIZATION_WEBHOOK_TELEMETRY',
      request_id: requestId,
      tenant_id: 'unknown',
      event_name: eventName,
      latency_ms: latencyMs,
      status: 'IGNORED',
      timestamp: new Date().toISOString()
    };
    console.log(`[TELEMETRY SINK] ${JSON.stringify(telemetry)}`);
    res.status(200).json({
      received: true,
      duplicate: true,
      message: 'Event previously acknowledged and processed.',
      request_id: requestId
    });
    return;
  }

  // Add to idempotency cache and prune if needed
  processedEventCache.add(eventId);
  if (processedEventCache.size > 1000) {
    const firstItem = processedEventCache.values().next().value;
    if (firstItem) processedEventCache.delete(firstItem);
  }

  // 4. Multi-Tenant Parameter Extraction
  const metaCustom = payload.meta?.custom_data || {};
  const attrCustom = payload.data?.attributes?.custom_data || {};
  const combinedCustom = { ...attrCustom, ...metaCustom };

  const userId = combinedCustom.user_id || `user_${payload.data?.attributes?.customer_id || 'anonymous'}`;
  const tenantId = combinedCustom.tenant_id || (req.headers['x-tenant-id'] as string) || 'default_tenant';
  const planId = (combinedCustom.plan_id || 'PREMIUM').toUpperCase();

  // 5. Unpredictable User Theme Preference Extraction
  const rawThemeInput = combinedCustom.theme_preference ||
                        combinedCustom.theme_seed ||
                        combinedCustom.theme ||
                        combinedCustom.custom_theme ||
                        combinedCustom.style_preference ||
                        combinedCustom.raw_theme_input ||
                        'black rose'; // Default seed parameter

  let generatedTheme: AriaTheme = { ...CORPORATE_LIGHT_FALLBACK_THEME };
  let themeProcessingStatus: 'SUCCESS' | 'FALLBACK' = 'SUCCESS';

  // 6. Handle Subscription Lifecycle Events
  try {
    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed':
      case 'order_created': {
        const rawStatus = payload.data?.attributes?.status || 'active';
        const isSubscriptionActive = ['active', 'paid', 'on_trial'].includes(rawStatus);

        // Execute Real-Time AI Theme Generation Loop
        if (isSubscriptionActive && rawThemeInput) {
          try {
            console.log(`[Webhook Controller] Generating dynamic AI theme for user "${userId}" from seed phrase: "${rawThemeInput}"`);
            generatedTheme = await parseUserThemeWithGemini(rawThemeInput);
          } catch (aiErr: any) {
            console.warn(`[Webhook Controller] AI Theme Generator fallback activated: ${aiErr.message}`);
            generatedTheme = { ...CORPORATE_LIGHT_FALLBACK_THEME };
            themeProcessingStatus = 'FALLBACK';
          }
        }

        // Commit Subscription State & Theme to Firestore
        await commitUserSubscriptionAndThemeToFirestore(
          userId,
          tenantId,
          {
            planId,
            status: isSubscriptionActive ? 'active' : rawStatus,
            subscriptionId: payload.data?.id,
            customerId: String(payload.data?.attributes?.customer_id || ''),
            renewsAt: payload.data?.attributes?.renews_at,
            endsAt: payload.data?.attributes?.ends_at
          },
          rawThemeInput,
          isSubscriptionActive ? generatedTheme : undefined
        );
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        await commitUserSubscriptionAndThemeToFirestore(
          userId,
          tenantId,
          {
            planId,
            status: 'canceled',
            subscriptionId: payload.data?.id,
            customerId: String(payload.data?.attributes?.customer_id || ''),
            endsAt: payload.data?.attributes?.ends_at
          }
        );
        break;
      }

      default:
        console.log(`[Webhook Controller] Unhandled lifecycle event '${eventName}' registered cleanly.`);
        break;
    }
  } catch (lifecycleErr: any) {
    console.error(`[Webhook Controller] Lifecycle handling error: ${lifecycleErr.message}`);
  }

  // 7. SRE Telemetry & Diagnostics Metric Logging
  const latencyMs = Date.now() - startTime;
  const telemetry: SREWebhookTelemetry = {
    level: 'INFO',
    type: 'MONETIZATION_WEBHOOK_TELEMETRY',
    request_id: requestId,
    tenant_id: tenantId,
    event_name: eventName,
    latency_ms: latencyMs,
    user_id: userId,
    status: themeProcessingStatus === 'FALLBACK' ? 'FALLBACK' : 'SUCCESS',
    theme_seed: rawThemeInput,
    theme_generated: generatedTheme,
    timestamp: new Date().toISOString()
  };

  console.log(`[TELEMETRY SINK] ${JSON.stringify(telemetry)}`);

  // 8. Return Clean 200 OK Response to Prevent Retry Storms
  res.status(200).json({
    received: true,
    request_id: requestId,
    event_name: eventName,
    user_id: userId,
    theme_applied: generatedTheme,
    latency_ms: latencyMs
  });
}

/**
 * Express Router Definition
 */
export const monetizationWebhookRouter: Router = Router();
monetizationWebhookRouter.post('/api/monetization/webhook', monetizationWebhookController);
monetizationWebhookRouter.post('/monetization/webhook', monetizationWebhookController);

export default monetizationWebhookRouter;
