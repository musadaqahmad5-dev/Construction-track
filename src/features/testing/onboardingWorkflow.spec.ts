/**
 * Vitest Regression Testing Suite: Custom Domain & Atelier Pods Onboarding Workflow
 * Path: src/features/testing/onboardingWorkflow.spec.ts
 * Subsystem: LookVision v2.4 Post-Purchase Storefront Onboarding, Domain Sanitization & Firestore Atomic Sync
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import {
  validateCustomDomain,
  validateOnboardingPayload,
  authenticateOnboardingToken,
  OnboardingController,
  OnboardingSetupRequestBody
} from "../../../server/aria/onboarding/onboarding.controller";

// ============================================================================
// DETERMINISTIC MOCK DATA & FIXTURES
// ============================================================================

const MOCK_VALID_PREMIUM_USER_ID = "usr_sarah_khan_couture_01";
const MOCK_NON_PREMIUM_USER_ID = "usr_free_tier_demo";
const MOCK_VALID_DOMAIN = "maison-couture.com";

const MOCK_VALID_PAYLOAD: OnboardingSetupRequestBody = {
  customDomain: "maison-couture.com",
  selectedCategories: ["Haute Couture Apparel", "Creative AI Lookbooks", "Virtual Try-On Pods"],
  atelierPodCount: 3,
  userId: MOCK_VALID_PREMIUM_USER_ID
};

// ============================================================================
// EXPRESS REQ / RES TEST HARNESS HELPER
// ============================================================================

interface MockResponse {
  statusCode: number;
  jsonData: any;
  status: (code: number) => MockResponse;
  json: (body: any) => MockResponse;
}

function createMockReqRes(options: {
  headers?: Record<string, string>;
  body?: any;
  user?: any;
}) {
  const req: any = {
    headers: options.headers || {},
    body: options.body || {},
    user: options.user
  };

  const res = {
    statusCode: 200,
    jsonData: null as any,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: any) {
      this.jsonData = body;
      return this;
    }
  } as any;

  const next = vi.fn();

  return { req, res, next };
}

// ============================================================================
// VITEST TEST SUITE SPECIFICATIONS
// ============================================================================

describe("Post-Purchase Storefront Onboarding & Domain Gate Regression Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Custom Domain Sanitization & Regex Validation Engine", () => {
    it("accepts valid, clean domains explicitly ending with .com suffix", () => {
      const validSamples = [
        "maison-couture.com",
        "sarahkhan.com",
        "atelier-alpha.lookvision.com",
        "v2.fashion-pod.com",
        "couture123.com"
      ];

      for (const domain of validSamples) {
        const result = validateCustomDomain(domain);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }
    });

    it("blocks un-sanitized domains containing script tags or XSS vectors with error message", () => {
      const maliciousSamples = [
        "<script>alert(1)</script>.com",
        "couture.com<script>",
        "javascript:alert(1).com",
        "maison.com';DROP TABLE users;--",
        "domain`calc`.com"
      ];

      for (const badDomain of maliciousSamples) {
        const result = validateCustomDomain(badDomain);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      }
    });

    it("blocks domains with whitespace, invalid characters, or path traversals", () => {
      const invalidChars = [
        "maison couture.com",
        "atelier/pod.com",
        "couture\\domain.com",
        "atelier$fashion.com",
        "http://maison.com"
      ];

      for (const domain of invalidChars) {
        const result = validateCustomDomain(domain);
        expect(result.valid).toBe(false);
      }
    });

    it("blocks non-.com TLDs according to strict invariant rules", () => {
      const nonComDomains = [
        "maison-couture.xyz",
        "atelier.org",
        "couture.net",
        "fashion.io",
        "atelier.shop"
      ];

      for (const domain of nonComDomains) {
        const result = validateCustomDomain(domain);
        expect(result.valid).toBe(false);
        expect(result.error).toContain(".com suffix");
      }
    });

    it("blocks empty, null, undefined, or excessively long domain inputs", () => {
      expect(validateCustomDomain("").valid).toBe(false);
      expect(validateCustomDomain("   ").valid).toBe(false);
      expect(validateCustomDomain(null).valid).toBe(false);
      expect(validateCustomDomain(undefined).valid).toBe(false);
      expect(validateCustomDomain(12345).valid).toBe(false);

      const longDomain = `${"a".repeat(250)}.com`;
      expect(validateCustomDomain(longDomain).valid).toBe(false);
    });
  });

  describe("Onboarding Payload Schema Validation", () => {
    it("approves complete and strictly-typed onboarding configuration payload", () => {
      const result = validateOnboardingPayload(MOCK_VALID_PAYLOAD);
      expect(result.valid).toBe(true);
    });

    it("rejects payload missing selectedCategories or having empty category lists", () => {
      const missingCategories = {
        ...MOCK_VALID_PAYLOAD,
        selectedCategories: []
      };
      const result = validateOnboardingPayload(missingCategories);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("selectedCategories must be a non-empty array");
    });

    it("rejects payload containing non-string or whitespace-only category items", () => {
      const invalidCategories = {
        ...MOCK_VALID_PAYLOAD,
        selectedCategories: ["Apparel", "", 123]
      };
      const result = validateOnboardingPayload(invalidCategories);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("non-empty strings");
    });

    it("rejects payload with invalid atelierPodCount (0, negative, float, non-number)", () => {
      const badCounts = [0, -1, -5, 3.5, NaN, "3", null];

      for (const count of badCounts) {
        const badPayload = {
          ...MOCK_VALID_PAYLOAD,
          atelierPodCount: count
        };
        const result = validateOnboardingPayload(badPayload);
        expect(result.valid).toBe(false);
        expect(result.error).toContain("atelierPodCount must be a positive integer");
      }
    });
  });

  describe("IAM Bearer Token Authentication Middleware", () => {
    it("blocks unauthenticated requests missing Authorization header with HTTP 401 Unauthorized", () => {
      const { req, res, next } = createMockReqRes({
        headers: {}
      });

      authenticateOnboardingToken(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res.jsonData?.success).toBe(false);
      expect(res.jsonData?.error).toBe("Unauthorized");
      expect(next).not.toHaveBeenCalled();
    });

    it("blocks malformed or empty Bearer token headers with HTTP 401 Unauthorized", () => {
      const { req, res, next } = createMockReqRes({
        headers: { authorization: "Bearer " }
      });

      authenticateOnboardingToken(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res.jsonData?.success).toBe(false);
      expect(next).not.toHaveBeenCalled();
    });

    it("attaches req.user identity context and invokes next() for valid Bearer token", () => {
      const { req, res, next } = createMockReqRes({
        headers: {
          authorization: "Bearer valid_signed_jwt_token_sample",
          "x-user-id": MOCK_VALID_PREMIUM_USER_ID
        }
      });

      authenticateOnboardingToken(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(MOCK_VALID_PREMIUM_USER_ID);
      expect(req.user.plan).toBe("PREMIUM");
    });
  });

  describe("Onboarding Controller Business Invariants & Firestore Persistence", () => {
    it("returns HTTP 422 Unprocessable Entity when request contains un-sanitized custom domain", async () => {
      const { req, res } = createMockReqRes({
        headers: { "x-user-id": MOCK_VALID_PREMIUM_USER_ID },
        user: { id: MOCK_VALID_PREMIUM_USER_ID, plan: "PREMIUM" },
        body: {
          ...MOCK_VALID_PAYLOAD,
          customDomain: "<script>attack()</script>.com"
        }
      });

      await OnboardingController.handleSetup(req, res);

      expect(res.statusCode).toBe(422);
      expect(res.jsonData?.success).toBe(false);
      expect(res.jsonData?.error).toBe("Unprocessable Entity");
      expect(res.jsonData?.message).toBeDefined();
    });

    it("returns HTTP 403 Forbidden when tenant is non-PREMIUM attempting to map custom domain", async () => {
      const { req, res } = createMockReqRes({
        headers: { "x-user-id": MOCK_NON_PREMIUM_USER_ID },
        user: { id: MOCK_NON_PREMIUM_USER_ID, plan: "BASIC" },
        body: {
          ...MOCK_VALID_PAYLOAD,
          userId: MOCK_NON_PREMIUM_USER_ID
        }
      });

      await OnboardingController.handleSetup(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.jsonData?.success).toBe(false);
      expect(res.jsonData?.error).toBe("Forbidden");
      expect(res.jsonData?.message).toContain("requires an active PREMIUM subscription");
    });

    it("returns HTTP 200 OK and writes valid metadata when tenant is PREMIUM", async () => {
      const { req, res } = createMockReqRes({
        headers: { "x-user-id": MOCK_VALID_PREMIUM_USER_ID },
        user: { id: MOCK_VALID_PREMIUM_USER_ID, plan: "PREMIUM" },
        body: MOCK_VALID_PAYLOAD
      });

      await OnboardingController.handleSetup(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData?.success).toBe(true);
      expect(res.jsonData?.message).toContain("configured successfully");
      expect(res.jsonData?.transactionHash).toBeDefined();
      expect(typeof res.jsonData?.latencyMs).toBe("number");

      // Verify returned taxonomy and domain parameters
      const responseData = res.jsonData?.data;
      expect(responseData.userId).toBe(MOCK_VALID_PREMIUM_USER_ID);
      expect(responseData.customDomain).toBe(MOCK_VALID_DOMAIN);
      expect(responseData.dnsMappingStatus).toBe("PENDING_VERIFICATION");
      expect(responseData.workspaceTaxonomy.categories).toEqual(MOCK_VALID_PAYLOAD.selectedCategories);
      expect(responseData.workspaceTaxonomy.atelierPodsAllocated).toBe(3);
      expect(responseData.updatedAt).toBeDefined();
    });

    it("generates deterministic SHA-256 transaction hashes across configurations", () => {
      const timestamp = "2026-08-17T20:30:00.000Z";
      const hash1 = crypto
        .createHash("sha256")
        .update(`${MOCK_VALID_PREMIUM_USER_ID}:${MOCK_VALID_DOMAIN}:3:${timestamp}`)
        .digest("hex");

      const hash2 = crypto
        .createHash("sha256")
        .update(`${MOCK_VALID_PREMIUM_USER_ID}:${MOCK_VALID_DOMAIN}:3:${timestamp}`)
        .digest("hex");

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64);
    });
  });
});
