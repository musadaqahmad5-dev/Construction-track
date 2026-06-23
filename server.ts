import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { FashionAI } from "./src/features/ai/fashionAI";
import { FashionOrchestrator } from "./src/core/FashionOrchestrator";
import { ImageGenerationRegistry } from "./src/features/image-generation/imageGenerationProvider";
import { FashionPromptBuilder } from "./src/features/image-generation/promptBuilder";
import { ImageStorage } from "./src/features/image-generation/imageStorage";
import { TrendAggregator } from "./src/features/live-trends/trendAggregator";
import { CatalogSync } from "./src/features/catalog/catalogSync";
import { RealityAudit } from "./src/features/reality/realityAudit";
import { UnifiedFashionOS } from "./src/features/ai-core/UnifiedFashionOS";

function parseTopOutfits(primary: any, alternatives: any[]): any[] {
  const list: any[] = [];
  if (primary) {
    list.push({
      id: primary.id || "primary-look",
      name: primary.name || "Default Curated Look",
      items: primary.items || [],
      suitabilityScore: primary.suitabilityScore || 90,
      explanation: primary.explanation || "Primary custom recommendations.",
      styleIdentity: primary.styleIdentity || "Slate Minimalist",
      gravityMatch: primary.gravityMatch || "High",
    });
  }
  
  alternatives.forEach((alt, idx) => {
    list.push({
      id: alt.id || `alt-look-${idx}`,
      name: alt.name || `Alternative Silhouette ${idx + 1}`,
      items: alt.items || [],
      suitabilityScore: alt.suitabilityScore ?? alt.score ?? 80,
      explanation: alt.explanation ?? alt.reason ?? "Expanded coordination options.",
      styleIdentity: alt.styleIdentity || "Smart Casual Blend",
      gravityMatch: alt.gravityMatch || "Medium",
    });
  });
  
  return list;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "15mb" })); // handle potential image base64 posts

  // API Routes (Registered FIRST)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Production AI Stylist Pipeline
  app.post("/api/stylist/generate", (req, res) => {
    try {
      const { wardrobe, userProfile } = req.body;
      const wardrobeItems = Array.isArray(wardrobe) ? wardrobe : [];
      
      // Seed wardrobe items to the global state (in-memory for this server request)
      if (wardrobeItems.length > 0) {
        UnifiedFashionOS.syncWardrobeItems(wardrobeItems);
      }
      
      // Seed user preference weights vector if provided
      if (userProfile?.user_preferences_vector) {
        UnifiedFashionOS.getState().unifiedStyleMemory.user_preferences_vector = userProfile.user_preferences_vector;
      }
      
      // Execute the completed 3-core engine layers
      UnifiedFashionOS.generateOutfit(wardrobeItems, "Today's Styled Spread");
      UnifiedFashionOS.recalculateGoLiveGate(); // triggers Governor Loop updates dynamically!
      
      const state = UnifiedFashionOS.getState();
      const currentSuggestion = state.activeSuggestion;
      
      // Gather top 10 suggestions (using alternativeOutfits array)
      const parsedAlternatives = state.alternativeOutfits || [];
      const suggestions = parseTopOutfits(currentSuggestion, parsedAlternatives);
      
      res.json({
        success: true,
        outfits: suggestions.slice(0, 10),
        styleIdentity: 'Balanced Slate Aesthetic',
        gravityMatch: 'High',
        stylistNotes: (currentSuggestion as any)?.explanation || 'A curated selection adapted for your temporal rhythm.',
        governorReport: state.systemGovernorReport
      });
    } catch (err: any) {
      console.error("[API ERROR] Stylist generation pipeline failed:", err);
      res.status(500).json({ error: "SaaS generation failed: " + err.message });
    }
  });

  // Outfit Recommendation Endpoint
  app.post("/api/ai/recommend", async (req, res) => {
    try {
      const { wardrobe, condition, tempRange, vibe, agenda, userId } = req.body;
      const result = await FashionOrchestrator.recommend({
        userId: userId || 'active_user',
        wardrobe,
        weatherCondition: condition,
        tempRange,
        vibe,
        agenda
      });
      res.json(result);
    } catch (err: any) {
      console.error("[API ERROR] Recommendation failed:", err);
      res.status(500).json({ error: "Failed to process AI recommendation: " + err.message });
    }
  });

  // --- CORE SYSTEM (Phase 1 & 2 FINAL MVP) ---
  app.post("/api/ai/recommend-mvp", async (req, res) => {
    try {
      const userInput = req.body.userInput || req.body.prompt || "casual chic look";
      
      // Dynamic fallbacks matching user search intents
      const text = userInput.toLowerCase();
      let fallbackType = "Casual Chic styling";
      let fallbackSeason = "All-season";
      let fallbackSuggestions = [
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

      if (!process.env.GEMINI_API_KEY) {
        console.log("[MVPPipeline] No GEMINI_API_KEY. Applying deterministic high-fidelity fallback matching user query:", userInput);
        return res.json({
          outfits: fallbackSuggestions,
          style_type: fallbackType,
          season: fallbackSeason,
          _mode: "offline-fallback"
        });
      }

      console.log("[MVPPipeline] Contacting Gemini for query:", userInput);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
              style_type: { type: Type.STRING, description: "E.g., Minimalist, High-Street, Vintage, Classic" },
              season: { type: Type.STRING, description: "E.g., Summer, All-Season, Spring/Summer" }
            },
            required: ["outfits", "style_type", "season"]
          }
        }
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error("Empty recommendation response from Gemini");
      }

      const parsed = JSON.parse(responseText);
      
      // Safety validation
      if (!parsed.outfits || !Array.isArray(parsed.outfits) || parsed.outfits.length === 0) {
        throw new Error("Invalid output layout returned by model schema controller");
      }

      // Pad suggestions to exactly 3 if we got fewer or more
      let finalOutfits = parsed.outfits.slice(0, 3);
      while (finalOutfits.length < 3) {
        finalOutfits.push(fallbackSuggestions[finalOutfits.length]);
      }

      return res.json({
        outfits: finalOutfits,
        style_type: parsed.style_type || fallbackType,
        season: parsed.season || fallbackSeason,
        _mode: "live-ai"
      });

    } catch (err: any) {
      console.error("[MVPPipeline Error] Failed live generation, reverting to fallback:", err);
      // Fallback is 100% stable matching response schema rule
      return res.json({
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
      });
    }
  });

  // Outfit Single Strategy Endpoint
  app.post("/api/ai/strategy", async (req, res) => {
    try {
      const { title, category, description } = req.body;
      const strategy = await FashionAI.generateStylingStrategy(title, category, description);
      res.json({ strategy });
    } catch (err: any) {
      console.error("[API ERROR] Strategy generation failed:", err);
      res.status(500).json({ error: "Failed to generate styling strategy: " + err.message });
    }
  });

  // Vision Understanding Enpoint (Mocks vision tags)
  app.post("/api/ai/analyze-visual", async (req, res) => {
    try {
      const { base64Image } = req.body;
      const result = await FashionAI.analyzeOutfitVisual(base64Image);
      res.json(result);
    } catch (err: any) {
      console.error("[API ERROR] Visual analysis failed:", err);
      res.status(500).json({ error: "Failed to analyze garment image: " + err.message });
    }
  });

  // Real Image Generation API Route
  app.post("/api/image-generation/generate", async (req, res) => {
    try {
      const { theme, vibe, garments, gender, formality, season, setting, provider } = req.body;
      
      const prompt = FashionPromptBuilder.buildOutfitPrompt({
        theme, vibe, garments, gender, formality, season, setting
      });

      const result = await ImageGenerationRegistry.generate(prompt, { aspectRatio: '3:4' }, provider);
      
      if (result.success && result.imageUrl) {
        // Save look to database history
        await ImageStorage.persistLook(result.imageUrl, {
          prompt,
          provider: result.provider,
          vibe,
          season,
          userId: 'anonymous-designer'
        });
      }

      res.json({ success: result.success, imageUrl: result.imageUrl, provider: result.provider, error: result.error });
    } catch (err: any) {
      console.error("[API ERROR] Image generation failed:", err);
      res.status(500).json({ error: "Failed to generate fashion image: " + err.message });
    }
  });

  // Real Live Trends Aggregation API Route
  app.get("/api/trends/live", async (req, res) => {
    try {
      const region = (req.query.region as string) || "US";
      const trends = await TrendAggregator.getLiveTrends(region);
      res.json({ trends });
    } catch (err: any) {
      console.error("[API ERROR] Trend gathering failed:", err);
      res.status(500).json({ error: "Failed to retrieve live fashion trends: " + err.message });
    }
  });

  // Real Merchant Catalog Sync API Route
  app.post("/api/catalog/sync", async (req, res) => {
    try {
      const syncedProducts = await CatalogSync.syncAllProviders();
      res.json({ success: true, count: syncedProducts.length, catalog: syncedProducts });
    } catch (err: any) {
      console.error("[API ERROR] Merchant catalog sync failed:", err);
      res.status(500).json({ error: "Failed to sync merchant catalogs: " + err.message });
    }
  });

  // Reality Audit System API Route
  app.get("/api/system/reality-audit", async (req, res) => {
    try {
      const report = RealityAudit.runAudit();
      res.json({ success: true, report });
    } catch (err: any) {
      console.error("[API ERROR] Reality audit execution failed:", err);
      res.status(500).json({ error: "Failed to compile reality audit: " + err.message });
    }
  });

  // Vite development integration or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fashion Server Hub] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
