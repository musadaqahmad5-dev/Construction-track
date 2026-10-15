import React, { useState, useEffect } from "react";
import { ShoppingBag, Sparkles, Tag, ArrowRight, ShieldCheck } from "lucide-react";

export interface OutfitBundleComponentSpec {
  id: string;
  category: string;
  color: string;
}

export interface ShoppableBundleDrawerProps {
  userId: string;
  currentOutfit: OutfitBundleComponentSpec[];
  weatherCondition: string;
  temperatureCelsius: number;
}

export interface BundledItem {
  id: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  sku: string;
  merchantDomain: string;
  matchedHarmonyColor: string;
}

export interface ShoppableBundleData {
  recommendedProducts: BundledItem[];
  retailPriceSum: number;
  appliedDiscountPercent: number;
  finalBundlePrice: number;
  currency: string;
  checkoutTraceId: string;
  generatedAt: string;
}

export const ShoppableBundleDrawer: React.FC<ShoppableBundleDrawerProps> = ({
  userId,
  currentOutfit,
  weatherCondition,
  temperatureCelsius
}) => {
  const [bundle, setBundle] = useState<ShoppableBundleData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOutfitBundle = async () => {
      if (!userId || !currentOutfit || currentOutfit.length === 0) {
        if (isMounted) setBundle(null);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("look_vision_token");
        const response = await fetch("/api/v1/commerce/bundle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ userId, currentOutfit, weatherCondition, temperatureCelsius })
        });

        if (response.status === 200) {
          const data = await response.json();
          const parsedBundle = data.payload?.bundle || data.bundle || (data.payload?.recommendedProducts ? data.payload : null);
          if (isMounted && data.success && parsedBundle) {
            setBundle(parsedBundle);
          } else if (isMounted) {
            setBundle(null);
          }
        } else {
          // HTTP 204 No Content or error maps to clean zero state
          if (isMounted) setBundle(null);
        }
      } catch (err) {
        console.error("[BUNDLE UI COMPILER FAILED]", err);
        if (isMounted) setBundle(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOutfitBundle();

    return () => {
      isMounted = false;
    };
  }, [currentOutfit, weatherCondition, temperatureCelsius, userId]);

  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-black/5 bg-[#FBFBFA] text-center text-xs font-mono text-[#878580] animate-pulse flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] animate-spin" />
        <span>Analyzing sartorial layout gaps and climatic harmonies...</span>
      </div>
    );
  }

  if (!bundle || !bundle.recommendedProducts || bundle.recommendedProducts.length === 0) {
    return null;
  }

  const handleCheckout = () => {
    window.dispatchEvent(
      new CustomEvent("lookvision_show_toast", {
        detail: {
          message: `Proceeding to checkout bundle (${bundle.checkoutTraceId}) with ${bundle.appliedDiscountPercent}% discount applied!`,
          type: "success"
        }
      })
    );
  };

  return (
    <div className="mt-6 border border-[#4F46E5]/20 bg-white p-6 font-sans text-[#1C1B1A] shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/5">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#4F46E5]" />
          <h4 className="text-lg font-serif font-bold">Complete the Look</h4>
        </div>
        <span className="bg-[#4F46E5] text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Save {bundle.appliedDiscountPercent}%
        </span>
      </div>

      <p className="text-xs text-[#575551] mb-4 leading-relaxed">
        Our intelligence layer detected climate gaps in your staging profile. Snag these harmonic partner boutique essentials as a curated completer set:
      </p>

      <div className="space-y-3">
        {bundle.recommendedProducts.map((product: BundledItem) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-[#F5F4F0] border border-black/5 hover:border-black/15 transition-all rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-12 h-16 object-cover rounded border border-black/5 shrink-0 bg-white"
              />
              <div>
                <h5 className="text-sm font-semibold text-[#1C1B1A] leading-tight">{product.title}</h5>
                <p className="text-xs text-[#878580] mt-0.5 font-mono">
                  {product.category} · Match:{" "}
                  <span className="font-semibold text-[#4F46E5]">{product.matchedHarmonyColor}</span>
                </p>
                <p className="text-[11px] text-[#878580] font-mono mt-0.5">{product.merchantDomain}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-mono font-bold text-[#1C1B1A]">
                ${product.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs text-[#878580] line-through font-mono">
            Retail Total: ${bundle.retailPriceSum}
          </div>
          <div className="text-xl font-black text-[#16A34A] flex items-baseline gap-1">
            <span className="text-xs font-mono font-normal text-[#878580]">Bundle Price:</span>{" "}
            ${bundle.finalBundlePrice}
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-[#1C1B1A] text-white px-6 py-3 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 rounded cursor-pointer shadow-sm"
        >
          <span>Instant Checkout Bundle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#878580] border-t border-black/5 pt-3">
        <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
        <span>Discount code cryptographically tracked via token proxy ledger hash definitions.</span>
      </div>
    </div>
  );
};
