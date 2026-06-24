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
import { handler as recommendMvpHandler } from "./netlify/functions/recommend-mvp";

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

  app.post("/api/log-client-error", (req, res) => {
    const errorData = req.body || {};
    if (errorData.isScriptError || errorData.isExternal) {
      console.log("[CLIENT EXTERNAL/SCRIPT WARNING (IGNORED)]:", JSON.stringify(errorData));
    } else {
      console.log("[CLIENT TELEMETRY WARN]:", JSON.stringify(errorData, null, 2));
    }
    res.json({ status: "logged" });
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
  app.post(["/api/ai/recommend-mvp", "/.netlify/functions/recommend-mvp"], async (req, res) => {
    try {
      const event = {
        httpMethod: "POST",
        body: JSON.stringify(req.body),
        headers: req.headers,
      };
      
      const result = await recommendMvpHandler(event, {});
      
      // Propagate secure CORS and API response headers
      if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
          res.setHeader(key, value as string);
        });
      }
      
      res.status(result.statusCode || 200);
      try {
        const parsedBody = JSON.parse(result.body);
        res.json(parsedBody);
      } catch {
        res.send(result.body);
      }
    } catch (err: any) {
      console.error("[Express Gateway Bridge Error] Failed bridging to Netlify function:", err);
      res.status(500).json({ error: "SRE Gateway Bridge failure: " + err.message });
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
