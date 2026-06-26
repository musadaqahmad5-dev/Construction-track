import express from "express";
import path from "path";
import fs from "fs";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from "stripe";
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

  // Initialize Firebase Admin SDK
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "fashion-ai-56bd2";
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (getApps().length === 0) {
    let serviceAccount: any = null;

    if (serviceAccountVar) {
      const trimmed = serviceAccountVar.trim();

      // Case 1: Check if it's a file path to a JSON file
      if (fs.existsSync(trimmed)) {
        try {
          const fileContent = fs.readFileSync(trimmed, "utf-8").trim();
          if (fileContent.startsWith("{")) {
            serviceAccount = JSON.parse(fileContent);
            console.log("[Firebase Admin] Loaded service account from file path.");
          }
        } catch (err: any) {
          console.error("[Firebase Admin] Error reading service account file path:", err.message);
        }
      }

      // Case 2: Direct raw JSON string
      if (!serviceAccount && trimmed.startsWith("{")) {
        try {
          serviceAccount = JSON.parse(trimmed);
          console.log("[Firebase Admin] Loaded service account directly from raw JSON string.");
        } catch (err: any) {
          console.error("[Firebase Admin] Error parsing raw JSON string starting with {:", err.message);
        }
      }

      // Case 3: Wrapped in quotes (e.g. from environment variable quotes)
      if (!serviceAccount && (trimmed.startsWith('"') || trimmed.startsWith("'"))) {
        try {
          const unwrapped = JSON.parse(trimmed);
          if (typeof unwrapped === "string") {
            const innerTrimmed = unwrapped.trim();
            if (innerTrimmed.startsWith("{")) {
              serviceAccount = JSON.parse(innerTrimmed);
              console.log("[Firebase Admin] Loaded service account from double-quoted JSON string.");
            }
          }
        } catch (err: any) {
          console.error("[Firebase Admin] Error parsing double-quoted JSON string:", err.message);
        }
      }

      // Case 4: Base64-encoded JSON string
      if (!serviceAccount) {
        try {
          const decoded = Buffer.from(trimmed, "base64").toString("utf-8").trim();
          if (decoded.startsWith("{")) {
            serviceAccount = JSON.parse(decoded);
            console.log("[Firebase Admin] Loaded service account from base64-encoded string.");
          }
        } catch (err: any) {
          // Silent or verbose depending on context, we print fallback warning anyway if still null
        }
      }
    }

    try {
      if (serviceAccount) {
        initializeApp({
          credential: cert(serviceAccount),
          projectId,
        });
        console.log("[Firebase Admin] Initialized with Service Account.");
      } else {
        initializeApp({ projectId });
        console.log(`[Firebase Admin] Initialized automatically with default credentials / Project ID: ${projectId}`);
      }
    } catch (err: any) {
      console.error("[Firebase Admin Error] Initialization failed, trying default initialization:", err);
      try {
        initializeApp({ projectId });
      } catch (innerErr: any) {
        console.error("[Firebase Admin Error] Default initialization fallback also failed:", innerErr);
      }
    }
  }

  // Authentication middleware to protect API routes
  const verifyAuthToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn(`[Auth Blocking] Unauthorized anonymous access attempt blocked on ${req.method} ${req.path}`);
      res.status(401).json({ error: "Unauthorized: Missing or malformed authentication token" });
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      (req as any).user = decodedToken;
      next();
    } catch (err: any) {
      console.error(`[Auth Blocking] Token verification failed for ${req.method} ${req.path}:`, err.message);
      res.status(401).json({ error: "Unauthorized: Invalid or expired token: " + err.message });
    }
  };

  // Firestore-backed Quota Verification & Deduction
  const checkAndDeductQuota = async (userId: string, type: 'images' | 'recommendations'): Promise<{ allowed: boolean; remaining?: number; limit?: number; error?: string }> => {
    const db = getFirestore();
    const userRef = db.collection("users").doc(userId);

    try {
      const result = await db.runTransaction(async (transaction) => {
        const docSnap = await transaction.get(userRef);
        let tier = "free";
        let imagesUsed = 0;
        let recsUsed = 0;

        if (docSnap.exists) {
          const data = docSnap.data() || {};
          const sub = data.subscription || {};
          if (sub.tier) {
            tier = sub.tier.toLowerCase();
          }
          const quotaUsed = data.quotaUsed || {};
          imagesUsed = typeof quotaUsed.images === 'number' ? quotaUsed.images : 0;
          recsUsed = typeof quotaUsed.recommendations === 'number' ? quotaUsed.recommendations : 0;
        }

        // Quota rules:
        // Free: 5 image generations, 20 recommendations
        // Pro/Creator/Enterprise/Studio: 100 image generations, 300 recommendations
        let imageLimit = 5;
        let recLimit = 20;

        const isPro = ["pro", "studio", "creator", "enterprise"].includes(tier);
        if (isPro) {
          imageLimit = 100;
          recLimit = 300;
        }

        if (type === "images") {
          if (imagesUsed >= imageLimit) {
            return {
              allowed: false,
              remaining: 0,
              limit: imageLimit,
              error: `Quota exhausted: You have used ${imagesUsed}/${imageLimit} image generations. Please upgrade your subscription.`
            };
          }
          const newImagesUsed = imagesUsed + 1;
          transaction.set(userRef, {
            quotaUsed: {
              images: newImagesUsed
            },
            updatedAt: new Date()
          }, { merge: true });
          return { allowed: true, remaining: imageLimit - newImagesUsed, limit: imageLimit };
        } else {
          if (recsUsed >= recLimit) {
            return {
              allowed: false,
              remaining: 0,
              limit: recLimit,
              error: `Quota exhausted: You have used ${recsUsed}/${recLimit} recommendations. Please upgrade your subscription.`
            };
          }
          const newRecsUsed = recsUsed + 1;
          transaction.set(userRef, {
            quotaUsed: {
              recommendations: newRecsUsed
            },
            updatedAt: new Date()
          }, { merge: true });
          return { allowed: true, remaining: recLimit - newRecsUsed, limit: recLimit };
        }
      });

      return result;
    } catch (err: any) {
      console.error("[Quota Transaction Error]:", err);
      throw err;
    }
  };

  // --- STRIPE CONFIGURATION & INITIALIZATION ---
  let stripeClient: Stripe | null = null;
  const getStripe = (): Stripe => {
    if (!stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error("STRIPE_SECRET_KEY environment variable is missing");
      }
      stripeClient = new Stripe(key, {
        apiVersion: "2023-10-30" as any,
      });
    }
    return stripeClient;
  };

  // --- STRIPE WEBHOOK ---
  // Must use raw body parser before express.json()
  app.post(
    "/api/billing/webhook",
    express.raw({ type: "application/json" }),
    async (req: express.Request, res: express.Response) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event: Stripe.Event;

      try {
        const stripe = getStripe();
        if (webhookSecret && sig) {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
          console.warn("[Stripe Webhook] Warning: STRIPE_WEBHOOK_SECRET not configured. Parsing event without signature verification.");
          event = JSON.parse(req.body.toString());
        }
      } catch (err: any) {
        console.error(`[Stripe Webhook Error] Signature verification failed: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      console.log(`[Stripe Webhook] Received verified event: ${event.type}`);

      try {
        const db = getFirestore();

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.client_reference_id || session.metadata?.userId;
            const stripeCustomerId = session.customer as string;

            if (userId) {
              const db = getFirestore();
              if (session.metadata?.type === "product_purchase" || session.metadata?.productId) {
                // One-time garment purchase: write order to Firestore orders collection
                const orderPayload = {
                  userId: userId,
                  productId: session.metadata.productId,
                  productTitle: session.metadata.productTitle,
                  productPrice: Number(session.metadata.productPrice || 0),
                  productImageUrl: session.metadata.productImageUrl || "",
                  shopName: session.metadata.shopName || "Bespoke Atelier",
                  status: "confirmed",
                  timestamp: new Date(),
                  stripeSessionId: session.id
                };
                await db.collection("orders").add(orderPayload);
                console.log(`[Stripe Webhook] One-time product order created for user ${userId} / product ${session.metadata.productId}`);
              } else {
                // Subscription upgrade
                const tier = session.metadata?.tier || "pro";
                const stripeSubscriptionId = session.subscription as string;

                await db.collection("users").doc(userId).set({
                  subscription: {
                    tier: tier,
                    status: "active",
                    stripeCustomerId: stripeCustomerId || "",
                    stripeSubscriptionId: stripeSubscriptionId || "",
                  },
                  updatedAt: new Date(),
                }, { merge: true });
                console.log(`[Stripe Webhook] Set active subscription for user ${userId} to tier ${tier}`);
              }
            } else {
              console.warn("[Stripe Webhook] Checkout completed session does not have userId / client_reference_id.");
            }
            break;
          }

          case "customer.subscription.created":
          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeCustomerId = subscription.customer as string;
            const stripeSubscriptionId = subscription.id;
            const status = subscription.status; // active, trialing, past_due, canceled, unpaid, incomplete
            const tier = subscription.metadata?.tier || "pro";
            const userId = subscription.metadata?.userId;

            if (userId) {
              await db.collection("users").doc(userId).set({
                subscription: {
                  tier: tier,
                  status: status,
                  stripeCustomerId: stripeCustomerId || "",
                  stripeSubscriptionId: stripeSubscriptionId || "",
                },
                updatedAt: new Date(),
              }, { merge: true });
              console.log(`[Stripe Webhook] Updated subscription for user ${userId} to status ${status}`);
            } else {
              // Fallback: query by stripeCustomerId
              const usersRef = db.collection("users");
              const snapshot = await usersRef.where("subscription.stripeCustomerId", "==", stripeCustomerId).limit(1).get();
              if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const existingSub = userDoc.data().subscription || {};
                await userDoc.ref.set({
                  subscription: {
                    ...existingSub,
                    status: status,
                    stripeSubscriptionId: stripeSubscriptionId,
                  },
                  updatedAt: new Date(),
                }, { merge: true });
                console.log(`[Stripe Webhook] Updated subscription status for customer ${stripeCustomerId} (User ${userDoc.id}) to ${status}`);
              } else {
                console.warn(`[Stripe Webhook] No user found with stripeCustomerId: ${stripeCustomerId}`);
              }
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const stripeCustomerId = subscription.customer as string;
            const stripeSubscriptionId = subscription.id;

            const usersRef = db.collection("users");
            const snapshot = await usersRef.where("subscription.stripeCustomerId", "==", stripeCustomerId).limit(1).get();
            if (!snapshot.empty) {
              const userDoc = snapshot.docs[0];
              const existingSub = userDoc.data().subscription || {};
              await userDoc.ref.set({
                subscription: {
                  ...existingSub,
                  tier: "free",
                  status: "canceled",
                  stripeSubscriptionId: stripeSubscriptionId,
                },
                updatedAt: new Date(),
              }, { merge: true });
              console.log(`[Stripe Webhook] Subscription canceled for user ${userDoc.id}`);
            } else {
              console.warn(`[Stripe Webhook] No user found for deleted subscription customer: ${stripeCustomerId}`);
            }
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (err: any) {
        console.error(`[Stripe Webhook Processing Error]: ${err.message}`);
        res.status(500).json({ error: "Internal server error during webhook processing" });
      }
    }
  );

  // Middleware
  app.use(express.json({ limit: "15mb" })); // handle potential image base64 posts

  // API Routes (Registered FIRST)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.post("/api/log-client-error", (req, res) => {
    const errorData = req.body || {};
    // Keep server console clean and quiet from browser-side telemetry noise
    const cleanMsg = (errorData.message || "").replace(/[^a-zA-Z0-9\s:._-]/g, "");
    console.log(`[Client Diagnostic]: ${cleanMsg}`);
    res.json({ status: "logged" });
  });

  // Real Stripe Checkout Session API Route
  app.post("/api/billing/create-checkout-session", verifyAuthToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const { priceId, tier, successUrl, cancelUrl, productId, productTitle, productPrice, productImageUrl, shopName } = req.body;

      const stripe = getStripe();

      let stripeCustomerId: string | undefined;
      const db = getFirestore();
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.subscription?.stripeCustomerId) {
          stripeCustomerId = userData.subscription.stripeCustomerId;
        }
      }

      let sessionParams: Stripe.Checkout.SessionCreateParams;

      if (priceId && tier) {
        // --- Subscription Mode ---
        sessionParams = {
          mode: "subscription",
          payment_method_types: ["card"],
          client_reference_id: user.uid,
          customer: stripeCustomerId,
          customer_email: stripeCustomerId ? undefined : user.email,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: successUrl || `${req.headers.origin || "http://localhost:3000"}/?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${req.headers.origin || "http://localhost:3000"}/`,
          metadata: {
            userId: user.uid,
            tier: tier,
          },
          subscription_data: {
            metadata: {
              userId: user.uid,
              tier: tier,
            },
          },
        };
      } else if (productId) {
        // --- One-Time Product Purchase Mode ---
        sessionParams = {
          mode: "payment",
          payment_method_types: ["card"],
          client_reference_id: user.uid,
          customer: stripeCustomerId,
          customer_email: stripeCustomerId ? undefined : user.email,
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: productTitle || "Bespoke Garment",
                  images: productImageUrl ? [productImageUrl] : undefined,
                },
                unit_amount: Math.round(Number(productPrice || 0) * 100),
              },
              quantity: 1,
            },
          ],
          success_url: successUrl || `${req.headers.origin || "http://localhost:3000"}/?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
          cancel_url: cancelUrl || `${req.headers.origin || "http://localhost:3000"}/`,
          metadata: {
            userId: user.uid,
            productId: productId,
            productTitle: productTitle || "Bespoke Garment",
            productPrice: String(productPrice || 0),
            productImageUrl: productImageUrl || "",
            shopName: shopName || "Bespoke Atelier",
            type: "product_purchase",
          },
        };
      } else {
        res.status(400).json({ error: "Either (priceId and tier) or (productId, productTitle, and productPrice) must be provided." });
        return;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      res.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
      console.error("[Stripe Session Error]:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Production AI Stylist Pipeline
  app.post("/api/stylist/generate", verifyAuthToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const quotaCheck = await checkAndDeductQuota(user.uid, "recommendations");
      if (!quotaCheck.allowed) {
        res.status(403).json({ error: quotaCheck.error });
        return;
      }

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
  app.post("/api/ai/recommend", verifyAuthToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const quotaCheck = await checkAndDeductQuota(user.uid, "recommendations");
      if (!quotaCheck.allowed) {
        res.status(403).json({ error: quotaCheck.error });
        return;
      }

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
  app.post(["/api/ai/recommend-mvp", "/.netlify/functions/recommend-mvp"], verifyAuthToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const quotaCheck = await checkAndDeductQuota(user.uid, "recommendations");
      if (!quotaCheck.allowed) {
        res.status(403).json({ error: quotaCheck.error });
        return;
      }

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
  app.post("/api/ai/strategy", verifyAuthToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const quotaCheck = await checkAndDeductQuota(user.uid, "recommendations");
      if (!quotaCheck.allowed) {
        res.status(403).json({ error: quotaCheck.error });
        return;
      }

      const { title, category, description } = req.body;
      const strategy = await FashionAI.generateStylingStrategy(title, category, description);
      res.json({ strategy });
    } catch (err: any) {
      console.error("[API ERROR] Strategy generation failed:", err);
      res.status(500).json({ error: "Failed to generate styling strategy: " + err.message });
    }
  });

  // Vision Understanding Enpoint (Mocks vision tags)
  app.post("/api/ai/analyze-visual", verifyAuthToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const quotaCheck = await checkAndDeductQuota(user.uid, "recommendations");
      if (!quotaCheck.allowed) {
        res.status(403).json({ error: quotaCheck.error });
        return;
      }

      const { base64Image } = req.body;
      const result = await FashionAI.analyzeOutfitVisual(base64Image);
      res.json(result);
    } catch (err: any) {
      console.error("[API ERROR] Visual analysis failed:", err);
      res.status(500).json({ error: "Failed to analyze garment image: " + err.message });
    }
  });

  // Real Image Generation API Route
  app.post("/api/image-generation/generate", verifyAuthToken, async (req, res) => {
    try {
      const user = (req as any).user;
      const quotaCheck = await checkAndDeductQuota(user.uid, "images");
      if (!quotaCheck.allowed) {
        res.status(403).json({ error: quotaCheck.error });
        return;
      }

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
  app.post("/api/catalog/sync", verifyAuthToken, async (req, res) => {
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
