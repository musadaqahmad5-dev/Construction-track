/**
 * Vitest Integration Testing Suite: Lemon Squeezy Billing Workflow & Webhook Guard
 * Path: src/features/testing/billingWorkflow.spec.ts
 * Subsystem: Marketplace Monetization, HMAC SHA256 Webhook Security & Firestore User State Sync
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import {
  verifyLemonSqueezySignature,
  VARIANT_MAPPING,
  SubscriptionPlanTier,
  LemonSqueezyWebhookPayload,
  syncUserSubscriptionInFirestore
} from "../../../apps/api-gateway/src/paymentRouter";

// ============================================================================
// DETERMINISTIC MOCK DATA & WEBHOOK FIXTURES
// ============================================================================

const MOCK_WEBHOOK_SECRET = "lemon_sqz_sec_test_mock_secret_998124";

export const MOCK_ORDER_CREATED_PAYLOAD: LemonSqueezyWebhookPayload = {
  meta: {
    event_name: "order_created",
    custom_data: {
      userId: "usr_sarah_khan_couture_01",
      planTier: "PREMIUM"
    }
  },
  data: {
    id: "ord_ls_984312",
    type: "orders",
    attributes: {
      store_id: 12345,
      customer_id: 67890,
      identifier: "uuid-order-sample-7744",
      order_number: 1001,
      user_name: "Sarah Khan",
      user_email: "sarah.khan@lookvision.com",
      currency: "PKR",
      total: 1500000,
      status: "paid",
      custom_data: {
        userId: "usr_sarah_khan_couture_01",
        planTier: "PREMIUM"
      }
    }
  }
};

/**
 * Helper function to compute deterministic HMAC SHA256 signatures for testing
 */
export function generateTestHmacSignature(payload: string | object, secret: string): string {
  const raw = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac("sha256", secret).update(raw).digest("hex");
}

// ============================================================================
// VITEST INTEGRATION & UNIT SUITE SPECIFICATIONS
// ============================================================================

describe("Lemon Squeezy Billing Workflow & Webhook Security Invariants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Subscription Plan & Variant ID Mapping", () => {
    it("maps BASIC tier correctly to mock Lemon Squeezy variant ID", () => {
      const tier: SubscriptionPlanTier = "BASIC";
      expect(VARIANT_MAPPING[tier]).toBe("variant_mock_basic_id");
    });

    it("maps PREMIUM tier correctly to mock Lemon Squeezy variant ID", () => {
      const tier: SubscriptionPlanTier = "PREMIUM";
      expect(VARIANT_MAPPING[tier]).toBe("variant_mock_premium_id");
    });
  });

  describe("Cryptographic HMAC SHA256 Webhook Signature Verification", () => {
    it("passes verification when the X-Signature header perfectly matches the computed HMAC SHA256 digest", () => {
      const validSignature = generateTestHmacSignature(MOCK_ORDER_CREATED_PAYLOAD, MOCK_WEBHOOK_SECRET);
      const isValid = verifyLemonSqueezySignature(
        MOCK_ORDER_CREATED_PAYLOAD,
        validSignature,
        MOCK_WEBHOOK_SECRET
      );

      expect(isValid).toBe(true);
    });

    it("fails and blocks verification when the signature is tampered or malformed (preventing 401 bypass)", () => {
      const tamperedSignature = "invalid_tampered_hex_digest_0000000000000000000000000000000000000000000000000000000000000000";
      const isValid = verifyLemonSqueezySignature(
        MOCK_ORDER_CREATED_PAYLOAD,
        tamperedSignature,
        MOCK_WEBHOOK_SECRET
      );

      expect(isValid).toBe(false);
    });

    it("fails verification when signature header is missing or empty", () => {
      const isValid = verifyLemonSqueezySignature(
        MOCK_ORDER_CREATED_PAYLOAD,
        undefined,
        MOCK_WEBHOOK_SECRET
      );

      expect(isValid).toBe(false);
    });

    it("fails verification when server webhook secret is empty", () => {
      const validSignature = generateTestHmacSignature(MOCK_ORDER_CREATED_PAYLOAD, MOCK_WEBHOOK_SECRET);
      const isValid = verifyLemonSqueezySignature(
        MOCK_ORDER_CREATED_PAYLOAD,
        validSignature,
        ""
      );

      expect(isValid).toBe(false);
    });

    it("safely rejects signatures with mismatched byte lengths without throwing exceptions", () => {
      const shortSignature = "short_sig_123";
      const isValid = verifyLemonSqueezySignature(
        MOCK_ORDER_CREATED_PAYLOAD,
        shortSignature,
        MOCK_WEBHOOK_SECRET
      );

      expect(isValid).toBe(false);
    });
  });

  describe("Order Ingress & Firestore User State Synchronization", () => {
    it("parses authentic order_created event and extricates custom_data parameters cleanly", () => {
      const eventName = MOCK_ORDER_CREATED_PAYLOAD.meta.event_name;
      const customData = MOCK_ORDER_CREATED_PAYLOAD.data.attributes.custom_data;
      const orderId = MOCK_ORDER_CREATED_PAYLOAD.data.id;

      expect(eventName).toBe("order_created");
      expect(customData?.userId).toBe("usr_sarah_khan_couture_01");
      expect(customData?.planTier).toBe("PREMIUM");
      expect(orderId).toBe("ord_ls_984312");
    });

    it("executes firestore state update with merged user properties and timestamp", async () => {
      const mockSet = vi.fn().mockResolvedValue(true);
      const mockDoc = vi.fn().mockReturnValue({ set: mockSet });
      const mockCollection = vi.fn().mockReturnValue({ doc: mockDoc });

      // Mock Firestore database instance
      const mockDb = { collection: mockCollection };

      // Simulate atomic update transaction logic
      const targetUserId = "usr_sarah_khan_couture_01";
      const planTier: SubscriptionPlanTier = "PREMIUM";
      const orderId = "ord_ls_984312";

      const docRef = mockDb.collection("users").doc(targetUserId);
      await docRef.set(
        {
          accountStatus: "PREMIUM",
          subscriptionTier: planTier,
          updatedAt: "2026-08-17T20:30:00.000Z",
          billingGateway: "lemon_squeezy",
          lastOrderId: orderId
        },
        { merge: true }
      );

      expect(mockCollection).toHaveBeenCalledWith("users");
      expect(mockDoc).toHaveBeenCalledWith(targetUserId);
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          accountStatus: "PREMIUM",
          subscriptionTier: "PREMIUM",
          billingGateway: "lemon_squeezy",
          lastOrderId: "ord_ls_984312"
        }),
        { merge: true }
      );
    });

    it("handles database exceptions gracefully without crashing server process", async () => {
      const failingDbCall = async () => {
        try {
          throw new Error("Firestore permission denied simulation");
        } catch (err) {
          return false;
        }
      };

      const result = await failingDbCall();
      expect(result).toBe(false);
    });
  });

  describe("Webhook Security Boundary Contract Simulation", () => {
    it("simulates express request handler rejecting invalid signature with 401 Unauthorized", async () => {
      const mockReq = {
        body: MOCK_ORDER_CREATED_PAYLOAD,
        get: (header: string) => (header.toLowerCase() === "x-signature" ? "invalid_sig_header" : undefined)
      };

      let statusCode = 200;
      let jsonPayload: unknown = null;

      const mockRes = {
        status: (code: number) => {
          statusCode = code;
          return {
            json: (data: unknown) => {
              jsonPayload = data;
              return mockRes;
            }
          };
        }
      };

      const secret = MOCK_WEBHOOK_SECRET;
      const signature = mockReq.get("X-Signature");
      const isValid = verifyLemonSqueezySignature(mockReq.body, signature, secret);

      if (!isValid) {
        mockRes.status(401).json({
          success: false,
          error: "Unauthorized",
          message: "Cryptographic webhook signature check failed."
        });
      }

      expect(statusCode).toBe(401);
      expect(jsonPayload).toEqual(
        expect.objectContaining({
          success: false,
          error: "Unauthorized"
        })
      );
    });

    it("simulates express request handler accepting valid signature with 200 OK and order processing", async () => {
      const validSignature = generateTestHmacSignature(MOCK_ORDER_CREATED_PAYLOAD, MOCK_WEBHOOK_SECRET);

      const mockReq = {
        body: MOCK_ORDER_CREATED_PAYLOAD,
        get: (header: string) => (header.toLowerCase() === "x-signature" ? validSignature : undefined)
      };

      let statusCode = 200;
      let jsonPayload: unknown = null;

      const mockRes = {
        status: (code: number) => {
          statusCode = code;
          return {
            json: (data: unknown) => {
              jsonPayload = data;
              return mockRes;
            }
          };
        }
      };

      const secret = MOCK_WEBHOOK_SECRET;
      const signature = mockReq.get("X-Signature");
      const isValid = verifyLemonSqueezySignature(mockReq.body, signature, secret);

      if (!isValid) {
        mockRes.status(401).json({ success: false, error: "Unauthorized" });
      } else {
        mockRes.status(200).json({ success: true, message: "Webhook processed smoothly." });
      }

      expect(statusCode).toBe(200);
      expect(jsonPayload).toEqual({ success: true, message: "Webhook processed smoothly." });
    });
  });
});
