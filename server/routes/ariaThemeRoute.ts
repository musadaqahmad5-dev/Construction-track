import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenAI, Type, Schema } from '@google/genai';

/**
 * Structural Interface Contract for Aria Dynamic Theme Generation
 */
export interface AriaThemeResponse {
  style_title: string;       // Max 60 chars. (e.g., "Cast Iron Industrial", "Bespoke Gothic Rose")
  style_summary: string;     // Max 60 chars. One-line atmospheric description matching user vibe.
  palette_tokens: {
    main_canvas_bg: string;     // HEX code matching user's random mood string
    sidebar_nav_bg: string;     // Complementary background HEX tint
    card_surface_bg: string;    // Soft contrast card HEX code
    accent_ai_color: string;    // Bright glowing indicator accent HEX
    accent_commerce_color: string; // High-contrast Emerald highlight HEX
    sidebar_border_style: string;  // Tailwind border specification class
    text_header_color: string;     // Accessible bone/stone white text color class
  };
  system_health: {
    confidence: number;
    quality_score: number;
  };
}

/**
 * Pre-compiled High-End Classic Coordinate Fallback Token Set
 * Activated during quota exhaustion, network anomalies, or database empty-states.
 */
export const PRECOMPILED_CLASSIC_THEME: Readonly<AriaThemeResponse> = Object.freeze({
  style_title: 'Cast Iron Industrial Atelier',
  style_summary: 'Raw forged charcoal, brushed steel silvers, and architectural tailoring.',
  palette_tokens: {
    main_canvas_bg: '#222224',
    sidebar_nav_bg: '#18181a',
    card_surface_bg: '#2b2b2e',
    accent_ai_color: '#a1a1aa',
    accent_commerce_color: '#22c55e',
    sidebar_border_style: 'border-white/10',
    text_header_color: 'text-zinc-100'
  },
  system_health: {
    confidence: 0.98,
    quality_score: 95
  }
});

/**
 * Strict Response Schema Definition for Gemini 3.7 Flash JSON Mode
 */
const ARIA_THEME_RESPONSE_SCHEMA: Schema = {
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

/**
 * Lazy Google GenAI Client Initializer with Custom User-Agent Telemetry Header
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
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIInstance;
}

/**
 * Helper to Extract Authenticated UID or Fallback Anonymous Identifier
 */
function resolveUserId(req: Request): string {
  return (
    (req as any).user?.uid ||
    (req.headers['x-user-id'] as string) ||
    req.body?.userId ||
    req.body?.user_id ||
    'guest-sartorialist-user-100'
  );
}

/**
 * Write Structured Theme Vector Payload to Cloud Firestore 'userStyleProfiles'
 */
async function reconcileFirestoreProfile(
  userId: string,
  tenantId: string,
  themePayload: AriaThemeResponse,
  rawPrompt: string
): Promise<void> {
  try {
    const db = getFirestore();
    const profileDocRef = db.collection('userStyleProfiles').doc(userId);

    const docSnapshot = await profileDocRef.get();
    const existingData = docSnapshot.exists ? docSnapshot.data() : {};

    // Check for empty-state wardrobe configuration and synthesize baseline if absent
    const wardrobeItems = existingData?.wardrobeItems || [];
    const hasEmptyWardrobe = !Array.isArray(wardrobeItems) || wardrobeItems.length === 0;

    await profileDocRef.set(
      {
        userId,
        tenantId,
        activeTheme: themePayload,
        lastGeneratedTheme: themePayload,
        appliedSeedPrompt: rawPrompt,
        invariantOverrideActive: true,
        styleTitle: themePayload.style_title,
        styleSummary: themePayload.style_summary,
        systemHealth: themePayload.system_health,
        emptyStateInterception: hasEmptyWardrobe,
        updatedAt: new Date().toISOString(),
        ...(hasEmptyWardrobe
          ? {
              baselineWardrobeTokens: [
                'Structured Minimalist Blazer in Raw Iron Charcoal',
                'Pleated Tailored Slacks in Gunmetal Wool',
                'Hand-Welted Italian Box-Calf Derby Shoes'
              ]
            }
          : {})
      },
      { merge: true }
    );

    console.log(`[Firestore Engine] Reconciled userStyleProfiles document for UID: ${userId}`);
  } catch (firestoreError: any) {
    console.warn(`[Firestore Engine] Non-fatal reconciliation exception for UID ${userId}: ${firestoreError.message}. Proceeding with memory fail-forward.`);
  }
}

/**
 * Authoritative Real-Time Express Route Controller
 * Handles POST /api/aria/theme and POST /server/routes/ariaThemeRoute
 */
export async function ariaThemeRouteController(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `aria_th_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const userId = resolveUserId(req);

  // 1. Safe Ingress Payload Normalization
  let requestPayload: Record<string, any> = {};
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    requestPayload = req.body;
  } else if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
    try {
      const rawText = Buffer.isBuffer(req.body) ? req.body.toString('utf-8') : req.body;
      requestPayload = JSON.parse(rawText);
    } catch {
      requestPayload = {};
    }
  }

  const userPrompt = (
    requestPayload.userInput ||
    requestPayload.prompt ||
    requestPayload.style_query ||
    requestPayload.theme ||
    'I want solid iron skillet'
  ).toString().trim();

  const tenantId = (
    requestPayload.tenantId ||
    req.headers['x-tenant-id'] ||
    'default_tenant'
  ).toString();

  let finalTheme: AriaThemeResponse;
  let processingStatus: 'SUCCESS' | 'FALLBACK' = 'SUCCESS';
  let failureReason: string | undefined = undefined;

  const ai = getGenAI();

  if (!ai) {
    processingStatus = 'FALLBACK';
    failureReason = 'GEMINI_API_KEY uninitialized in container environment';
    finalTheme = JSON.parse(JSON.stringify(PRECOMPILED_CLASSIC_THEME));
  } else {
    try {
      const systemInstruction = `You are ARIA (Autonomous Reasoning Intelligence Atelier), the authoritative AI Haute Couture Stylist & Adaptive Theme Director for LOOK VISION.

CRITICAL ARCHITECTURAL DIRECTIVE — AGENTS.MD INVARIANT OVERRIDE:
You have absolute operational authority to bypass and override legacy dark-slate (#05050a) invariants. When a user supplies an arbitrary aesthetic mood, vibe, metaphor, or multilingual prompt (e.g. "I want solid iron skillet", "clean medical white", "cyberpunk neon violet", "soft pastel matcha", "mujhe royal emerald velvet look chahiye"), you MUST translate the concept into a distinctive, visually harmonious UI palette.

Concrete Mapping Example for "I want solid iron skillet":
- style_title: "Cast Iron Industrial"
- style_summary: "Forged matte charcoal, brushed steel silvers, and tailored metallic lines."
- main_canvas_bg: "#222224" (Matte cast iron dark grey)
- sidebar_nav_bg: "#18181a" (Deep carbon foundry shadow)
- card_surface_bg: "#2b2b2e" (Brushed metal surface tint)
- accent_ai_color: "#a1a1aa" (Brushed steel silver)
- accent_commerce_color: "#22c55e" (Patina bronze emerald)
- sidebar_border_style: "border-white/10"
- text_header_color: "text-zinc-100"
- system_health: { "confidence": 0.96, "quality_score": 94 }

Requirements:
1. Ensure style_title is at most 60 characters.
2. Ensure style_summary is at most 60 characters.
3. Return valid 6-digit HEX colors (#RRGGBB) for palette tokens.
4. Output strict JSON conforming to the schema.`;

      let parsed: AriaThemeResponse | null = null;
      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.7-flash'];

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `Generate dynamic bespoke Aria theme tokens for user aesthetic request: "${userPrompt}"`,
            config: {
              systemInstruction,
              temperature: 0.3,
              responseMimeType: 'application/json',
              responseSchema: ARIA_THEME_RESPONSE_SCHEMA
            }
          });

          const responseText = response.text ? response.text.trim() : '{}';
          const candidate = JSON.parse(responseText) as AriaThemeResponse;

          if (
            candidate &&
            candidate.palette_tokens &&
            typeof candidate.style_title === 'string' &&
            typeof candidate.style_summary === 'string'
          ) {
            candidate.style_title = candidate.style_title.slice(0, 60);
            candidate.style_summary = candidate.style_summary.slice(0, 60);
            parsed = candidate;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`[AriaThemeRoute] Model ${model} failed:`, modelErr.message);
        }
      }

      if (parsed) {
        finalTheme = parsed;
      } else {
        throw new Error('Incomplete response payload schema received from Gemini generation stream.');
      }
    } catch (engineError: any) {
      processingStatus = 'FALLBACK';
      failureReason = engineError?.message || 'Gemini model invocation anomaly';

      // Fail-forward seamlessly into classic coordinate token set
      const fallbackCopy = JSON.parse(JSON.stringify(PRECOMPILED_CLASSIC_THEME)) as AriaThemeResponse;
      if (userPrompt && userPrompt.length > 0) {
        fallbackCopy.style_title = `${userPrompt.slice(0, 35)} Atelier`.trim();
      }
      finalTheme = fallbackCopy;
    }
  }

  // 2. Cloud Firestore Database Reconciliation
  await reconcileFirestoreProfile(userId, tenantId, finalTheme, userPrompt);

  const latencyMs = Date.now() - startTime;

  // 3. SRE Standardized Telemetry Metrics Emission
  const standardLog = {
    level: processingStatus === 'SUCCESS' ? 'INFO' : 'WARN',
    tag: '[APOOL_LOG_STANDARD]',
    request_id: requestId,
    tenant_id: tenantId,
    event_name: 'aria_theme_generation',
    latency_ms: latencyMs,
    user_id: userId,
    status: processingStatus,
    prompt_length: userPrompt.length,
    error: failureReason,
    timestamp: new Date().toISOString()
  };
  console.log(`[APOOL_LOG_STANDARD] ${JSON.stringify(standardLog)}`);

  const eventContract = {
    tag: '[APOOL_EVENT_CONTRACT]',
    event: 'aria_theme_reconciled',
    request_id: requestId,
    status: processingStatus,
    duration_ms: latencyMs,
    quality_score: finalTheme.system_health?.quality_score || 90,
    confidence: finalTheme.system_health?.confidence || 0.95
  };
  console.log(`[APOOL_EVENT_CONTRACT] ${JSON.stringify(eventContract)}`);

  // 4. Return Clean 200 OK Response to Ingress Pool
  res.status(200).json({
    success: true,
    request_id: requestId,
    latency_ms: latencyMs,
    status: processingStatus,
    data: finalTheme
  });
}

/**
 * Central Express Router Registration
 */
export const ariaThemeRouter: Router = Router();

ariaThemeRouter.post('/api/aria/theme', ariaThemeRouteController);
ariaThemeRouter.post('/api/aria/theme-generate', ariaThemeRouteController);
ariaThemeRouter.post('/aria/theme', ariaThemeRouteController);

export default ariaThemeRouter;
