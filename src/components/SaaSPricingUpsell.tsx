import React, { useState, useEffect, useCallback } from "react";
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Crown,
  Lock,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers,
  Flame,
  ArrowRight,
  TrendingUp,
  Globe2,
  Coins
} from "lucide-react";

// ============================================================================
// GLOBAL TYPE DECLARATIONS & SCRIPT EXTENSIONS
// ============================================================================

export interface LemonSqueezyEventHandlerData {
  event: string;
  data?: Record<string, unknown>;
}

export interface LemonSqueezyWindowInstance {
  Url?: {
    Open: (url: string) => void;
    Close?: () => void;
  };
  Setup?: (config?: {
    eventHandler?: (data: LemonSqueezyEventHandlerData) => void;
  }) => void;
  [key: string]: unknown;
}

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: LemonSqueezyWindowInstance;
  }
}

// ============================================================================
// STRICT DOMAIN TYPES & DATA CONTRACTS
// ============================================================================

export type SubscriptionTierCode = "STARTER" | "HAUTE_COUTURE" | "ATELIER";

export type BillingCycleMode = "monthly" | "yearly";

export interface PricingPlanSpec {
  id: string;
  tierCode: SubscriptionTierCode;
  variantIdMonthly: string;
  variantIdYearly: string;
  name: string;
  tagline: string;
  pricePKRMonthly: string;
  pricePKRYearly: string;
  priceUSDMonthly: string;
  tokensMonthly: number;
  highlightBadge?: string;
  isPopular: boolean;
  isEnterprise?: boolean;
  accentGradient: string;
  borderGlowColor: string;
  features: string[];
  specs: {
    closetCapacity: string;
    visionScanLatency: string;
    memoryDimensions: string;
    customStylesLimit: string;
  };
}

export interface CreateCheckoutApiPayload {
  variantId: string;
  userId: string;
  email: string;
  planTier: string;
  billingCycle: BillingCycleMode;
  customData?: {
    platform: string;
    source: string;
    currency: string;
  };
}

export interface CheckoutSuccessResponse {
  success: boolean;
  checkoutUrl?: string;
  url?: string;
  requestId?: string;
  payload?: {
    checkoutUrl?: string;
    variantId?: string;
    userId?: string;
    email?: string;
  };
  error?: string;
}

export interface UserStorageContext {
  userId?: string;
  id?: string;
  uid?: string;
  email?: string;
  name?: string;
  tier?: string;
}

export interface SaaSPricingUpsellProps {
  userId?: string;
  userEmail?: string;
  onCheckoutSuccess?: (tier: SubscriptionTierCode) => void;
  onClose?: () => void;
}

// ============================================================================
// CURATED TIER MATRICES (PAKISTAN RUPEE & GLOBAL ANCHORED)
// ============================================================================

const PRICING_PLANS: PricingPlanSpec[] = [
  {
    id: "plan_starter",
    tierCode: "STARTER",
    variantIdMonthly: "54321",
    variantIdYearly: "54322",
    name: "Prêt-à-Porter",
    tagline: "Essential AI fashion ingestion, smart wardrobe index & style baseline.",
    pricePKRMonthly: "Rs. 2,500",
    pricePKRYearly: "Rs. 24,000",
    priceUSDMonthly: "$9",
    tokensMonthly: 25000,
    isPopular: false,
    accentGradient: "from-zinc-400 to-zinc-600",
    borderGlowColor: "border-zinc-800",
    features: [
      "Up to 25 Digital Wardrobe Assets",
      "Multi-Modal Vision Scan & Tagging",
      "7-Day Delayed Trend Analytics Stream",
      "Standard Chat Stylist Access (30/mo)",
      "Instant Color Palette Extraction",
      "Local Encrypted Style Passport"
    ],
    specs: {
      closetCapacity: "25 Items",
      visionScanLatency: "~1.8s",
      memoryDimensions: "256-D Vector Index",
      customStylesLimit: "3 Style Profiles"
    }
  },
  {
    id: "plan_haute_couture",
    tierCode: "HAUTE_COUTURE",
    variantIdMonthly: "67890", // Standard Haute Couture premium tier index configuration placeholder
    variantIdYearly: "67891",
    name: "Haute Couture Pro",
    tagline: "Ultra-fast neural fashion intelligence, infinite closet & 3D avatar drape.",
    pricePKRMonthly: "Rs. 7,900",
    pricePKRYearly: "Rs. 75,900",
    priceUSDMonthly: "$29",
    tokensMonthly: 120000,
    highlightBadge: "MOST POPULAR",
    isPopular: true,
    accentGradient: "from-indigo-500 via-purple-500 to-pink-500",
    borderGlowColor: "border-indigo-500/40",
    features: [
      "Unlimited Digital Closet Capacity",
      "1536-Dimensional Semantic Memory Engine",
      "Sub-Second Multi-Modal Vision Inference",
      "Real-Time Macro Trend & Runway Stream",
      "Photorealistic 3D Virtual Try-On Engine",
      "Unlimited Bespoke AI Consultation Passes",
      "Exportable Sartorial Identity Badges",
      "Priority GPU Cluster Generation Pipeline"
    ],
    specs: {
      closetCapacity: "Unlimited Items",
      visionScanLatency: "<650ms",
      memoryDimensions: "1536-D Semantic Latent Space",
      customStylesLimit: "Unlimited Bespoke Looks"
    }
  },
  {
    id: "plan_atelier",
    tierCode: "ATELIER",
    variantIdMonthly: "89012",
    variantIdYearly: "89013",
    name: "Atelier Enterprise",
    tagline: "Dedicated model weights, white-label APIs & corporate studio management.",
    pricePKRMonthly: "Rs. 24,500",
    pricePKRYearly: "Rs. 235,000",
    priceUSDMonthly: "$89",
    tokensMonthly: 500000,
    highlightBadge: "ENTERPRISE GRADE",
    isPopular: false,
    isEnterprise: true,
    accentGradient: "from-amber-400 via-emerald-500 to-teal-400",
    borderGlowColor: "border-emerald-500/30",
    features: [
      "500,000 Monthly High-Precision AI Credits",
      "Dedicated Fine-Tuned Model Weights",
      "Direct White-Label 3D Garment Render API",
      "Multi-Seat Studio Collaboration Tools",
      "Custom ERP & Inventory Synchronization",
      "Dedicated Fashion Director SLA & Support",
      "Custom Fabric Texture Shaders & Physics"
    ],
    specs: {
      closetCapacity: "Enterprise Catalog",
      visionScanLatency: "<350ms Dedicated Pod",
      memoryDimensions: "Private Vector Cluster",
      customStylesLimit: "Multi-Brand Tenancy"
    }
  }
];

// ============================================================================
// MAIN PRODUCTION SAAS PRICING COMPONENT
// ============================================================================

export const SaaSPricingUpsell: React.FC<SaaSPricingUpsellProps> = ({
  userId: propUserId,
  userEmail: propUserEmail,
  onCheckoutSuccess,
  onClose
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycleMode>("monthly");
  const [loadingTier, setLoadingTier] = useState<SubscriptionTierCode | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [scriptBootError, setScriptBootError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeSuccessTier, setActiveSuccessTier] = useState<SubscriptionTierCode | null>(null);

  // --------------------------------------------------------------------------
  // DYNAMIC LOCAL STORAGE IDENTITY RESOLUTION
  // --------------------------------------------------------------------------
  const resolveUserIdentity = useCallback((): { resolvedUserId: string; resolvedEmail: string } => {
    let resolvedUserId = propUserId?.trim() || "";
    let resolvedEmail = propUserEmail?.trim() || "";

    if (typeof window !== "undefined") {
      try {
        const storedUserJson = localStorage.getItem("look_vision_user");
        if (storedUserJson) {
          const parsed: UserStorageContext = JSON.parse(storedUserJson);
          if (!resolvedUserId && (parsed.userId || parsed.id || parsed.uid)) {
            resolvedUserId = String(parsed.userId || parsed.id || parsed.uid).trim();
          }
          if (!resolvedEmail && parsed.email) {
            resolvedEmail = String(parsed.email).trim();
          }
        }
      } catch (e) {
        console.warn("[SaaSPricingUpsell] LocalStorage identity extraction bypassed safely:", e);
      }
    }

    if (!resolvedUserId) {
      resolvedUserId = "usr_sartorial_" + Math.random().toString(36).substring(2, 9);
    }
    if (!resolvedEmail) {
      resolvedEmail = "sartorialist@lookvision.ai";
    }

    return { resolvedUserId, resolvedEmail };
  }, [propUserId, propUserEmail]);

  // --------------------------------------------------------------------------
  // LEMON.JS SCRIPT LIFECYCLE INITIALIZATION
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const initializeLemonSqueezyOverlay = () => {
      try {
        if (typeof window !== "undefined") {
          if (window.LemonSqueezy) {
            if (isMounted) setScriptLoaded(true);
            window.LemonSqueezy.Setup?.({
              eventHandler: (eventData: LemonSqueezyEventHandlerData) => {
                if (eventData.event === "Checkout.Success") {
                  if (isMounted) {
                    setActiveSuccessTier("HAUTE_COUTURE");
                    if (onCheckoutSuccess) {
                      onCheckoutSuccess("HAUTE_COUTURE");
                    }
                  }
                  // Broadcast lightweight decoupled toast
                  window.dispatchEvent(
                    new CustomEvent("lookvision_show_toast", {
                      detail: {
                        message: "Subscription activated successfully! Welcome to Haute Couture Pro.",
                        type: "success"
                      }
                    })
                  );
                }
              }
            });
            return;
          }

          // Check if script is already present in document DOM
          const existingScript = document.getElementById("lemonsqueezy-js-sdk");
          if (existingScript) {
            if (isMounted) setScriptLoaded(true);
            return;
          }

          const script = document.createElement("script");
          script.id = "lemonsqueezy-js-sdk";
          script.src = "https://app.lemonsqueezy.com/js/lemon.js";
          script.async = true;
          script.defer = true;

          script.onload = () => {
            if (!isMounted) return;
            if (window.createLemonSqueezy) {
              window.createLemonSqueezy();
            }
            if (window.LemonSqueezy?.Setup) {
              window.LemonSqueezy.Setup({
                eventHandler: (eventData: LemonSqueezyEventHandlerData) => {
                  if (eventData.event === "Checkout.Success") {
                    setActiveSuccessTier("HAUTE_COUTURE");
                    if (onCheckoutSuccess) {
                      onCheckoutSuccess("HAUTE_COUTURE");
                    }
                  }
                }
              });
            }
            setScriptLoaded(true);
          };

          script.onerror = () => {
            if (!isMounted) return;
            console.warn("[LemonSqueezy SDK] Lemon.js external script failed to boot. Native fallback will be used.");
            setScriptBootError("Overlay initialization degraded. Falling back to direct checkout routing.");
            // Keep scriptLoaded false so fallback window.location.href or direct link opens cleanly
          };

          document.body.appendChild(script);
        }
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : String(err);
          setScriptBootError(msg);
        }
      }
    };

    initializeLemonSqueezyOverlay();

    return () => {
      isMounted = false;
    };
  }, [onCheckoutSuccess]);

  // --------------------------------------------------------------------------
  // CHECKOUT INITIATION & HANDSHAKE HANDLER
  // --------------------------------------------------------------------------
  const handleInitiateUpgrade = async (plan: PricingPlanSpec) => {
    try {
      setLoadingTier(plan.tierCode);
      setActionError(null);

      const { resolvedUserId, resolvedEmail } = resolveUserIdentity();
      const targetVariantId =
        billingCycle === "yearly" ? plan.variantIdYearly : plan.variantIdMonthly;

      // Extract authentication token if available
      let authToken: string | null = null;
      try {
        authToken = localStorage.getItem("look_vision_token");
      } catch {
        authToken = null;
      }

      const payload: CreateCheckoutApiPayload = {
        variantId: targetVariantId,
        userId: resolvedUserId,
        email: resolvedEmail,
        planTier: plan.tierCode,
        billingCycle,
        customData: {
          platform: "EAOS_LOOK_VISION",
          source: "saas_pricing_upsell_modal",
          currency: "PKR"
        }
      };

      // Call the authoritative server-side endpoint
      const response = await fetch("/api/v1/billing/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(
          errorBody.error ||
          errorBody.message ||
          `Gateway handshake failed with status ${response.status}.`
        );
      }

      const data: CheckoutSuccessResponse = await response.json();
      const checkoutUrl = data.checkoutUrl || data.url || data.payload?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("No secure checkout URL was returned by the billing gateway proxy.");
      }

      // Ensure embed parameter is preserved for overlay mode
      const formattedOverlayUrl = checkoutUrl.includes("embed=1")
        ? checkoutUrl
        : `${checkoutUrl}${checkoutUrl.includes("?") ? "&" : "?"}embed=1`;

      // Handshake: Trigger Lemon Squeezy overlay if available, else standard navigation
      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(formattedOverlayUrl);
      } else {
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Billing gateway connection timed out. Please retry.";
      console.error("[SaaSPricingUpsell] Upgrade flow encountered error:", err);
      setActionError(errorMsg);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div
      id="eaos-saas-pricing-matrix"
      className="relative w-full min-h-screen bg-[#05050a] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30 selection:text-white"
    >
      {/* Background Ambience & Grid Illumination */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-400 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>EAOS HAUTE COUTURE PLATFORM TIERS</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">PKR GATEWAY ACTIVE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Autonomous Fashion <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Intelligence at Scale
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Upgrade your digital sartorial workspace. Seamlessly connect to our 1536-D semantic style engine,
            photorealistic 3D avatar drapes, and high-throughput vision scanning.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <div className="relative flex items-center bg-[#07070c] p-1 rounded-xl border border-white/10 shadow-2xl">
              <button
                id="btn-billing-monthly"
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  billingCycle === "monthly"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>

              <button
                id="btn-billing-yearly"
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  billingCycle === "yearly"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Action Error Notice */}
          {actionError && (
            <div
              id="pricing-action-error-banner"
              className="mt-6 mx-auto max-w-md p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 text-left animate-in fade-in duration-300"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-300">Gateway Transaction Notice</p>
                <p className="text-xs text-red-300/80 mt-0.5 leading-relaxed">{actionError}</p>
              </div>
            </div>
          )}

          {/* Active Success Notification */}
          {activeSuccessTier && (
            <div
              id="pricing-success-banner"
              className="mt-6 mx-auto max-w-md p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-3 text-left animate-in fade-in duration-300"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-emerald-300">Subscription Confirmed</p>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Your account has been upgraded to Haute Couture Pro. All high-capacity features are unlocked.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {PRICING_PLANS.map((plan) => {
            const isTargetLoading = loadingTier === plan.tierCode;
            const displayPricePKR =
              billingCycle === "yearly" ? plan.pricePKRYearly : plan.pricePKRMonthly;

            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.tierCode.toLowerCase()}`}
                className={`relative flex flex-col justify-between rounded-2xl bg-[#06060c] border transition-all duration-300 hover:scale-[1.01] ${
                  plan.isPopular
                    ? "border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30"
                    : "border-white/5 hover:border-violet-500/20 hover:shadow-2xl"
                } p-6 sm:p-8`}
              >
                {/* Popular / Enterprise Highlight Badge */}
                {plan.highlightBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                    {plan.isPopular ? (
                      <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
                    ) : (
                      <Flame className="w-3 h-3 text-emerald-300" />
                    )}
                    <span>{plan.highlightBadge}</span>
                  </div>
                )}

                <div>
                  {/* Tier Title & Tagline */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                      <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                        {plan.priceUSDMonthly}/mo USD ref
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 min-h-[36px] leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 pb-6 border-b border-white/5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {displayPricePKR}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 uppercase">
                        /{billingCycle === "yearly" ? "yr" : "mo"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-emerald-400">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{plan.tokensMonthly.toLocaleString()} AI credits per cycle</span>
                    </div>
                  </div>

                  {/* Technical Spec Matrix */}
                  <div className="mb-6 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" /> Closet Limit:
                      </span>
                      <span className="font-mono text-zinc-200 font-semibold">{plan.specs.closetCapacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Vision Inference:
                      </span>
                      <span className="font-mono text-indigo-300 font-semibold">{plan.specs.visionScanLatency}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Style Latent Engine:
                      </span>
                      <span className="font-mono text-zinc-200 font-semibold">{plan.specs.memoryDimensions}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      INCLUDED CAPABILITIES:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                          <div className="mt-0.5 rounded-full p-0.5 bg-emerald-500/10 text-emerald-400 shrink-0 border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call-to-Action Checkout Trigger Button */}
                <div className="mt-6 pt-6 border-t border-white/5">
                  <button
                    id={`btn-upgrade-${plan.tierCode.toLowerCase()}`}
                    type="button"
                    onClick={() => handleInitiateUpgrade(plan)}
                    disabled={loadingTier !== null}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50"
                        : plan.isEnterprise
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                        : "bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {isTargetLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>INITIALIZING GATEWAY...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        <span>UPGRADE TO {plan.name}</span>
                        <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="mt-2.5 text-center flex items-center justify-center gap-1.5 text-[10px] font-mono text-zinc-400">
                    <Lock className="w-3 h-3 text-zinc-400" />
                    <span>Lemon Squeezy MoR • Instant Provisioning</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Security & Regulatory Trust Badges */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.01] border border-white/5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold text-zinc-200">Merchant of Record Security</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Fully compliant with international payment standards and automated VAT/tax handling.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.01] border border-white/5">
            <Globe2 className="w-6 h-6 text-indigo-400" />
            <h4 className="text-xs font-mono font-bold text-zinc-200">Pakistan & Global Payments</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Native PKR currency processing via Lemon Squeezy with local and international cards.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.01] border border-white/5">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h4 className="text-xs font-mono font-bold text-zinc-200">Real-Time Quota Allocation</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Instantaneous sub-second multi-tenant sync across Cloud Firestore & PostgreSQL cluster.
            </p>
          </div>
        </div>

        {/* Close/Dismiss Button if provided in modal contexts */}
        {onClose && (
          <div className="mt-12 text-center">
            <button
              id="btn-pricing-dismiss"
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors uppercase tracking-widest"
            >
              Return to Style Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaaSPricingUpsell;
