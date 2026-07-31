import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  Layers,
  Crown,
  Lock,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { PricingModal } from './PricingModal';
import { CreditBalanceWidget } from '../credits/CreditBalanceWidget';
import { UsageDashboard } from '../credits/UsageDashboard';

interface SubscriptionData {
  planId: string;
  status: string;
  provider: string;
  customerId: string;
  subscriptionId: string;
  renewalDate: string;
  creditBalance: number;
  lifetimeCreditsEarned: number;
}

interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  reason: string;
  timestamp: string;
  balanceAfter: number;
}

export const SubscriptionHubView: React.FC = () => {
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, historyRes] = await Promise.all([
        fetch('/api/subscription/status', {
          headers: { 'x-user-id': 'guest-sartorialist-user-100' }
        }),
        fetch('/api/credits/history', {
          headers: { 'x-user-id': 'guest-sartorialist-user-100' }
        })
      ]);

      if (statusRes.ok) {
        const json = await statusRes.json();
        if (json.data?.subscription) {
          setSubData(json.data.subscription);
        }
      }

      if (historyRes.ok) {
        const historyJson = await historyRes.json();
        if (historyJson.data) {
          setTransactions(historyJson.data);
        }
      }
    } catch (err) {
      console.error('[SubscriptionHubView] Error loading sub status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSub = async () => {
    if (!window.confirm('Are you sure you want to schedule cancellation for your subscription?')) return;
    setCanceling(true);
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'guest-sartorialist-user-100'
        }
      });
      if (res.ok) {
        setAlert({
          type: 'success',
          text: 'Subscription scheduled for cancellation at period end.'
        });
        await loadData();
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        text: err.message || 'Failed to cancel subscription.'
      });
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-500 mb-3" />
        <span className="text-sm font-mono">Loading Payment & Subscription Engine...</span>
      </div>
    );
  }

  const currentPlan = subData?.planId || 'FREE';
  const isFree = currentPlan === 'FREE';

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in text-zinc-100">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#07070c] to-[#05050a] border border-white/10 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            Payment Abstraction Architecture
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Monetization & Subscription Studio
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Vendor-agnostic subscription layer connected to Lemon Squeezy integration adapter.
          </p>
        </div>

        <button
          onClick={() => setPricingModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Subscription Plans</span>
        </button>
      </div>

      {alert && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
        }`}>
          <span>{alert.text}</span>
          <button onClick={() => setAlert(null)} className="text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* AI Credit Management Widget */}
      <CreditBalanceWidget onUpgradeClick={() => setPricingModalOpen(true)} />

      {/* AI Usage & Pipeline Audit Dashboard */}
      <div className="pt-2">
        <UsageDashboard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active Plan Card */}
        <div className="p-6 rounded-2xl bg-[#07070c] border border-white/10 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Crown className="w-24 h-24 text-violet-400" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Current Tier</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase">
              {subData?.status || 'Active'}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">{currentPlan}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Provider: <strong className="text-zinc-200 capitalize">{subData?.provider || 'Lemon Squeezy'}</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 text-xs text-zinc-400 space-y-1 font-mono">
            <div>Renewal: {subData?.renewalDate ? new Date(subData.renewalDate).toLocaleDateString() : 'N/A'}</div>
            <div className="text-[11px] text-zinc-500 truncate">Cust ID: {subData?.customerId}</div>
          </div>

          {!isFree && (
            <button
              onClick={handleCancelSub}
              disabled={canceling}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-mono"
            >
              {canceling ? 'Processing...' : 'Schedule Cancellation'}
            </button>
          )}
        </div>

        {/* AI Credit Balance Card */}
        <div className="p-6 rounded-2xl bg-[#07070c] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">AI Credit Balance</span>
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>

          <div>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {(subData?.creditBalance ?? 200).toLocaleString()}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Lifetime Earned: {(subData?.lifetimeCreditsEarned ?? 200).toLocaleString()} credits
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setPricingModalOpen(true)}
              className="w-full py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Purchase Credit Top-Up</span>
            </button>
          </div>
        </div>

        {/* Feature Permissions Quick Status */}
        <div className="p-6 rounded-2xl bg-[#07070c] border border-white/10 space-y-3">
          <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Feature Entitlements</span>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">AI Fashion Image Gen</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">3D Photorealistic Try-On</span>
              {isFree ? <Lock className="w-3.5 h-3.5 text-zinc-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Video Runway Generation</span>
              {currentPlan === 'CREATOR_PRO' || currentPlan === 'ENTERPRISE' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Marketplace Seller Studio</span>
              {currentPlan === 'CREATOR_PRO' || currentPlan === 'ENTERPRISE' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Transactions Ledger Table */}
      <div className="p-6 rounded-2xl bg-[#07070c] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-violet-400" />
            Credit Activity & Audit Ledger
          </h3>
          <span className="text-xs font-mono text-zinc-500">{transactions.length} Records</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 border border-dashed border-white/5 rounded-xl">
            No credit transactions logged yet. Perform AI generation or purchase top-ups to build history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/5 text-zinc-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="p-3 rounded-l-lg">Timestamp</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 rounded-r-lg">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono text-zinc-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 capitalize">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-300 text-[10px] font-mono">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-200">{tx.reason}</td>
                    <td className={`p-3 font-mono font-bold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                    </td>
                    <td className="p-3 font-mono text-amber-400">{tx.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        currentPlanId={currentPlan}
        onPlanSelected={() => loadData()}
      />
    </div>
  );
};
