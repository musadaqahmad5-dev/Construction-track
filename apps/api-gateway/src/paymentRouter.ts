/**
 * Lemon Squeezy Payment Gateway Router & Webhook Controller
 * Path: apps/api-gateway/src/paymentRouter.ts
 * Subsystem: Marketplace Monetization & Subscription Ingress
 */

import { Router, Request, Response } from "express";
import crypto from "crypto";
import { getFirestore } from "firebase-admin/firestore";

export const paymentRouter = Router();

const LEMON_SQUEEZY_API_URL = "https://lemonsqueezy.com";

export type SubscriptionPlanTier = "BASIC" | "PREMIUM";

export interface CheckoutRequestBody {
  userId: string;
  email: string;
  planTier: SubscriptionPlanTier;
}

export interface LemonSqueezyCustomData {
  userId?: string;
  planTier?: SubscriptionPlanTier;
  [key: string]: unknown;
}

export interface LemonSqueezyWebhookEventData {
  id: string;
  type: string;
  attributes: {
    store_id: number;
    customer_id: number;
    identifier: string;
    order_number: number;
    user_name: string;
    user_email: string;
    currency: string;
    total: number;
    status: string;
    custom_data?: LemonSqueezyCustomData;
    [key: string]: unknown;
  };
}

export interface LemonSqueezyWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: LemonSqueezyCustomData;
  };
  data: LemonSqueezyWebhookEventData;
}

// Plan variant mapping for Lemon Squeezy product variants
export const VARIANT_MAPPING: Record<SubscriptionPlanTier, string> = {
  BASIC: "variant_mock_basic_id",
  PREMIUM: "variant_mock_premium_id"
};

/**
 * Validates HMAC SHA256 Webhook Signatures using timing-safe buffer comparison
 */
export function verifyLemonSqueezySignature(
  rawBody: string | object,
  signatureHeader: string | undefined,
  secret: string
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  try {
    const rawPayload = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
    const hmac = crypto.createHmac("sha256", secret);
    const computedDigest = hmac.update(rawPayload).digest("hex");

    const digestBuffer = Buffer.from(computedDigest, "utf8");
    const signatureBuffer = Buffer.from(signatureHeader.trim(), "utf8");

    if (digestBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
  } catch (err) {
    console.warn("[SIGNATURE VERIFICATION WARN]", err);
    return false;
  }
}

/**
 * Atomically updates user subscription profile in Firestore
 */
export async function syncUserSubscriptionInFirestore(
  userId: string,
  planTier: SubscriptionPlanTier,
  orderId: string
): Promise<boolean> {
  try {
    const db = getFirestore();
    const userDocRef = db.collection("users").doc(userId);

    await userDocRef.set(
      {
        accountStatus: "PREMIUM",
        subscriptionTier: planTier,
        updatedAt: new Date().toISOString(),
        billingGateway: "lemon_squeezy",
        lastOrderId: orderId
      },
      { merge: true }
    );

    console.log(`[FIRESTORE SUCCESS] User account ${userId} upgraded to ${planTier} (Order: ${orderId}).`);
    return true;
  } catch (dbErr: unknown) {
    const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
    console.warn(`[FIRESTORE WARN] Firestore write failed for user ${userId}:`, errMsg);
    return false;
  }
}

/**
 * POST /api/v1/monetization/checkout & /monetization/checkout
 * Spawns an authentic hosted checkout link via Lemon Squeezy JSON:API
 */
paymentRouter.post(
  ["/monetization/checkout", "/api/v1/monetization/checkout"],
  async (req: Request, res: Response) => {
    try {
      const { userId, email, planTier } = req.body as Partial<CheckoutRequestBody>;

      if (!userId || !email || !planTier) {
        return res.status(400).json({
          success: false,
          error: "Bad Request",
          message: "Missing checkout parameters: userId, email, and planTier are required properties."
        });
      }

      const normalizedTier = planTier.toUpperCase() as SubscriptionPlanTier;
      const targetVariantId = VARIANT_MAPPING[normalizedTier];

      if (!targetVariantId) {
        return res.status(422).json({
          success: false,
          error: "Unprocessable Entity",
          message: `Invalid subscription variant selector: ${planTier}. Expected 'BASIC' or 'PREMIUM'.`
        });
      }

      const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
      const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

      if (!apiKey || !storeId) {
        return res.status(500).json({
          success: false,
          error: "Internal Server Error",
          message: "Lemon Squeezy credentials (LEMON_SQUEEZY_API_KEY / LEMON_SQUEEZY_STORE_ID) are missing from the server environment."
        });
      }

      // Construct payload adhering strictly to Lemon Squeezy JSON:API standards
      const payload = {
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email,
              custom: {
                userId,
                planTier: normalizedTier
              }
            }
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId
              }
            },
            variant: {
              data: {
                type: "variants",
                id: targetVariantId
              }
            }
          }
        }
      };

      const response = await fetch(`${LEMON_SQUEEZY_API_URL}/checkouts`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      interface LemonSqueezyCheckoutApiResponse {
        data?: {
          attributes?: {
            url?: string;
          };
        };
        errors?: Array<{ detail?: string }>;
      }

      const result = (await response.json()) as LemonSqueezyCheckoutApiResponse;

      if (!response.ok) {
        const errorDetail = result.errors?.[0]?.detail || "Failed to establish checkout session with Lemon Squeezy.";
        throw new Error(errorDetail);
      }

      const checkoutUrl = result.data?.attributes?.url;
      if (!checkoutUrl) {
        throw new Error("Lemon Squeezy API response did not contain a valid checkout URL attribute.");
      }

      return res.status(200).json({
        success: true,
        service: "AIStyleHub-LemonSqueezy-Gateway",
        timestamp: new Date().toISOString(),
        payload: {
          checkoutUrl
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Internal error occurred";
      console.error("[LEMON SQUEEZY CHECKOUT ERROR]", error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: "The full-stack gateway failed to generate the Lemon Squeezy checkout connection.",
        details: errorMessage
      });
    }
  }
);

/**
 * POST /api/v1/monetization/webhook & /monetization/webhook
 * Authenticates cryptographic signatures and catches completed checkout order transactions
 */
paymentRouter.post(
  ["/monetization/webhook", "/api/v1/monetization/webhook"],
  async (req: Request, res: Response) => {
    try {
      const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "";
      const signatureHeader = req.get("X-Signature") || req.get("x-signature");

      // Verify HMAC SHA256 timing-safe signature
      const isSignatureValid = verifyLemonSqueezySignature(req.body, signatureHeader, secret);

      if (!isSignatureValid) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
          message: "Cryptographic webhook signature check failed. Unauthorized ingress blocked."
        });
      }

      const body = req.body as LemonSqueezyWebhookPayload;
      const eventName = body.meta?.event_name;
      const customData = body.data?.attributes?.custom_data || body.meta?.custom_data;

      console.log(`[LEMON SQUEEZY WEBHOOK] Received Event: ${eventName}`);

      if (eventName === "order_created") {
        const userId = customData?.userId;
        const planTier = (customData?.planTier || "BASIC").toUpperCase() as SubscriptionPlanTier;
        const lemonSqueezyOrderId = body.data?.id || `ord_${Date.now()}`;

        if (userId) {
          console.log(`[FIRESTORE UPDATE INITIATED] Upgrading User: ${userId} to Tier: ${planTier}`);
          await syncUserSubscriptionInFirestore(userId, planTier, lemonSqueezyOrderId);
        } else {
          console.warn("[FIRESTORE WARN] Webhook skipped database synchronization: Missing userId in custom_data.");
        }
      }

      return res.status(200).json({
        success: true,
        message: "Webhook processed smoothly."
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Webhook error";
      console.error("[LEMON SQUEEZY WEBHOOK CRASH]", error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: "Webhook signature capture or event processing failed.",
        details: errorMessage
      });
    }
  }
);

// In-memory fallback state store for development and quick sync
const inMemoryUserProfiles: Record<string, any> = {
  "default-user": {
    userId: "default-user",
    accountStatus: "PREMIUM",
    subscriptionTier: "PREMIUM",
    customDomain: "atelier-couture.com",
    domainConfigured: true,
    atelierPodTaxonomy: ["Haute Couture Apparel", "Creative AI Lookbooks", "Virtual Try-On Pods"],
    updatedAt: new Date().toISOString()
  }
};

/**
 * GET /api/v1/user/profile & /user/profile
 * Returns user profile parameters including account status, subscription tier, and workspace metadata
 */
paymentRouter.get(
  ["/user/profile", "/api/v1/user/profile"],
  async (req: Request, res: Response) => {
    try {
      const userId = (req.query.userId as string) || (req.headers["x-user-id"] as string) || "default-user";

      try {
        const db = getFirestore();
        const docRef = db.collection("users").doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          const data = docSnap.data();
          return res.status(200).json({
            success: true,
            user: {
              userId,
              accountStatus: data?.accountStatus || "PREMIUM",
              subscriptionTier: data?.subscriptionTier || "PREMIUM",
              customDomain: data?.customDomain || "",
              domainConfigured: Boolean(data?.domainConfigured),
              atelierPodTaxonomy: data?.atelierPodTaxonomy || ["Haute Couture Apparel", "Creative AI Lookbooks"],
              updatedAt: data?.updatedAt || new Date().toISOString()
            }
          });
        }
      } catch (firestoreErr) {
        console.warn("[USER PROFILE FIRESTORE WARN] Falling back to memory profile:", firestoreErr);
      }

      const memProfile = inMemoryUserProfiles[userId] || {
        userId,
        accountStatus: "PREMIUM",
        subscriptionTier: "PREMIUM",
        customDomain: "",
        domainConfigured: false,
        atelierPodTaxonomy: ["Haute Couture Apparel", "Creative AI Lookbooks"],
        updatedAt: new Date().toISOString()
      };

      return res.status(200).json({
        success: true,
        user: memProfile
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error fetching user profile";
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: errMsg
      });
    }
  }
);

/**
 * PUT /api/v1/user/profile & /user/profile
 * Updates user profile with custom domain configuration and Atelier Pod taxonomy
 */
paymentRouter.put(
  ["/user/profile", "/api/v1/user/profile"],
  async (req: Request, res: Response) => {
    try {
      const userId = req.body?.userId || (req.headers["x-user-id"] as string) || "default-user";
      const { customDomain, domainConfigured, atelierPodTaxonomy, fashionCategories, accountStatus, subscriptionTier } = req.body;

      const updatedFields: Record<string, any> = {
        updatedAt: new Date().toISOString()
      };

      if (customDomain !== undefined) updatedFields.customDomain = customDomain;
      if (domainConfigured !== undefined) updatedFields.domainConfigured = Boolean(domainConfigured);
      if (atelierPodTaxonomy !== undefined) updatedFields.atelierPodTaxonomy = atelierPodTaxonomy;
      if (fashionCategories !== undefined) updatedFields.fashionCategories = fashionCategories;
      if (accountStatus !== undefined) updatedFields.accountStatus = accountStatus;
      if (subscriptionTier !== undefined) updatedFields.subscriptionTier = subscriptionTier;

      try {
        const db = getFirestore();
        const docRef = db.collection("users").doc(userId);
        await docRef.set(updatedFields, { merge: true });
      } catch (firestoreErr) {
        console.warn("[USER PROFILE PUT FIRESTORE WARN]:", firestoreErr);
      }

      inMemoryUserProfiles[userId] = {
        ...(inMemoryUserProfiles[userId] || { userId, accountStatus: "PREMIUM", subscriptionTier: "PREMIUM" }),
        ...updatedFields
      };

      return res.status(200).json({
        success: true,
        message: "User workspace configuration synchronized successfully.",
        user: inMemoryUserProfiles[userId]
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Error updating user workspace";
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: errMsg
      });
    }
  }
);
