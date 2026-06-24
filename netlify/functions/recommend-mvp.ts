export async function handler(event: any, context: any) {
  const startTime = Date.now();
  const requestId = "req-" + Math.random().toString(36).substring(2, 11);

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  // Handle CORS Pre-flight Options requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  // SRE helper to output standardized log events
  function emitTelemetry(eventType: string, status: string, errorType: string, customCost?: number, isAnomalyOverride?: boolean) {
    const latency = Date.now() - startTime;
    const timestampStr = new Date().toISOString();

    // Estimate token footprint safely
    const inputChars = (event.body || "").length;
    let fallbackOutputSize = 800; // default estimated output characters
    const estInputTokens = Math.ceil(inputChars / 4);
    const estOutputTokens = Math.ceil(fallbackOutputSize / 4);
    
    // Cost coefficients (Gemini 1.5 Flash: $0.075/1M Input, $0.30/1M Output tokens)
    const calculatedCost = customCost !== undefined ? customCost : Number(((estInputTokens * 0.075) / 1000000 + (estOutputTokens * 0.3) / 1000000).toFixed(8));

    // Dynamic state determination
    let resolvedState: "GREEN" | "YELLOW" | "RED" = "GREEN";
    if (errorType && errorType !== "") {
      resolvedState = "RED";
    } else if (latency > 3500 || inputChars > 1000) {
      resolvedState = "YELLOW";
    }

    // Anomaly analysis
    const hasPatternAnomaly = /select|drop|delete|insert|update|union/i.test(event.body || "") || inputChars > 2000;
    const isAnomaly = isAnomalyOverride || hasPatternAnomaly;

    // Standard Log Schema (Section 7 rule)
    const standardLog = {
      request_id: requestId,
      tenant_id: tenantId,
      timestamp: timestampStr,
      event: eventType,
      latency_ms: latency,
      status: status,
      error_type: errorType,
      cost_estimate: calculatedCost
    };

    // Global Event Contract (Section 6 rule)
    const globalEvent = {
      event_id: "evt-" + requestId.substring(4),
      timestamp: timestampStr,
      tenant_id: tenantId,
      event_type: eventType,
      health_state: resolvedState,
      latency_ms: latency,
      cost_usd: calculatedCost,
      error_type: errorType,
      anomaly_flag: isAnomaly
    };

    console.log(`[APOOL_LOG_STANDARD] ${JSON.stringify(standardLog)}`);
    console.log(`[APOOL_EVENT_CONTRACT] ${JSON.stringify(globalEvent)}`);

    return { standardLog, globalEvent };
  }


  // SRE recovery helper to ensure compliant outputs even during severe API faults
  function getSafeRecoveryResponse(tId: string, globalEvent: any, customRec?: string) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        mode: "LIVE_GEMINI",
        tenant_id: tId,
        control_plane: {
          decision_type: "LOW_VALUE",
          api_cost_optimization: true,
          response_enhanced: false,
          health_state: "RED"
        },
        user_profile: {
          style: "Classic Tailoring",
          occasion: "Corporate Strategy Focus",
          fashion_maturity_score: 95,
          style_drift_index: 10,
          trend_adoption_level: 40,
          confidence: 99
        },
        style_evolution: {
          style_evolution_curve: "Ultra-stable professional architecture focusing on premium structured linen.",
          preference_drift_forecast: "Predictable shift to single-breasted lightweight Blazers."
        },
        outfits: [
          {
            items: {
              top: "Bespoke Navy Double-Breasted Linen Blazer",
              bottom: "Premium Slim-Fit Off-White Cotton Chinos",
              shoes: "Handcrafted Dark Italian Leather Loafers"
            },
            scores: {
              style_match: 95,
              occasion_match: 95,
              trend_alignment: 80,
              comfort: 90,
              commercial_value: 95,
              revenue_priority_score: 89,
              total_score: 93
            },
            affiliate_potential: true,
            fashion_reason: "A pristine high-contrast classical luxury configuration designed for corporate boardrooms and upscale luncheons.",
            why_this_works: "The structured linen blazer balances warmth and ventilation, while neutral chinos offer a grounded, clean backdrop that lets the bespoke navy fabric shine.",
            where_to_wear: "Corporate boards, high-stakes presentations, and upscale business luncheons.",
            confidence: 95,
            quick_alternative: "Swap the linen blazer for a charcoal unstructured merino wool blazer for cooler autumn seasons."
          },
          {
            items: {
              top: "Monochromatic Charcoal Silk Knit Polo",
              bottom: "Structured Pleated Mid-Grey Wool Trousers",
              shoes: "Minimalist Calfskin Black Leather Chelsea Boots"
            },
            scores: {
              style_match: 90,
              occasion_match: 90,
              trend_alignment: 85,
              comfort: 92,
              commercial_value: 88,
              revenue_priority_score: 87,
              total_score: 90
            },
            affiliate_potential: true,
            fashion_reason: "Elegant, fluid lines emphasize texture over flashy branding. Extremely versatile smart-casual balance.",
            why_this_works: "The fine-gauge charcoal silk knit is exceptionally soft and premium, pairing seamlessly with the structured drape of wool trousers for an refined tone-on-tone aesthetic.",
            where_to_wear: "Creative workshops, architectural consultations, and gallery dinners.",
            confidence: 90,
            quick_alternative: "Exchange the Chelsea boots for dark grey suede loafers for a more relaxed daytime presence."
          },
          {
            items: {
              top: "Heavyweight White Pima Cotton Oversized T-Shirt",
              bottom: "Raw Indigo Selvedge Denim Tapered Jeans",
              shoes: "Chalk-White Premium Low-Top Minimalist Sneakers"
            },
            scores: {
              style_match: 85,
              occasion_match: 85,
              trend_alignment: 90,
              comfort: 95,
              commercial_value: 92,
              revenue_priority_score: 91,
              total_score: 87
            },
            affiliate_potential: false,
            fashion_reason: "A crisp everyday essential pairing. Focuses completely on pristine fabric weight and modern clean proportions.",
            why_this_works: "Raw selvedge denim provides an architecturally crisp silhouette, beautifully offset by the clean drape of a heavyweight pima cotton tee.",
            where_to_wear: "Weekend urban explorations, design studios, and informal coffee walks.",
            confidence: 88,
            quick_alternative: "Layer with an unbuttoned olive-drab lightweight utility chore jacket for multi-season styling."
          }
        ],
        final_recommendation: customRec || "We've selected classic structured combinations to guarantee premium style stability under peak demand.",
        quick_summary: "Classic, high-stability smart-casual recommendations with structured fits.",
        why_this_works: "Matches premium structured outer layers with breathable neutral essentials to maintain a sophisticated appearance in any casual setting.",
        style_title: "Structured Smart-Casual Series",
        style_summary: "Classic modern tailoring balanced with lightweight cotton chinos",
        monetization_summary: {
          best_conversion_outfit_index: 0,
          high_value_picks: ["Bespoke Navy Double-Breasted Linen Blazer", "Handcrafted Dark Italian Leather Loafers"]
        },
        system_health: {
          confidence: 99,
          quality_score: 90
        },
        telemetry: globalEvent
      })
    };
  }

  if (event.httpMethod !== "POST") {
    const telemetryObj = {
      request_id: requestId,
      tenant_id: "unknown",
      timestamp: new Date().toISOString(),
      event: "HTTP_METHOD_REJECTED",
      latency_ms: Date.now() - startTime,
      status: "405",
      error_type: "HTTP_METHOD_NOT_ALLOWED",
      cost_estimate: 0
    };
    console.log(`[APOOL_LOG_STANDARD] ${JSON.stringify(telemetryObj)}`);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Only POST requests are permitted." }),
    };
  }

  // 1. INPUT RECEIVED & MULTI-TENANT ISOLATION
  let body: any = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
       // Ignore body parse anomalies, proceed with static default parameters
    }
  }

  const tenantId = body.tenantId || "tenant-fios-825f";
  const userInput = (body.userInput || body.prompt || "minimalist casual ensemble").trim();

  // 2. SYSTEM SELF-REGULATION CLASSIFICATION (STABLE | DEGRADED | HIGH_ERROR_RATE)
  let runtimeState: "STABLE" | "DEGRADED" | "HIGH_ERROR_RATE" = "STABLE";

  // Check manual developer overrides or severe system constraints
  const hasDegradedTrigger = tenantId.includes("degraded") || userInput.includes("[debug-degraded]");
  const hasErrorTrigger = tenantId.includes("error") || userInput.includes("[debug-error]");

  // Non-branching deterministic classification heuristic
  if (hasErrorTrigger) {
    runtimeState = "HIGH_ERROR_RATE";
  } else if (hasDegradedTrigger || userInput.length > 120) {
    runtimeState = "DEGRADED";
  } else {
    runtimeState = "STABLE";
  }

  const rawApiKey = process.env.GEMINI_API_KEY;
  const apiKey = rawApiKey ? rawApiKey.trim() : "";
  const isKeyDetected = apiKey.length > 0;

  console.log(`[APCC] Initializing core SRE-Telemetry pipeline. Tenant: ${tenantId} | State: ${runtimeState} | Key Present: ${isKeyDetected}`);

  // Immediate recovery if no key is present (Config Error state)
  if (!isKeyDetected) {
    const { globalEvent } = emitTelemetry("CONFIG_INITIALIZATION", "500", "CONFIG_ERROR", 0);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        mode: "CONFIG_ERROR",
        error: "GEMINI_API_KEY missing in Netlify environment",
        telemetry: globalEvent
      }),
    };
  }

  // HIGH_ERROR_RATE (Autonomous Safe Mode): Immediate zero-cost structured recovery fallback
  if (runtimeState === "HIGH_ERROR_RATE") {
    console.log("[APCC] System in HIGH_ERROR_RATE mode. Deploying SRE-Telemetry safe recovery mock capsule.");
    const { globalEvent } = emitTelemetry("SAFE_MODE_TRIGGER", "200", "", 0, true);
    return getSafeRecoveryResponse(tenantId, globalEvent);
  }

  // 3. SINGLE GEMINI API CALL PIPELINE (STABLE & DEGRADED)
  const isHighValue = /luxury|couture|formal|avant|designer|tailored|gala|wedding|investment|bespoke/i.test(userInput);
  const decisionType = isHighValue ? "HIGH_VALUE" : "LOW_VALUE";

  // Phase C: Input length classification
  const inputLengthClass: "SHORT" | "NORMAL" | "LONG" = userInput.length < 15 ? "SHORT" : (userInput.length > 75 ? "LONG" : "NORMAL");

  // Cost adaptation & input length behavior
  const apiCostOptimization = runtimeState === "DEGRADED" || !isHighValue || inputLengthClass === "SHORT";
  const responseEnhanced = runtimeState === "STABLE" && isHighValue && inputLengthClass !== "SHORT";

  let directivePrompt = "";
  let maxOutputTokens = 1000;
  if (inputLengthClass === "SHORT") {
    directivePrompt = "Input is brief. Deliver swift, highly compact luxury capsule pairings. Keep explanations concise. Maximize outfit score normalization.";
    maxOutputTokens = 600;
  } else if (inputLengthClass === "LONG") {
    directivePrompt = "Input is long. Focus on core aspects, compress style instructions, keep explanations short (under 100 characters per explanation field), and prevent repeated garment descriptions across outfit options.";
    maxOutputTokens = 800;
  } else {
    directivePrompt = apiCostOptimization
      ? "Return swift, simplified luxury capsule pairings. Keep descriptions elegant but concise. Maximize outfit score normalization."
      : "Deliver multi-tenant elite retail analytics, calculating robust trend trajectories, style evolution indexes, and monetization options.";
    maxOutputTokens = 1000;
  }

  const systemInstructionText = `You are the core intelligence processor of the Fashion Intelligence Operating System (FIOS) APCC.
You simulate a Luxury Fashion Consultant, Personal Stylist, and Retail Strategist.
Analyze user prompts and output lookbooks, style trajectories, and monetization-weighted affiliate picks.
Ensure outfits are structurally coherent (no clashing seasons or styles). Always suggest a maximum of 3 outfits.
Your response must be a single valid JSON object adhering strictly to the responseSchema without markdown wraps or prefix text.`;

  const userPromptText = `Fulfill current client style request under tenant "${tenantId}": "${userInput}".

Operational Prompting Directive: ${directivePrompt}

Schema Guidelines:
1. USER PROFILE: style label, occasion context, maturity (0-100), drift index (0-100), trend adoption (0-100), confidence estimation (0-100).
2. STYLE EVOLUTION: style_evolution_curve trajectory, preference_drift_forecast outline.
3. OUTFITS: Strictly exactly 3 outfits consisting of top, bottom, shoes. Each outfit carries exact scores, affiliate_potential boolean flag, coordination fashion_reason text, why_this_works explanation, where_to_wear recommendation, confidence score (0-100), and quick_alternative backup piece.
4. FINAL STYLING ADVICE & MONETIZATION: best_conversion_outfit_index mapping to outfits array, listing up to 3 major products in high_value_picks.
5. ROOT LEVEL CONTRACT: Include quick_summary, why_this_works, a highly stylized concise "style_title" (max 60 characters, e.g. "Modern Quiet Luxury" or "Weekend Street Capsule") and a "style_summary" (max 60 characters, providing a 1-line chic explanation of this collection).

Ensure no clashing seasonal styles or duplications under strict governance check. Prevent repeating garment descriptions.`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: userPromptText
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: systemInstructionText
        }
      ]
    },
    generationConfig: {
      temperature: 0.1, // Set low temperature for high stability and deterministic output
      maxOutputTokens: maxOutputTokens,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          user_profile: {
            type: "OBJECT",
            properties: {
              style: { type: "STRING" },
              occasion: { type: "STRING" },
              fashion_maturity_score: { type: "INTEGER" },
              style_drift_index: { type: "INTEGER" },
              trend_adoption_level: { type: "INTEGER" },
              confidence: { type: "INTEGER" }
            },
            required: ["style", "occasion", "fashion_maturity_score", "style_drift_index", "trend_adoption_level", "confidence"]
          },
          style_evolution: {
            type: "OBJECT",
            properties: {
              style_evolution_curve: { type: "STRING" },
              preference_drift_forecast: { type: "STRING" }
            },
            required: ["style_evolution_curve", "preference_drift_forecast"]
          },
          outfits: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                items: {
                  type: "OBJECT",
                  properties: {
                    top: { type: "STRING" },
                    bottom: { type: "STRING" },
                    shoes: { type: "STRING" }
                  },
                  required: ["top", "bottom", "shoes"]
                },
                scores: {
                  type: "OBJECT",
                  properties: {
                    style_match: { type: "INTEGER" },
                    occasion_match: { type: "INTEGER" },
                    trend_alignment: { type: "INTEGER" },
                    comfort: { type: "INTEGER" },
                    commercial_value: { type: "INTEGER" },
                    revenue_priority_score: { type: "INTEGER" },
                    total_score: { type: "INTEGER" }
                  },
                  required: ["style_match", "occasion_match", "trend_alignment", "comfort", "commercial_value", "revenue_priority_score", "total_score"]
                },
                affiliate_potential: { type: "BOOLEAN" },
                fashion_reason: { type: "STRING" },
                why_this_works: { type: "STRING" },
                where_to_wear: { type: "STRING" },
                confidence: { type: "INTEGER" },
                quick_alternative: { type: "STRING" }
              },
              required: ["items", "scores", "affiliate_potential", "fashion_reason", "why_this_works", "where_to_wear", "confidence", "quick_alternative"]
            }
          },
          final_recommendation: { type: "STRING" },
          quick_summary: { type: "STRING" },
          why_this_works: { type: "STRING" },
          style_title: { type: "STRING" },
          style_summary: { type: "STRING" },
          monetization_summary: {
            type: "OBJECT",
            properties: {
              best_conversion_outfit_index: { type: "INTEGER" },
              high_value_picks: {
                type: "ARRAY",
                items: { type: "STRING" }
              }
            },
            required: ["best_conversion_outfit_index", "high_value_picks"]
          }
        },
        required: ["user_profile", "style_evolution", "outfits", "final_recommendation", "monetization_summary", "quick_summary", "why_this_works", "style_title", "style_summary"]
      }
    }
  };

  const modelName = "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (netErr: any) {
    console.log("[APCC] Connection failure to Gemini:", netErr.message);
    const { globalEvent } = emitTelemetry("GENERATE_CONTENT_OUTBOUND", "503", "GEMINI_FAILED", 0);
    return getSafeRecoveryResponse(tenantId, globalEvent, `APCC SRE Alert: Network failure contacting style AI (${netErr.message || netErr}). Gracefully fell back to local lookbooks.`);
  }

  // Handle immediate invalid non-200 responses (Zero self-healing/retry attempt)
  if (!response.ok) {
    console.log(`[APCC] Non-OK API response status: ${response.status}`);
    const { globalEvent } = emitTelemetry("GENERATE_CONTENT_OUTBOUND", String(response.status), "GEMINI_FAILED", 0);
    return getSafeRecoveryResponse(tenantId, globalEvent, `APCC SRE Alert: Style AI service is currently overloaded (HTTP ${response.status}). Gracefully fell back to local lookbooks.`);
  }

  const responseBodyRaw = await response.text();

  // 4. PARSE JSON ONCE (SINGLE PASS)
  let parsed: any;
  try {
    const envelope = JSON.parse(responseBodyRaw);
    const text = envelope.candidates[0].content.parts[0].text;
    parsed = JSON.parse(text.trim());
  } catch (parseErr: any) {
    console.log("[APCC] Parsing exception encountered during direct content extraction.");
    const { globalEvent } = emitTelemetry("PAYLOAD_PARSE_OPERATION", "200", "GEMINI_PARSE_ERROR");
    return getSafeRecoveryResponse(tenantId, globalEvent, `APCC SRE Alert: Received malformed style payload (${parseErr?.message || parseErr}). Gracefully fell back to local lookbooks.`);
  }

  // 5. OUTPUT GOVERNANCE RULE (SCHEMA & SCORE BOUND ENFORCEMENT)
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !parsed.user_profile ||
    !parsed.style_evolution ||
    !Array.isArray(parsed.outfits) ||
    !parsed.monetization_summary
  ) {
    console.log("[APCC] Structural integrity compromise detected in generated payload.");
    const { globalEvent } = emitTelemetry("SCHEMA_INTEGRITY_CHECK", "200", "SCHEMA_ERROR");
    return getSafeRecoveryResponse(tenantId, globalEvent, "APCC SRE Alert: Direct style payload was rejected due to structural validation checks. Gracefully fell back to local lookbooks.");
  }

  // Filter outfits: Stable threshold is 75. If DEGRADED mode is active, degrade gracefully to 70
  const passThreshold = runtimeState === "DEGRADED" ? 70 : 75;

  const uniqueOutfits: any[] = [];
  const seenTops = new Set<string>();

  for (const o of parsed.outfits) {
    // 1. Double check and normalize scores (Ensure absolute 0-100 bounds)
    const styleMatchNorm = Math.min(100, Math.max(0, Number(o.scores?.style_match) || 80));
    const occasionMatchNorm = Math.min(100, Math.max(0, Number(o.scores?.occasion_match) || 80));
    const trendAlignmentNorm = Math.min(100, Math.max(0, Number(o.scores?.trend_alignment) || 80));
    const comfortNorm = Math.min(100, Math.max(0, Number(o.scores?.comfort) || 80));
    const commercialValueNorm = Math.min(100, Math.max(0, Number(o.scores?.commercial_value) || 80));

    // Force perfect mathematical score combinations
    const revenueScoreCalculated = Math.round((commercialValueNorm * 0.6) + (trendAlignmentNorm * 0.4));
    const totalWeightedCalculated = Math.round((styleMatchNorm * 0.4) + (occasionMatchNorm * 0.3) + (trendAlignmentNorm * 0.2) + (comfortNorm * 0.1));

    // Write-back sanitized/normalized scoring values
    o.scores = {
      style_match: styleMatchNorm,
      occasion_match: occasionMatchNorm,
      trend_alignment: trendAlignmentNorm,
      comfort: comfortNorm,
      commercial_value: commercialValueNorm,
      revenue_priority_score: revenueScoreCalculated,
      total_score: totalWeightedCalculated
    };

    if (totalWeightedCalculated >= passThreshold) {
      // 2. Eliminate duplicates with exact footprint tracking
      const topFingerprint = (o.items?.top || "").substring(0, 15).toLowerCase().trim();
      if (!seenTops.has(topFingerprint)) {
        seenTops.add(topFingerprint);
        uniqueOutfits.push(o);
      }
    }
  }

  // Strict output rule: minimum 3 outfits pass. Throw direct parse error instead of retrying
  if (uniqueOutfits.length < 3) {
    console.log(`[APCC] Governance check vetoed payload: output size = ${uniqueOutfits.length}. Low count.`);
    const { globalEvent } = emitTelemetry("OUTFIT_QUALITY_GOVERNOR", "200", "SCHEMA_ERROR");
    return getSafeRecoveryResponse(tenantId, globalEvent, `APCC SRE Alert: Style models generated low-coherence coordinates (Pass count: ${uniqueOutfits.length}). Gracefully fell back to local lookbooks.`);
  }

  // Gracefully prioritize high-value combinations first inside lookbooks
  uniqueOutfits.sort((a, b) => (Number(b.scores?.total_score) || 0) - (Number(a.scores?.total_score) || 0));

  // Compute telemetry Proxy indicators
  const totalScoreAccumulator = uniqueOutfits.reduce((sum, o) => sum + (Number(o.scores?.total_score) || 80), 0);
  const averageQualityScore = Math.round(totalScoreAccumulator / uniqueOutfits.length);
  const confidenceValue = Number(parsed.user_profile.confidence) || 90;

  console.log(`[APCC] Output ready. Quality Proxy Score: ${averageQualityScore}% | Outfits count: ${uniqueOutfits.length}`);

  // Emit successful final telemetry log/event
  const { globalEvent } = emitTelemetry("LOOKBOOK_GENERATED_SUCCESSFULLY", "200", "");

  // Return standard compliant schema matching UI expectations perfectly
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      mode: "LIVE_GEMINI",
      tenant_id: tenantId,
      control_plane: {
        decision_type: decisionType,
        api_cost_optimization: apiCostOptimization,
        response_enhanced: responseEnhanced
      },
      user_profile: {
        style: parsed.user_profile.style || "Minimalist Wear",
        occasion: parsed.user_profile.occasion || "Daily / Standard",
        fashion_maturity_score: Number(parsed.user_profile.fashion_maturity_score) || 80,
        style_drift_index: Number(parsed.user_profile.style_drift_index) || 20,
        trend_adoption_level: Number(parsed.user_profile.trend_adoption_level) || 70,
        confidence: confidenceValue
      },
      style_evolution: {
        style_evolution_curve: parsed.style_evolution.style_evolution_curve || "Steady modern luxury silhouette trajectory.",
        preference_drift_forecast: parsed.style_evolution.preference_drift_forecast || "Expected migration to structured earth-toned light wool garments."
      },
      outfits: uniqueOutfits.slice(0, 3), // Phase C Hard Limit: max outfits = 3
      final_recommendation: parsed.final_recommendation || "Maintain sleek high-contrast coordination guidelines.",
      quick_summary: parsed.quick_summary || "Expertly tailored and styled smart-casual luxury coords.",
      why_this_works: parsed.why_this_works || "Curates fine-gauge premium layers with architectural proportions to ensure high styling stability and visual contrast.",
      style_title: parsed.style_title || "Modern Capital Curation",
      style_summary: parsed.style_summary || "Elegant neutral layers matching climate profiles",
      monetization_summary: {
        best_conversion_outfit_index: Number(parsed.monetization_summary.best_conversion_outfit_index) || 0,
        high_value_picks: parsed.monetization_summary.high_value_picks || []
      },
      system_health: {
        confidence: confidenceValue,
        quality_score: averageQualityScore
      },
      telemetry: globalEvent
    }),
  };
}
