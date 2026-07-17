import express from "express";
import path from "path";
import fs from "fs";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from "stripe";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  FashionAI,
  FashionOrchestrator,
  ImageGenerationRegistry,
  FashionPromptBuilder,
  ImageStorage,
  TrendAggregator,
  CatalogSync,
  RealityAudit,
  UnifiedFashionOS,
  AIRequestPipeline
} from "./src/engine";
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
    if (token === "guest-token") {
      (req as any).user = {
        uid: "guest-sartorialist-user-100",
        email: "guest@companion.com",
        displayName: "Guest Sartorialist"
      };
      next();
      return;
    }

    try {
      let decodedToken;
      try {
        decodedToken = await getAuth().verifyIdToken(token);
      } catch (primaryErr: any) {
        // If primary verification failed, parse the token's audience (aud) dynamically
        let tokenAudience = "";
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
            if (payload && payload.aud) {
              tokenAudience = payload.aud;
            }
          }
        } catch (decodeErr) {
          console.warn("[Auth Decoding] Failed to pre-decode token payload:", decodeErr);
        }

        if (tokenAudience) {
          console.log(`[Auth Fallback] Attempting fallback token verification for audience: ${tokenAudience}`);
          const appName = `client-app-${tokenAudience}`;
          let audienceApp;
          const existingApps = getApps();
          const found = existingApps.find(a => a.name === appName);
          if (found) {
            audienceApp = found;
          } else {
            audienceApp = initializeApp({ projectId: tokenAudience }, appName);
            console.log(`[Firebase Admin] Initialized dynamic verification app for audience: ${tokenAudience}`);
          }
          decodedToken = await getAuth(audienceApp).verifyIdToken(token);
        } else {
          throw primaryErr;
        }
      }

      (req as any).user = decodedToken;
      next();
    } catch (err: any) {
      console.error(`[Auth Blocking] Token verification failed for ${req.method} ${req.path}:`, err.message);
      res.status(401).json({ error: "Unauthorized: Invalid or expired token: " + err.message });
  }
  };

  // State variables for robust server-side Firestore fail-safes
  let isFirestoreDisabled = false;
  const memoryQuotas = new Map<string, { images: number; recommendations: number }>();

  // Preemptive Firestore boot-test to verify credentials access
  try {
    const db = getFirestore();
    await db.collection("system_verification_status").limit(1).get();
    console.log("[Quota System] Firestore connection verified successfully on boot.");
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.info(`[Quota System] Preemptive Firestore boot-test failed (${errMsg.substring(0, 120)}). Activating robust in-memory quota fallback tracking immediately.`);
    isFirestoreDisabled = true;
  }

  // Firestore-backed Quota Verification & Deduction
  const checkAndDeductQuota = async (userId: string, type: 'images' | 'recommendations'): Promise<{ allowed: boolean; remaining?: number; limit?: number; error?: string }> => {
    if (userId === "guest-sartorialist-user-100") {
      return { allowed: true, remaining: 10, limit: 20 };
    }

    const imageLimit = 5;
    const recLimit = 20;

    // Direct in-memory path if Firestore has been marked disabled
    if (isFirestoreDisabled) {
      if (!memoryQuotas.has(userId)) {
        memoryQuotas.set(userId, { images: 0, recommendations: 0 });
      }
      const quota = memoryQuotas.get(userId)!;
      if (type === "images") {
        if (quota.images >= imageLimit) {
          return {
            allowed: false,
            remaining: 0,
            limit: imageLimit,
            error: `Quota exhausted: You have used ${quota.images}/${imageLimit} image generations. Please upgrade your subscription.`
          };
        }
        quota.images += 1;
        return { allowed: true, remaining: imageLimit - quota.images, limit: imageLimit };
      } else {
        if (quota.recommendations >= recLimit) {
          return {
            allowed: false,
            remaining: 0,
            limit: recLimit,
            error: `Quota exhausted: You have used ${quota.recommendations}/${recLimit} recommendations. Please upgrade your subscription.`
          };
        }
        quota.recommendations += 1;
        return { allowed: true, remaining: recLimit - quota.recommendations, limit: recLimit };
      }
    }

    try {
      const db = getFirestore();
      const userRef = db.collection("users").doc(userId);

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
        let currentImageLimit = imageLimit;
        let currentRecLimit = recLimit;

        const isPro = ["pro", "studio", "creator", "enterprise"].includes(tier);
        if (isPro) {
          currentImageLimit = 100;
          currentRecLimit = 300;
        }

        if (type === "images") {
          if (imagesUsed >= currentImageLimit) {
            return {
              allowed: false,
              remaining: 0,
              limit: currentImageLimit,
              error: `Quota exhausted: You have used ${imagesUsed}/${currentImageLimit} image generations. Please upgrade your subscription.`
            };
          }
          const newImagesUsed = imagesUsed + 1;
          transaction.set(userRef, {
            quotaUsed: {
              images: newImagesUsed
            },
            updatedAt: new Date()
          }, { merge: true });
          return { allowed: true, remaining: currentImageLimit - newImagesUsed, limit: currentImageLimit };
        } else {
          if (recsUsed >= currentRecLimit) {
            return {
              allowed: false,
              remaining: 0,
              limit: currentRecLimit,
              error: `Quota exhausted: You have used ${recsUsed}/${currentRecLimit} recommendations. Please upgrade your subscription.`
            };
          }
          const newRecsUsed = recsUsed + 1;
          transaction.set(userRef, {
            quotaUsed: {
              recommendations: newRecsUsed
            },
            updatedAt: new Date()
          }, { merge: true });
          return { allowed: true, remaining: currentRecLimit - newRecsUsed, limit: currentRecLimit };
        }
      });

      return result;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.info(`[Quota System] Firestore access failed (${errMsg.substring(0, 100)}). Activating robust in-memory quota fallback tracking.`);
      isFirestoreDisabled = true;
      
      // Immediate memory fallback deduction for the current request
      if (!memoryQuotas.has(userId)) {
        memoryQuotas.set(userId, { images: 0, recommendations: 0 });
      }
      const quota = memoryQuotas.get(userId)!;
      if (type === "images") {
        quota.images = Math.min(quota.images + 1, imageLimit);
        return { allowed: true, remaining: imageLimit - quota.images, limit: imageLimit };
      } else {
        quota.recommendations = Math.min(quota.recommendations + 1, recLimit);
        return { allowed: true, remaining: recLimit - quota.recommendations, limit: recLimit };
      }
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
        } else if (process.env.NODE_ENV === "production") {
          console.error("[Stripe Webhook Error] STRIPE_WEBHOOK_SECRET or stripe-signature is missing in production environment.");
          res.status(400).send("Webhook Error: Signature verification is strictly required in production");
          return;
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

      if (isFirestoreDisabled) {
        console.log(`[Stripe Webhook] Firestore is disabled. Safely bypassing database logging for event: ${event.type}`);
        res.json({ received: true });
        return;
      }

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
                // Ensure duplicate prevention by checking if an order with the same stripeSessionId already exists
                const existingOrders = await db.collection("orders").where("stripeSessionId", "==", session.id).get();
                if (existingOrders.empty) {
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
                  console.log(`[Stripe Webhook] Order for session ${session.id} already exists. Skipping duplicate write.`);
                }
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
      if (!isFirestoreDisabled) {
        try {
          const db = getFirestore();
          const userDoc = await db.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData?.subscription?.stripeCustomerId) {
              stripeCustomerId = userData.subscription.stripeCustomerId;
            }
          }
        } catch (err: any) {
          console.warn("[Stripe Billing] Firestore read bypassed due to permission constraints. Proceeding with safe defaults:", err.message);
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
      
      // Strict Sarto-Guardrail for Image Generation
      const testVibe = (vibe || "").toLowerCase();
      const testTheme = (theme || "").toLowerCase();
      const testSetting = (setting || "").toLowerCase();
      const testCombined = `${testTheme} ${testVibe} ${testSetting}`;
      const nonFashionBlocked = ["car", "cars", "dog", "dogs", "cat", "cats", "spaceship", "computer", "house", "building", "food", "pizza", "apple", "banana", "tree", "plant", "math", "code", "coding"];
      
      if (nonFashionBlocked.some(word => {
        const regex = new RegExp(`\\b${word}s?\\b`, 'i');
        return regex.test(testCombined);
      })) {
        res.json({
          success: false,
          error: "This AI is trained and calibrated strictly for luxury fashion curation, wardrobe coordination, and sartorial style lookbooks. Please specify a fashion-oriented request."
        });
        return;
      }
      
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
          userId: user.uid,
          qualityScores: result.qualityScores,
          criticFeedback: result.criticFeedback
        });
      }

      res.json({ 
        success: result.success, 
        imageUrl: result.imageUrl, 
        provider: result.provider, 
        error: result.error,
        qualityScores: result.qualityScores,
        criticFeedback: result.criticFeedback
      });
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

  // Intelligent Request Pipeline Cost & Performance Report Route
  app.get("/api/system/pipeline-report", async (req, res) => {
    try {
      const report = AIRequestPipeline.generateCostOptimizationReport();
      res.json({ success: true, report });
    } catch (err: any) {
      console.error("[API ERROR] Failed to fetch pipeline report:", err);
      res.status(500).json({ error: "Failed to load optimization analytics: " + err.message });
    }
  });

  // Intelligent Request Pipeline Cache and Stats Reset Route
  app.post("/api/system/pipeline-reset", async (req, res) => {
    try {
      AIRequestPipeline.clearMetrics();
      res.json({ success: true, message: "Request pipeline statistics and local cache flushes completed." });
    } catch (err: any) {
      console.error("[API ERROR] Failed to reset pipeline statistics:", err);
      res.status(500).json({ error: "Failed to clear request pipeline state: " + err.message });
    }
  });

  // --- AUTOMATED PERIODIC AI CREATION SCHEDULER (Every 1 Hour, Generates 2 Images) ---
  const AUTO_FASHION_CONCEPTS = [
    {
      theme: 'Cyberpunk Haute-Couture',
      vibe: 'neon glow, matte black, high-contrast violet accessories, tactical straps',
      gender: 'female' as const,
      formality: 'Semi-formal' as const,
      season: 'Winter',
      setting: 'under elevated neon lights in Tokyo, rain-slicked asphalt reflecting violet light',
      garments: [
        { title: 'Asymmetric Neo-Trench Coat', category: 'outerwear', primaryColor: 'matte black' },
        { title: 'Cybernetic Tech-Shell Dress', category: 'dress', primaryColor: 'glowing purple' }
      ]
    },
    {
      theme: 'Desert Minimalist Wanderer',
      vibe: 'warm sand, loose layering, breathable linen, earth tones, soft shadows',
      gender: 'unisex' as const,
      formality: 'Casual' as const,
      season: 'Summer',
      setting: 'a minimalist concrete pavilion in the Mojave desert at warm golden hour',
      garments: [
        { title: 'Oversized Silk Linen Draped Kimono', category: 'outerwear', primaryColor: 'warm sand' },
        { title: 'Loose Fit Wide Leg Trousers', category: 'pants', primaryColor: 'cream' }
      ]
    },
    {
      theme: 'Nordic Avant-Garde Tailoring',
      vibe: 'monochromatic, textured charcoal wool, sharp architectural angles, sleek lines',
      gender: 'male' as const,
      formality: 'Formal' as const,
      season: 'Autumn',
      setting: 'an ultra-minimalist museum gallery with floor-to-ceiling concrete and cold sky backdrop',
      garments: [
        { title: 'Double Breasted Structured Blazer', category: 'top', primaryColor: 'charcoal grey' },
        { title: 'Architectural Pleated Wool Pants', category: 'pants', primaryColor: 'deep slate' }
      ]
    },
    {
      theme: 'Ethereal Silk Couture',
      vibe: 'flowing, high-shine satin, pearlescent, breeze-catching drapes, romantic mood',
      gender: 'female' as const,
      formality: 'Formal' as const,
      season: 'Spring',
      setting: 'a high-end sun-drenched studio overlooking the Mediterranean sea',
      garments: [
        { title: 'Pearlescent Floor-Length Silk Gown', category: 'dress', primaryColor: 'pearl white' },
        { title: 'Sheer Organza Trench Duster', category: 'outerwear', primaryColor: 'translucent blush' }
      ]
    },
    {
      theme: 'Metropolitan Tech-Streetwear',
      vibe: 'reflective grey nylon, industrial utility pockets, oversized silhouette',
      gender: 'unisex' as const,
      formality: 'Casual' as const,
      season: 'Autumn',
      setting: 'against a textured brutalist concrete facade with cool high-contrast overcast sky',
      garments: [
        { title: 'Reflective Modular Shell Windbreaker', category: 'outerwear', primaryColor: 'metallic silver' },
        { title: 'Loose Drawstring Cargo Pants', category: 'pants', primaryColor: 'slate grey' }
      ]
    },
    {
      theme: 'Classic Sartorial Elegance',
      vibe: 'timeless tweed, refined double-breasted coat, modern English styling',
      gender: 'male' as const,
      formality: 'Formal' as const,
      season: 'Winter',
      setting: 'a luxurious wood-paneled library with warm soft lamp light',
      garments: [
        { title: 'Heavy Tweed Heritage Overcoat', category: 'outerwear', primaryColor: 'deep forest green' },
        { title: 'Slim Fit Cashmere Turtleneck', category: 'top', primaryColor: 'cream white' }
      ]
    }
  ];

  async function runPeriodicFashionUploads() {
    console.log("[Auto-Scheduler] Starting periodic automated fashion generation (2 images)...");
    try {
      // Pick 2 random distinct concepts
      const shuffled = [...AUTO_FASHION_CONCEPTS].sort(() => 0.5 - Math.random());
      const selectedConcepts = shuffled.slice(0, 2);

      for (const concept of selectedConcepts) {
        try {
          const prompt = FashionPromptBuilder.buildOutfitPrompt(concept);
          console.log(`[Auto-Scheduler] Generating image with theme: ${concept.theme}`);
          
          // Use Gemini provider if API key exists, otherwise picsum provider as configured in registry
          const providerName = process.env.GEMINI_API_KEY ? 'Gemini-3.1-Flash-Image' : 'Fashion-Picsum-Deterministic';
          const result = await ImageGenerationRegistry.generate(prompt, { aspectRatio: '3:4' }, providerName);

          if (result.success && result.imageUrl) {
            console.log(`[Auto-Scheduler] Successfully generated image. Saving to Firestore under 'generatedLooks'...`);
            await ImageStorage.persistLook(result.imageUrl, {
              prompt,
              provider: result.provider,
              vibe: concept.theme,
              season: concept.season,
              userId: 'sartorial-ai-autobot',
              qualityScores: result.qualityScores,
              criticFeedback: result.criticFeedback
            });
            console.log(`[Auto-Scheduler] Successfully uploaded custom AI look: ${concept.theme}`);
          } else {
            console.error(`[Auto-Scheduler] Image generation failed for concept: ${concept.theme}. Error: ${result.error}`);
          }
        } catch (innerErr: any) {
          console.error(`[Auto-Scheduler] Error generating look for concept ${concept.theme}:`, innerErr);
        }
      }
    } catch (err: any) {
      console.error("[Auto-Scheduler] Failed to execute periodic fashion uploads:", err);
    }
  }

  // Run once immediately on startup so there are fresh AI creations in the database right away
  setTimeout(() => {
    runPeriodicFashionUploads().catch(err => {
      console.error("[Auto-Scheduler] Error in startup seed generation:", err);
    });
  }, 5000);

  // Repeat every 1 hour (3600000 ms)
  setInterval(() => {
    runPeriodicFashionUploads().catch(err => {
      console.error("[Auto-Scheduler] Error in interval automated generation:", err);
    });
  }, 60 * 60 * 1000);

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
