import React, { useState } from 'react';
import { UnifiedFashionOS } from '../features/ai-core/UnifiedFashionOS';
import { BillingService } from '../features/monetization/billingService';

interface SaaSPricingUpsellProps {
  featureName: string;
  icon: React.ReactNode;
}

export const SaaSPricingUpsell: React.FC<SaaSPricingUpsellProps> = ({ featureName, icon }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setErrorMsg(null);
    try {
      // Initiate Stripe billing subscription session for "Pro" tier
      await BillingService.startSubscriptionCheckout({
        priceId: 'price_pro_subscription', // Default configured price identifier for subscription tier
        tier: 'Pro'
      });
    } catch (err: any) {
      console.error("[SaaS Upgrade Error]:", err);
      setErrorMsg(err.message || "Stripe checkout redirection failed. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="bg-[#121212] border border-white/8 rounded-2xl p-10 text-center space-y-6 max-w-xl mx-auto shadow-sm my-4" id="saas-upsell-container">
      <div className="w-16 h-16 bg-white/5 text-white rounded-2xl mx-auto flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-3 max-w-md mx-auto">
        <h3 className="font-serif font-black text-2xl text-white font-medium tracking-tight">Thoughtful spaces require preparation</h3>
        <p className="text-xs text-white/50 leading-relaxed font-light">
          Planners and custom preference metrics help support the continuous independent design of Wardrobe Companion.
        </p>
      </div>

      <div className="bg-[#181818] p-6 rounded-2xl border border-white/8 flex flex-col sm:flex-row items-center justify-between text-left gap-4">
        <div>
          <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 py-1 px-3 text-white/60 font-semibold rounded-full tracking-wider">Premium Access</span>
          <h4 className="font-bold font-serif text-white text-sm mt-2">Unlock Planning Spaces</h4>
        </div>
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold py-3.5 px-6 rounded-xl uppercase tracking-wider cursor-pointer transition-all shrink-0 w-full sm:w-auto text-center disabled:opacity-50"
        >
          {isUpgrading ? "Redirecting..." : "Try Premium Free"}
        </button>
      </div>
      {errorMsg && (
        <p className="text-red-400 font-mono text-[10px] uppercase tracking-wide mt-2">{errorMsg}</p>
      )}
    </div>
  );
};

