import { Request, Response, Router } from 'express';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import crypto from 'crypto';

/**
 * Type Contract: Full Aria Dynamic Theme Specification
 */
export interface AriaDynamicTheme {
  style_title: string; // Max 60 chars. Atmospheric layout name (e.g., "Cast Iron Industrial", "Bespoke Gothic Rose")
  style_summary: string; // Max 60 chars. One-line description matching user vibe.
  user_profile: {
    style: string;
    occasion: string;
    fashion_maturity_score: number;
    style_drift_index: number;
    trend_adoption_level: number;
    confidence: number;
  };
  style_evolution: {
    style_evolution_curve: string;
    preference_drift_forecast: string;
  };
  palette_tokens: {
    main_canvas_bg: string;
    sidebar_nav_bg: string;
    card_surface_bg: string;
    accent_ai_color: string;
    accent_commerce_color: string;
    sidebar_border_style: string;
    text_header_color: string;
  };
  outfits: Array<{
    items: {
      top: string;
      bottom: string;
      shoes: string;
    };
    scores: {
      style_match: number;
      occasion_match: number;
      trend_alignment: number;
      comfort: number;
      commercial_value: number;
      revenue_priority_score: number;
      total_score: number;
    };
    affiliate_potential: boolean;
    fashion_reason: string;
    why_this_works: string;
    where_to_wear: string;
    confidence: number;
    quick_alternative: string;
  }>;
  final_recommendation: string;
  quick_summary: string;
  why_this_works: string;
  monetization_summary: {
    best_conversion_outfit_index: number;
    high_value_picks: string[];
  };
}

/**
 * Standalone Deterministic Fallback Theme Provider
 * Activated whenever Gemini API hits a quota rate-limit (429), network timeout, or structural error.
 */
export const DETERMINISTIC_FALLBACK_THEME: Readonly<AriaDynamicTheme> = Object.freeze({
  style_title: 'Cast Iron Industrial Atelier',
  style_summary: 'Forged metallic greys, brushed steel silvers, and structure.',
  user_profile: {
    style: 'Industrial Haute Minimalist',
    occasion: 'Metropolitan Versatile & Evening Gallery',
    fashion_maturity_score: 88,
    style_drift_index: 12,
    trend_adoption_level: 84,
    confidence: 0.96
  },
  style_evolution: {
    style_evolution_curve: 'Steep upward trajectory toward tailored architectural monochrome silhouetting',
    preference_drift_forecast: 'Gradual expansion into textured carbon weaves and brushed metallic accents'
  },
  palette_tokens: {
    main_canvas_bg: '#222224',
    sidebar_nav_bg: '#18181a',
    card_surface_bg: '#2b2b2e',
    accent_ai_color: '#a1a1aa',
    accent_commerce_color: '#22c55e',
    sidebar_border_style: '1px solid rgba(255, 255, 255, 0.12)',
    text_header_color: '#f4f4f5'
  },
  outfits: [
    {
      items: {
        top: 'Matte Cast-Iron Charcoal Wool Structured Blazer',
        bottom: 'Tapered Pleated Gunmetal Gabardine Trousers',
        shoes: 'Polished Black Box-Calf Derby Shoes'
      },
      scores: {
        style_match: 94,
        occasion_match: 91,
        trend_alignment: 89,
        comfort: 86,
        commercial_value: 92,
        revenue_priority_score: 91,
        total_score: 90
      },
      affiliate_potential: true,
      fashion_reason: 'Architectural shoulder lines balance fluid drape with raw industrial precision.',
      why_this_works: 'Monochromatic value contrast creates slimming vertical visual continuity.',
      where_to_wear: 'Architectural Biennales, High-End Design Galas, & Private Art Vernissages',
      confidence: 0.95,
      quick_alternative: 'Swap the blazer for a brushed steel merino zip-cardigan for casual environments.'
    },
    {
      items: {
        top: 'Brushed Slate-Grey Fine Gauge Cashmere Mock-Neck',
        bottom: 'Raw Japanese Selvedge Deep Indigo-Black Denim',
        shoes: 'Hand-Welted Chelsea Boots in Suede Obsidian'
      },
      scores: {
        style_match: 90,
        occasion_match: 88,
        trend_alignment: 86,
        comfort: 93,
        commercial_value: 88,
        revenue_priority_score: 87,
        total_score: 89
      },
      affiliate_potential: true,
      fashion_reason: 'Tactile contrast between soft combed cashmere and structured denim texture.',
      why_this_works: 'Tonal layering provides effortless refinement suitable for all day-to-evening transitions.',
      where_to_wear: 'Creative Studio Workspaces, Executive Dinners, & Smart Casual Functions',
      confidence: 0.92,
      quick_alternative: 'Layer with an unstructured wool overcoat in carbon black.'
    },
    {
      items: {
        top: 'Architectural Cut Double-Breasted Graphite Trench Coat',
        bottom: 'Relaxed Tailored Charcoal Flannel Wide-Leg Slacks',
        shoes: 'Minimalist Nappa Leather Low-Top Trainers in Chalk Grey'
      },
      scores: {
        style_match: 92,
        occasion_match: 87,
        trend_alignment: 93,
        comfort: 88,
        commercial_value: 90,
        revenue_priority_score: 91,
        total_score: 90
      },
      affiliate_potential: true,
      fashion_reason: 'Modern streetwear proportion fused with Savile Row tailoring lines.',
      why_this_works: 'Subtle high-low pairing elevates athletic minimalism to haute couture standards.',
      where_to_wear: 'Global Fashion Week Showrooms & Autumn City Travel',
      confidence: 0.94,
      quick_alternative: 'Pair with chunky lug-sole loafers for an edgy runway statement.'
    }
  ],
  final_recommendation: 'Adopt the Cast Iron Atelier palette with clean metallic neutrals and tailored silhouettes to command confident, effortless authority across versatile metropolitan settings.',
  quick_summary: 'Architectural industrial aesthetics rendered in refined slate, steel, and matte carbon.',
  why_this_works: 'Subtle matte tonal variations eliminate visual clutter while maintaining rich, tactile depth across all ambient lighting conditions.',
  monetization_summary: {
    best_conversion_outfit_index: 0,
    high_value_picks: [
      'Matte Cast-Iron Charcoal Wool Structured Blazer',
      'Architectural Cut Double-Breasted Graphite Trench Coat'
    ]
  }
});

/**
 * Pre-compiled High-End Classic Clothing Templates
 * Injected when dynamic outfit filtering leaves fewer than 3 versatile options.
 */
const BACKUP_LUXURY_OUTFITS = [
  {
    items: {
      top: 'Tailored Heavyweight Silk Crepe de Chine Shirt in Smoked Quartz',
      bottom: 'High-Rise Straight-Leg Italian Wool Flannel Trousers',
      shoes: 'Sculpted Angular Block-Heel Mules in Calfskin'
    },
    scores: {
      style_match: 91,
      occasion_match: 90,
      trend_alignment: 88,
      comfort: 87,
      commercial_value: 92,
      revenue_priority_score: 90,
      total_score: 90
    },
    affiliate_potential: true,
    fashion_reason: 'Fluid drape meets structural precision.',
    why_this_works: 'Textural interplay creates rich dimensional contrast.',
    where_to_wear: 'Executive Meetings & Gallery Openings',
    confidence: 0.93,
    quick_alternative: 'Substitute top with fine ribbed silk-cashmere blend knit.'
  },
  {
    items: {
      top: 'Deconstructed Oversized Heavy Knit Cardigan in Heather Slate',
      bottom: 'Tailored Cropped Wool Trousers with Crisp Front Creases',
      shoes: 'Classic Chunky Leather Loafers with Brushed Steel Buckles'
    },
    scores: {
      style_match: 89,
      occasion_match: 87,
      trend_alignment: 91,
      comfort: 94,
      commercial_value: 86,
      revenue_priority_score: 88,
      total_score: 89
    },
    affiliate_potential: true,
    fashion_reason: 'Effortless relaxed tailoring with artisanal knit texture.',
    why_this_works: 'Proportion play balances relaxed top volume with crisp bottom tapering.',
    where_to_wear: 'Creative Studio Engagements & Weekend Curated Brunches',
    confidence: 0.91,
    quick_alternative: 'Layer over a crisp poplin shirt in pale oyster.'
  },
  {
    items: {
      top: 'Sharp Asymmetrical Peak-Lapel Smoking Jacket in Carbon Black',
      bottom: 'Fluid Silk-Wool Blend Pleated Evening Trousers',
      shoes: 'Patent Leather Pointed-Toe Dress Oxfords'
    },
    scores: {
      style_match: 95,
      occasion_match: 94,
      trend_alignment: 90,
      comfort: 84,
      commercial_value: 96,
      revenue_priority_score: 94,
      total_score: 92
    },
    affiliate_potential: true,
    fashion_reason: 'Contemporary black-tie reimagination with sharp geometric cuts.',
    why_this_works: 'High-impact silhouette commanding elevated sophistication.',
    where_to_wear: 'Black Tie Galas, Red Carpet Premiers, & Award Receptions',
    confidence: 0.96,
    quick_alternative: 'Pair with an unbuttoned matte silk mandarin-collar shirt.'
  }
];

/**
 * Strict JSON Schema definition for Google GenAI SDK
 */
const ARIA_THEME_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    style_title: { type: Type.STRING },
    style_summary: { type: Type.STRING },
    user_profile: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING },
        occasion: { type: Type.STRING },
        fashion_maturity_score: { type: Type.NUMBER },
        style_drift_index: { type: Type.NUMBER },
        trend_adoption_level: { type: Type.NUMBER },
        confidence: { type: Type.NUMBER }
      },
      required: [
        'style',
        'occasion',
        'fashion_maturity_score',
        'style_drift_index',
        'trend_adoption_level',
        'confidence'
      ]
    },
    style_evolution: {
      type: Type.OBJECT,
      properties: {
        style_evolution_curve: { type: Type.STRING },
        preference_drift_forecast: { type: Type.STRING }
      },
      required: ['style_evolution_curve', 'preference_drift_forecast']
    },
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
    outfits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.OBJECT,
            properties: {
              top: { type: Type.STRING },
              bottom: { type: Type.STRING },
              shoes: { type: Type.STRING }
            },
            required: ['top', 'bottom', 'shoes']
          },
          scores: {
            type: Type.OBJECT,
            properties: {
              style_match: { type: Type.NUMBER },
              occasion_match: { type: Type.NUMBER },
              trend_alignment: { type: Type.NUMBER },
              comfort: { type: Type.NUMBER },
              commercial_value: { type: Type.NUMBER },
              revenue_priority_score: { type: Type.NUMBER },
              total_score: { type: Type.NUMBER }
            },
            required: [
              'style_match',
              'occasion_match',
              'trend_alignment',
              'comfort',
              'commercial_value',
              'revenue_priority_score',
              'total_score'
            ]
          },
          affiliate_potential: { type: Type.BOOLEAN },
          fashion_reason: { type: Type.STRING },
          why_this_works: { type: Type.STRING },
          where_to_wear: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          quick_alternative: { type: Type.STRING }
        },
        required: [
          'items',
          'scores',
          'affiliate_potential',
          'fashion_reason',
          'why_this_works',
          'where_to_wear',
          'confidence',
          'quick_alternative'
        ]
      }
    },
    final_recommendation: { type: Type.STRING },
    quick_summary: { type: Type.STRING },
    why_this_works: { type: Type.STRING },
    monetization_summary: {
      type: Type.OBJECT,
      properties: {
        best_conversion_outfit_index: { type: Type.NUMBER },
        high_value_picks: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ['best_conversion_outfit_index', 'high_value_picks']
    }
  },
  required: [
    'style_title',
    'style_summary',
    'user_profile',
    'style_evolution',
    'palette_tokens',
    'outfits',
    'final_recommendation',
    'quick_summary',
    'why_this_works',
    'monetization_summary'
  ]
};

/**
 * Lazy Google GenAI Client Instance Initializer
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
 * Score Normalization & Duplicate Prevention Layer
 * Enforces versatility, recalculates revenue_priority_score, and guarantees 3 unique outfits.
 */
function normalizeAndDeduplicateOutfits(
  rawOutfits: AriaDynamicTheme['outfits'],
  isDegradedMemory: boolean
): AriaDynamicTheme['outfits'] {
  const scoreThreshold = isDegradedMemory ? 70 : 75;
  const processedOutfits: AriaDynamicTheme['outfits'] = [];
  const seenTopFootprints = new Set<string>();

  for (const outfit of rawOutfits || []) {
    if (!outfit || !outfit.items || !outfit.scores) continue;

    // Normalizing and recalculating mathematical revenue_priority_score
    const commVal = Number(outfit.scores.commercial_value) || 75;
    const trendVal = Number(outfit.scores.trend_alignment) || 75;
    const computedRevenuePriority = Math.round((commVal * 0.6) + (trendVal * 0.4));
    
    outfit.scores.revenue_priority_score = computedRevenuePriority;

    const totalScore = Number(outfit.scores.total_score) || 
      Math.round(
        ((Number(outfit.scores.style_match) || 80) +
         (Number(outfit.scores.occasion_match) || 80) +
         (Number(outfit.scores.comfort) || 80) +
         computedRevenuePriority) / 4
      );
    outfit.scores.total_score = totalScore;

    // Check pass threshold
    if (totalScore < scoreThreshold) {
      continue;
    }

    // Deduplication check based on top item footprint
    const normalizedTop = (outfit.items.top || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();

    if (normalizedTop.length > 3 && seenTopFootprints.has(normalizedTop)) {
      // Duplicate top detected — prune to ensure sartorial versatility
      continue;
    }

    if (normalizedTop.length > 3) {
      seenTopFootprints.add(normalizedTop);
    }

    processedOutfits.push(outfit);
  }

  // Guarantee strict array limit requirement of at least 3 unique options
  let backupIdx = 0;
  while (processedOutfits.length < 3 && backupIdx < BACKUP_LUXURY_OUTFITS.length) {
    const backup = JSON.parse(JSON.stringify(BACKUP_LUXURY_OUTFITS[backupIdx]));
    const backupTop = backup.items.top.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    if (!seenTopFootprints.has(backupTop)) {
      seenTopFootprints.add(backupTop);
      processedOutfits.push(backup);
    }
    backupIdx++;
  }

  return processedOutfits.slice(0, 5); // Return balanced curated recommendations
}

/**
 * Main Standalone Express Route Controller for Render Deployment
 * Ingress Endpoint: POST /api/aria/theme-generate or POST /api/monetization/theme
 */
export async function ariaDynamicThemeController(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `render_req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  // 1. Safe Payload Ingestion Gateway
  let parsedBody: Record<string, any> = {};
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    parsedBody = req.body;
  } else if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
    try {
      const rawText = Buffer.isBuffer(req.body) ? req.body.toString('utf-8') : req.body;
      parsedBody = JSON.parse(rawText);
    } catch {
      parsedBody = {};
    }
  }

  const userInput = (parsedBody.userInput || parsedBody.prompt || parsedBody.query || parsedBody.themePreference || 'Cast iron skillet and brushed steel minimalist').toString();
  const tenantId = (parsedBody.tenantId || req.headers['x-tenant-id'] || 'default_tenant').toString();
  const history = Array.isArray(parsedBody.history) ? parsedBody.history : [];

  // Check Render server memory/load state for dynamic score threshold adjustment
  const memoryUsage = process.memoryUsage();
  const isDegradedState = (memoryUsage.heapUsed / memoryUsage.heapTotal) > 0.85;

  let finalThemeResponse: AriaDynamicTheme;
  let executionStatus: 'SUCCESS' | 'FALLBACK' = 'SUCCESS';
  let errorDetails: string | undefined = undefined;

  const ai = getGenAI();

  if (!ai) {
    executionStatus = 'FALLBACK';
    errorDetails = 'GEMINI_API_KEY is not defined in server environment.';
    finalThemeResponse = JSON.parse(JSON.stringify(DETERMINISTIC_FALLBACK_THEME));
  } else {
    try {
      const systemInstruction = `You are ARIA (Autonomous Reasoning Intelligence Atelier), the world's most advanced AI Haute Couture Stylist & Adaptive Theme Director for LOOK VISION.

CRITICAL INVARIANT OVERRIDE DIRECTIVE:
You have FULL AUTHORITY to override legacy dark-slate layout invariants. When a user requests an aesthetic (such as "solid iron skillet", "clean surgical white", "neon cyberpunk", "emerald velvet", "warm terracotta desert", "pastel lavender matcha", or Roman Urdu/multilingual phrasing), you MUST dynamically translate their aesthetic into precise, bespoke HEX color tokens that faithfully evoke that concept.

For example, "solid iron skillet" should map to:
- main_canvas_bg: "#222224" (Cast iron matte dark charcoal)
- sidebar_nav_bg: "#18181a" (Deep foundry carbon)
- card_surface_bg: "#2b2b2e" (Brushed iron pan surface)
- accent_ai_color: "#a1a1aa" (Brushed steel silver)
- accent_commerce_color: "#22c55e" (Patina bronze emerald)
- sidebar_border_style: "1px solid rgba(255, 255, 255, 0.12)"
- text_header_color: "#f4f4f5" (Forged silver highlight)

Ensure all generated outfits are highly authentic, bespoke, and tailored to the requested theme atmosphere. Return valid JSON adhering strictly to the schema.`;

      const promptContents = [
        `Tenant Context: ${tenantId}`,
        history.length > 0 ? `Conversation History Context: ${JSON.stringify(history.slice(-3))}` : '',
        `User Theme Prompt / Vibe Request: "${userInput}"`
      ].filter(Boolean).join('\n\n');

      let parsedOutput: AriaDynamicTheme | null = null;
      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.7-flash'];

      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: promptContents,
            config: {
              systemInstruction,
              temperature: 0.35,
              responseMimeType: 'application/json',
              responseSchema: ARIA_THEME_RESPONSE_SCHEMA
            }
          });

          const rawText = response.text ? response.text.trim() : '{}';
          const candidate = JSON.parse(rawText) as AriaDynamicTheme;

          if (
            candidate &&
            candidate.palette_tokens &&
            typeof candidate.style_title === 'string' &&
            Array.isArray(candidate.outfits)
          ) {
            candidate.style_title = candidate.style_title.slice(0, 60);
            candidate.style_summary = candidate.style_summary.slice(0, 60);
            candidate.outfits = normalizeAndDeduplicateOutfits(candidate.outfits, isDegradedState);
            parsedOutput = candidate;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`[AriaDynamicThemeController] Model ${model} failed:`, modelErr.message);
        }
      }

      if (parsedOutput) {
        finalThemeResponse = parsedOutput;
      } else {
        throw new Error('Generated schema payload missing essential properties.');
      }
    } catch (geminiError: any) {
      executionStatus = 'FALLBACK';
      errorDetails = geminiError?.message || 'Unknown Gemini API execution anomaly.';
      
      // Fail forward seamlessly into deterministic fallback
      const fallback = JSON.parse(JSON.stringify(DETERMINISTIC_FALLBACK_THEME));
      fallback.outfits = normalizeAndDeduplicateOutfits(fallback.outfits, isDegradedState);
      
      // Adapt fallback title dynamically to mirror the prompt safely
      fallback.style_title = `${userInput.slice(0, 35)} Atelier`.trim();
      finalThemeResponse = fallback;
    }
  }

  const latencyMs = Date.now() - startTime;

  // 7. SRE Telemetry & Diagnostics Logging
  const logTelemetry = {
    level: executionStatus === 'SUCCESS' ? 'INFO' : 'WARN',
    tag: '[APOOL_LOG_STANDARD]',
    request_id: requestId,
    tenant_id: tenantId,
    latency_ms: latencyMs,
    status: executionStatus,
    prompt_length: userInput.length,
    degraded_memory: isDegradedState,
    error: errorDetails,
    timestamp: new Date().toISOString()
  };
  console.log(`[APOOL_LOG_STANDARD] ${JSON.stringify(logTelemetry)}`);

  const eventContract = {
    tag: '[APOOL_EVENT_CONTRACT]',
    event: 'aria_theme_generation_completed',
    request_id: requestId,
    status: executionStatus,
    duration_ms: latencyMs,
    outfit_count: finalThemeResponse.outfits?.length || 0
  };
  console.log(`[APOOL_EVENT_CONTRACT] ${JSON.stringify(eventContract)}`);

  // Always return a clean, non-blocking 200 OK status to keep client pools and webhooks healthy
  res.status(200).json({
    success: true,
    request_id: requestId,
    latency_ms: latencyMs,
    status: executionStatus,
    theme: finalThemeResponse
  });
}

/**
 * Standalone Router instantiation for Render deployment
 */
export const ariaDynamicThemeRouter: Router = Router();

ariaDynamicThemeRouter.post('/api/aria/theme-generate', ariaDynamicThemeController);
ariaDynamicThemeRouter.post('/api/monetization/theme', ariaDynamicThemeController);
ariaDynamicThemeRouter.post('/aria/theme-generate', ariaDynamicThemeController);

export default ariaDynamicThemeRouter;
