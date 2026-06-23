import { GoogleGenAI, Type } from "@google/genai";

interface OutfitItem {
  title: string;
  description: string;
  reason: string;
  style: string;
  occasion: string;
}

export async function handler(event: any, context: any) {
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

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Only POST requests are permitted." }),
    };
  }

  try {
    let body: any = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (jsonErr) {
        console.error("Failed to parse request body:", jsonErr);
      }
    }

    const userInput = body.userInput || body.prompt || "casual chic look";
    const text = userInput.toLowerCase();

    // Default High-Fidelity Fallbacks
    let fallbackType = "Casual Chic styling";
    let fallbackSeason = "All-season";
    let fallbackSuggestions: OutfitItem[] = [
      {
        title: "The Minimalist Tonal Set",
        description: "Double-layered organic cotton jersey in Ecru matched with relaxed linen-blend dry-sage trousers.",
        reason: "Coordinates subtle, soft silhouettes with rich breathability for a timeless urban appearance.",
        style: "Minimalist Lounge",
        occasion: "Artisanal Cafe Stroll & Morning Gatherings"
      },
      {
        title: "The Structural Slate Cardigan",
        description: "An open front duster cardigan in heavyweight charcoal merino wool, layered over a ribbed silk tank and cream denim.",
        reason: "Provides elegant geometry and comforting insulation while maintaining strict, contemporary proportions.",
        style: "Sartorial Contrast",
        occasion: "Quiet Workspace & Creative Consultative Meetings"
      },
      {
        title: "The Raw Denim Indigo Layer",
        description: "Heavy raw selvage indigo trucker jacket paired with relaxed charcoal cotton chinos and minimalist gray leather trainers.",
        reason: "Implements classic structural weight with smart comfort, evoking clean heritage streetwear confidence.",
        style: "Utility Streetwear",
        occasion: "High Street Explorations & Weekend Leisure"
      }
    ];

    if (text.includes("wedding") || text.includes("marriage") || text.includes("gala") || text.includes("celebration") || text.includes("formal")) {
      fallbackType = "Elegant Tailored Formalwear";
      fallbackSeason = "Autumn / Winter & Spring / Summer";
      fallbackSuggestions = [
        {
          title: "The Midnight Silk-Lapel Tuxedo",
          description: "Deep midnight blue single-breasted wool-silk blend tuxedo jacket with satin-faced peak lapels, layered over a crisp sea-island cotton wingtip shirt.",
          reason: "Exudes pristine black-tie elegance with a subtle, luxurious color depth that stands out in formal evening atmospheres.",
          style: "Elite Evening Formal",
          occasion: "High-Formal Wedding Reception or Evening Gala"
        },
        {
          title: "Oatmeal Linen Signature Registry Look",
          description: "A relaxed structured double-breasted blazer and matched drapery trousers in organic oatmeal-color Belgian flax linen, layered over a collarless silk shirt.",
          reason: "Perfectly balances soft textures and breathable formal structure, offering effortless class and natural confidence.",
          style: "Modern Registry Smart-Casual",
          occasion: "Destination or Open-Air Garden Wedding Ceremony"
        },
        {
          title: "Crimson Silk Draped Silhouette",
          description: "An elegant asymmetrical draped midi-dress in liquid crimson mulberry silk, structured with precise shoulder tucks and accessorized with delicate hand-beaded cuffs.",
          reason: "Crafts a breathtaking visual statement utilizing premium, highly responsive fabrics that flow beautifully under event lighting.",
          style: "Editorial Cocktail",
          occasion: "Sunset Garden Soiree or Semi-Formal Wedding Reception"
        }
      ];
    } else if (text.includes("summer") || text.includes("beach") || text.includes("warm") || text.includes("resort") || text.includes("hot")) {
      fallbackType = "Relaxed Breeze styling";
      fallbackSeason = "Summer";
      fallbackSuggestions = [
        {
          title: "Warm Terracotta Sunseeker",
          description: "Lightweight premium Italian linen button-down in soft terracotta, paired with off-white relaxed drawstring linen shorts.",
          reason: "Maximizes thermal airflow while maintaining a crisp, warm-toned luxury resort look that elevates casual vacation aesthetics.",
          style: "Warm Resort Casual",
          occasion: "Coastal Beach Lounging & Sunset Seaside Dinner"
        },
        {
          title: "The Dry Sage Utility Set",
          description: "A breathable, boxy utility shirt in sage-green cotton-linen fabric with matching cargo shorts and premium natural cork-bed slide sandals.",
          reason: "Blends military-inspired functional pockets with ultra-comfortable lightweight textiles, making high-temperature street strolls effortless.",
          style: "High-Temperature Utility",
          occasion: "High Street Sightseeing & Open-Air Market Walks"
        },
        {
          title: "Ecru Silk-Cotton Knit Coordinates",
          description: "An open-knit sleeveless polo in ecru silk-cotton blend fabric, styled over thin cotton trousers in warm sand hues.",
          reason: "Applies elevated texture contrast to simple layouts, trapping air to keep the body ventilated during warm sunny agendas.",
          style: "Elevated Summer Beachwear",
          occasion: "Yacht Gatherings & Rooftop Summer Lounges"
        }
      ];
    } else if (text.includes("office") || text.includes("work") || text.includes("business") || text.includes("interview") || text.includes("formal look")) {
      fallbackType = "Polished Corporate Tailoring";
      fallbackSeason = "Autumn / Winter";
      fallbackSuggestions = [
        {
          title: "The Charcoal Drape Executive Suite",
          description: "A tailored, modern unstructured blazer in light slate charcoal drapery wool, worn over a pristine minimalist white poplin shirt.",
          reason: "Delivers an exceptionally sharp professional outline that is highly authoritative yet comfortable for long corporate workshops.",
          style: "Contemporary Business Formal",
          occasion: "Boardroom Presentations & Corporate Pitches"
        },
        {
          title: "The Olive Drab Smart Blouson",
          description: "A tailored wool-blend zip blouson in deep olive drab, layered over a black fine-gauge merino wool turtleneck and trousers.",
          reason: "Represents the highest level of modern creative-class workwear, combining sophisticated layering, warmth, and tailored restraint.",
          style: "Creative Executive Smart-Casual",
          occasion: "Quarterly Strategy Reviews & Client Dinners"
        },
        {
          title: "The Navy Double-Breasted Masterclass",
          description: "A structure-lined double-breasted navy blazer coupled with silver-gray flannel trousers and calfskin penny loafers.",
          reason: "A timeless Ivy-League design emphasizing structure and sartorial order, designed for maximum credibility and grace.",
          style: "Classical Corporate Powerhouse",
          occasion: "Keynote Speeches & High-Stakes Professional Interviews"
        }
      ];
    }

    // Log CORS Pre-flight Options requests
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.trim() : "";
    const isKeyDetected = apiKey.length > 0;

    const hasEnvKeys = Object.keys(process.env).length > 0;
    console.log(`ENV KEYS LOADED: ${hasEnvKeys ? "true" : "false"}`);
    console.log(`FUNCTION RUNTIME ENV READY: ${isKeyDetected ? "true" : "false"}`);
    console.log(`API key detected: ${isKeyDetected ? "true" : "false"}`);

    if (!isKeyDetected) {
      console.log("fallback activated reason: GEMINI_API_KEY environment variable is missing");
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          mode: "CONFIG_ERROR",
          error: "GEMINI_API_KEY missing in Netlify environment"
        }),
      };
    }

    console.log("Gemini request started");
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are a world-class AI Fashion Stylist and Haute Couture Designer.
Your task is to analyze user prompts and create exactly 3 beautiful, highly coordinated, production-ready outfit suggestions.
You must return a valid, well-structured JSON object adhering strictly to the provided responseSchema. No prose, no code fences.`;

    const userPrompt = `Generate a response for the user request: "${userInput}".
Make sure to produce 3 detailed, creative, fashion-forward suggestions on how to combine clothes. Each card must include:
- A descriptive title
- An elegant description specifying fabrics, textures, and cuts
- A clear styling reason illustrating why the clothing pairs well
- A style keyword (e.g. Minimalist, Streetwear Modern, Avant-Garde)
- An occasion of use (e.g. Summer Garden Party, Gala Event)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outfits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  style: { type: Type.STRING },
                  occasion: { type: Type.STRING }
                },
                required: ["title", "description", "reason", "style", "occasion"]
              },
              description: "List of exactly 3 outfit suggestions"
            },
            style_type: { type: Type.STRING },
            season: { type: Type.STRING }
          },
          required: ["outfits", "style_type", "season"]
        }
      }
    });

    console.log("Gemini response received");
    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Empty representation response received from backend");
    }

    const parsed = JSON.parse(responseText);
    
    if (!parsed.outfits || !Array.isArray(parsed.outfits) || parsed.outfits.length === 0) {
      throw new Error("Format of returned outfits was invalid");
    }

    // Standardize length
    let finalOutfits = parsed.outfits.slice(0, 3);
    while (finalOutfits.length < 3) {
      finalOutfits.push(fallbackSuggestions[finalOutfits.length]);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        outfits: finalOutfits,
        style_type: parsed.style_type || fallbackType,
        season: parsed.season || fallbackSeason,
        _mode: "live-ai"
      }),
    };

  } catch (err: any) {
    console.log(`[Netlify-MVPPipeline] fallback activated reason: ${err?.message || err}`);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        outfits: [
          {
            title: "The Springtime Oatmeal Blend",
            description: "Woven oatmeal-beige linen-cotton blend chore jacket draped over a vintage off-white tee and raw hemp denim.",
            reason: "Produces soft luxury textured alignment perfect for general daily transition styles.",
            style: "Casual Minimalist",
            occasion: "Morning Coffee Walk & Weekend Gallery Visits"
          },
          {
            title: "Dry Sage Oversized Coords",
            description: "Midweight loopback organic cotton sage sweatshirt matched with matching relaxed elastic-cropped trousers.",
            reason: "Optimizes loungewear silhouette density for cozy comfort and strict street styling.",
            style: "Streetwear loungewear",
            occasion: "Casual Lounge & Flight Travels"
          },
          {
            title: "Sartorial Charcoal Cardigan Layer",
            description: "Thick charcoal wool-blend structured cardigan worn buttoned with linen cream trousers and brown suede sliders.",
            reason: "Provides elegant volume and warmth while remaining soft and unconstrained.",
            style: "Relaxed Classic",
            occasion: "Creative Office Workspace & Studio Meetings"
          }
        ],
        style_type: "Casual Sartorial",
        season: "Spring / Autumn",
        _mode: "fallback-error"
      }),
    };
  }
}
