import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { FashionAI } from "./src/features/ai/fashionAI";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "15mb" })); // handle potential image base64 posts

  // API Routes (Registered FIRST)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Outfit Recommendation Endpoint
  app.post("/api/ai/recommend", async (req, res) => {
    try {
      const { wardrobe, condition, tempRange, vibe, agenda } = req.body;
      const result = await FashionAI.recommendOutfit(wardrobe, condition, tempRange, vibe, agenda);
      res.json(result);
    } catch (err: any) {
      console.error("[API ERROR] Recommendation failed:", err);
      res.status(500).json({ error: "Failed to process AI recommendation: " + err.message });
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
