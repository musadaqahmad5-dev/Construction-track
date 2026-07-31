import React, { useState, useEffect } from 'react';
import { Sparkles, Image, Video, Shirt, Crown, RefreshCw, Zap, AlertTriangle, ArrowUpRight } from 'lucide-react';

export interface CreditStatusData {
  userId: string;
  planTier: string;
  credits: {
    imageCredits: number;
    videoCredits: number;
    tryOnCredits: number;
    premiumCredits: number;
    lastUpdated: string;
  };
  limits: {
    dailyGenerationsUsed: number;
    maxDailyGenerations: number;
    activeConcurrentJobs: number;
    maxConcurrentJobs: number;
    priorityLevel: number;
  };
  planConfig: {
    name: string;
    monthlyImageCredits: number;
    monthlyVideoCredits: number;
    monthlyTryOnCredits: number;
    monthlyPremiumCredits: number;
  };
  summary?: {
    totalUsed: number;
    totalRequests: number;
    failedRequests: number;
  };
}

interface CreditBalanceWidgetProps {
  onUpgradeClick?: () => void;
  compact?: boolean;
}

export const CreditBalanceWidget: React.FC<CreditBalanceWidgetProps> = ({ onUpgradeClick, compact = false }) => {
  const [data, setData] = useState<CreditStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/credits/status', {
        headers: {
          'x-user-id': localStorage.getItem('look_vision_user_id') || 'guest-sartorialist-user-100',
          'x-user-plan': localStorage.getItem('look_vision_user_plan') || 'FREE'
        }
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load credit status');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="p-4 bg-[#080811] border border-white/5 rounded-2xl animate-pulse flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
          </div>
          <div>
            <div className="h-4 w-32 bg-white/10 rounded mb-1"></div>
            <div className="h-3 w-20 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const credits = data?.credits || { imageCredits: 150, videoCredits: 10, tryOnCredits: 30, premiumCredits: 10, lastUpdated: new Date().toISOString() };
  const limits = data?.limits || { dailyGenerationsUsed: 0, maxDailyGenerations: 25, activeConcurrentJobs: 0, maxConcurrentJobs: 1, priorityLevel: 1 };
  const planConfig = data?.planConfig || { name: 'Sartorial Essentials', monthlyImageCredits: 150, monthlyVideoCredits: 10, monthlyTryOnCredits: 30, monthlyPremiumCredits: 10 };

  const dailyPercentage = Math.min(100, Math.round((limits.dailyGenerationsUsed / limits.maxDailyGenerations) * 100));

  if (compact) {
    return (
      <div className="flex items-center space-x-3 bg-[#080811] border border-white/10 hover:border-violet-500/30 px-3 py-1.5 rounded-full transition-all">
        <div className="flex items-center space-x-1.5 text-xs font-medium text-zinc-200">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>{credits.imageCredits}</span>
          <span className="text-zinc-500 text-[10px]">IMG</span>
        </div>
        <div className="w-px h-3 bg-white/10"></div>
        <div className="flex items-center space-x-1.5 text-xs font-medium text-zinc-200">
          <Shirt className="w-3.5 h-3.5 text-emerald-400" />
          <span>{credits.tryOnCredits}</span>
          <span className="text-zinc-500 text-[10px]">TRY-ON</span>
        </div>
        {onUpgradeClick && (
          <button
            onClick={onUpgradeClick}
            className="text-[10px] font-semibold tracking-wider uppercase text-violet-400 hover:text-violet-300 ml-1 transition-colors"
          >
            Upgrade
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#07070f] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center shadow-inner">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-white tracking-wide">{planConfig.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-violet-500/10 border border-violet-500/30 text-violet-300">
                {data?.planTier || 'FREE'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">AI Credit Management Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchStatus}
            className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors"
            title="Refresh balance"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-violet-900/30 transition-all flex items-center space-x-1"
            >
              <span>Get Pro</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Credit Pools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Image Credits */}
        <div className="bg-[#0a0a14] border border-white/5 rounded-xl p-3 relative hover:border-violet-500/20 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">Image AI</span>
            <Image className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono tracking-tight">{credits.imageCredits}</div>
          <div className="text-[10px] text-zinc-500 mt-1">
            / {planConfig.monthlyImageCredits} monthly
          </div>
        </div>

        {/* Try-On Credits */}
        <div className="bg-[#0a0a14] border border-white/5 rounded-xl p-3 relative hover:border-emerald-500/20 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">3D Try-On</span>
            <Shirt className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono tracking-tight">{credits.tryOnCredits}</div>
          <div className="text-[10px] text-zinc-500 mt-1">
            / {planConfig.monthlyTryOnCredits} monthly
          </div>
        </div>

        {/* Video Credits */}
        <div className="bg-[#0a0a14] border border-white/5 rounded-xl p-3 relative hover:border-sky-500/20 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">Runway Video</span>
            <Video className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono tracking-tight">{credits.videoCredits}</div>
          <div className="text-[10px] text-zinc-500 mt-1">
            / {planConfig.monthlyVideoCredits} monthly
          </div>
        </div>

        {/* Premium AI Credits */}
        <div className="bg-[#0a0a14] border border-white/5 rounded-xl p-3 relative hover:border-amber-500/20 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">Premium AI</span>
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono tracking-tight">{credits.premiumCredits}</div>
          <div className="text-[10px] text-zinc-500 mt-1">
            / {planConfig.monthlyPremiumCredits} monthly
          </div>
        </div>
      </div>

      {/* Daily Limits & Concurrency Status */}
      <div className="bg-[#090912] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-1/2">
          <div className="flex items-center justify-between text-zinc-400 mb-1.5">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Generations</span>
            </span>
            <span className="font-mono text-zinc-300">
              {limits.dailyGenerationsUsed} / {limits.maxDailyGenerations}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                dailyPercentage > 85 ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'
              }`}
              style={{ width: `${dailyPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center space-x-4 text-zinc-400 border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0 sm:pl-4">
          <div>
            <span className="text-zinc-500 block text-[10px]">Active Concurrency</span>
            <span className="font-mono text-white text-xs font-semibold">
              {limits.activeConcurrentJobs} / {limits.maxConcurrentJobs}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">Queue Rank</span>
            <span className="font-mono text-emerald-400 text-xs font-semibold">
              {limits.priorityLevel === 3 ? 'VIP Ultra' : limits.priorityLevel === 2 ? 'Priority Pro' : 'Standard'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
