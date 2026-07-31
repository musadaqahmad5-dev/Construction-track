import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  X, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  Gem
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelected?: (planId: string) => void;
  currentPlanId?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onPlanSelected,
  currentPlanId = 'FREE'
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<string>(currentPlanId);
  const [creditBalance, setCreditBalance] = useState<number>(200);
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSubscriptionStatus();
    }
  }, [isOpen]);

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription/status', {
        headers: {
          'x-user-id': 'guest-sartorialist-user-100'
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.subscription) {
          setActivePlan(json.data.subscription.planId || 'FREE');
          setCreditBalance(json.data.subscription.creditBalance ?? 200);
        }
      }
    } catch (err) {
      console.warn('[PricingModal] Failed to load subscription status:', err);
    }
  };

  if (!isOpen) return null;

  const plans = [
    {
      id: 'FREE',
      name: 'Sartorial Essentials',
      tagline: 'Core AI fashion tools for enthusiasts & style explorers',
      monthlyPrice: 0,
      yearlyPrice: 0,
      credits: '200 / mo',
      badge: 'Free Tier',
      badgeColor: 'border-white/10 bg-white/5 text-zinc-300',
      icon: Sparkles,
      features: [
        '200 Monthly AI Fashion Credits',
        'Standard Fashion Intelligence Engine',
        'Basic 2D Virtual Try-On Overlay',
        'Digital Wardrobe (Up to 25 items)',
        'Public Community & Feed Access'
      ]
    },
    {
      id: 'PREMIUM',
      name: 'Style Studio Pro',
      tagline: 'High-definition 4K fashion AI & photorealistic 3D try-on pipeline',
      monthlyPrice: 29,
      yearlyPrice: 24, // $290/yr ($24/mo)
      credits: '2,000 / mo',
      badge: 'Most Popular',
      isPopular: true,
      badgeColor: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
      icon: Zap,
      features: [
        '2,000 Monthly AI Fashion Credits',
        'High-Resolution 4K Fashion Rendering',
        'Photorealistic 3D Virtual Try-On Pipeline',
        'Mature Fashion Studio & Couture AI',
        'Style DNA & Deep Persona Profiling',
        'Unlimited Wardrobe Storage',
        'Priority Generation Queue'
      ]
    },
    {
      id: 'CREATOR_PRO',
      name: 'Creator Operating System',
      tagline: 'Launch digital atelier collections & run marketplace fashion commerce',
      monthlyPrice: 79,
      yearlyPrice: 65, // $790/yr ($65/mo)
      credits: '10,000 / mo',
      badge: 'Creator Special',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      icon: Crown,
      features: [
        '10,000 Monthly AI Fashion Credits',
        'Full Marketplace Seller Studio & Digital Commerce',
        'Custom Brand Collection Publishing',
        '0% Commission on Digital Sales',
        'Creator Reputation & Verification Badge',
        'Video Fashion Runway Generation',
        'Audience Analytics & Follower Broadcasts'
      ]
    },
    {
      id: 'ENTERPRISE',
      name: 'Fashion House Enterprise',
      tagline: 'Bespoke AI style models, white-label APIs & custom brand fine-tuning',
      monthlyPrice: 299,
      yearlyPrice: 249, // $2990/yr ($249/mo)
      credits: '50,000 / mo',
      badge: 'Haute Couture',
      badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      icon: Gem,
      features: [
        '50,000 Monthly AI Fashion Credits',
        'Dedicated Fine-Tuned Model Weights',
        'White-Label 3D Garment Render API',
        'Dedicated Account Strategist & SLA',
        'Custom ERP & Inventory Sync',
        'Multi-user Studio Team Management'
      ]
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setLoadingPlan(planId);
    setMessage(null);

    try {
      // Trigger checkout API powered by Lemon Squeezy adapter
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'guest-sartorialist-user-100'
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          providerId: 'lemonsqueezy'
        })
      });

      const json = await res.json();

      if (json.success && json.data?.checkoutUrl) {
        // If simulation or direct activation, also trigger local upgrade
        const upgradeRes = await fetch('/api/subscription/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'guest-sartorialist-user-100'
          },
          body: JSON.stringify({ planId })
        });

        if (upgradeRes.ok) {
          setActivePlan(planId);
          setMessage({
            type: 'success',
            text: `Successfully upgraded to ${planId} plan via Lemon Squeezy architecture.`
          });
          if (onPlanSelected) onPlanSelected(planId);
        }
      } else {
        setMessage({
          type: 'error',
          text: json.error || 'Failed to initiate checkout.'
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Connection error.'
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleTopup = async (packageId: string) => {
    setTopupLoading(true);
    try {
      const res = await fetch('/api/credits/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'guest-sartorialist-user-100'
        },
        body: JSON.stringify({ packageId })
      });
      if (res.ok) {
        const json = await res.json();
        setCreditBalance(json.data.newBalance);
        setMessage({
          type: 'success',
          text: `Credit top-up applied! New balance: ${json.data.newBalance.toLocaleString()} credits.`
        });
        setTopupModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#07070c] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-zinc-100 my-8">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            LOOK VISION Monetization Architecture
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Elevate Your AI Fashion Intelligence
          </h2>
          <p className="text-zinc-400 text-sm md:text-base">
            Select a subscription tier powered by our provider-agnostic Lemon Squeezy payment engine.
          </p>

          {/* Credit Balance & Top-Up Bar */}
          <div className="mt-4 inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Available AI Credits: <strong className="text-white font-mono text-sm">{creditBalance.toLocaleString()}</strong></span>
            </div>
            <button
              onClick={() => setTopupModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-medium text-xs transition-colors"
            >
              + Top-Up Credits
            </button>
          </div>

          {/* Notification Alert */}
          {message && (
            <div className={`mt-4 p-3 rounded-xl border text-xs text-left max-w-xl mx-auto flex items-start gap-2 ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-white/5 border border-white/5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Annual Billing
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = activePlan === plan.id;
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-5 rounded-2xl transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-violet-950/40 to-[#090912] border-2 border-violet-500/50 shadow-xl shadow-violet-500/10'
                    : 'bg-[#05050a] border border-white/5 hover:border-white/15'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                      <Icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 min-h-[36px] mb-4">{plan.tagline}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">${price}</span>
                      <span className="text-xs text-zinc-500">/ month</span>
                    </div>
                    <div className="text-[11px] text-violet-400 mt-1 font-mono">
                      ⚡ {plan.credits}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-4 mb-6">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent || loadingPlan === plan.id}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 cursor-default'
                      : plan.isPopular
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 active:scale-95'
                      : 'bg-white/10 hover:bg-white/20 text-white active:scale-95'
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isCurrent ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Active Plan
                    </>
                  ) : (
                    <>
                      <span>Upgrade to {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-zinc-400" />
            <span>Secured via Lemon Squeezy Merchant Architecture • Cancel Anytime</span>
          </div>
          <div className="font-mono">
            Merchant ID: LS_LOOK_VISION_PROD_108
          </div>
        </div>

      </div>

      {/* Top-Up Credits Secondary Modal */}
      {topupModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#090912] border border-white/10 rounded-2xl p-6 text-zinc-100 shadow-2xl">
            <button
              onClick={() => setTopupModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              AI Credits Top-Up
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Instant AI credit boost for heavy creation, video rendering & 3D virtual try-ons.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { id: 'standard', name: 'Standard Boost', credits: 1000, price: 10 },
                { id: 'pro', name: 'Pro Atelier Pack', credits: 3000, price: 25, popular: true },
                { id: 'ultra', name: 'Haute Studio Vault', credits: 7500, price: 50 }
              ].map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => handleTopup(pack.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    pack.popular
                      ? 'bg-violet-950/30 border-violet-500/40 hover:border-violet-500'
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>{pack.name}</span>
                      {pack.popular && (
                        <span className="px-1.5 py-0.2 rounded bg-violet-500 text-white text-[9px] uppercase font-bold">
                          Best Value
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-amber-400 font-mono">
                      + {pack.credits.toLocaleString()} AI Credits
                    </div>
                  </div>
                  <button
                    disabled={topupLoading}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    ${pack.price}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-zinc-500 text-center">
              Credits never expire and carry over across billing cycles.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
