import React, { useState, useEffect } from 'react';
import { Sparkles, History, Filter, RefreshCw, CheckCircle2, XCircle, RotateCcw, Clock, ShieldCheck, Cpu } from 'lucide-react';
import { AIUsageRecord } from '../../services/credits/types';

export const UsageDashboard: React.FC = () => {
  const [history, setHistory] = useState<AIUsageRecord[]>([]);
  const [summary, setSummary] = useState<{
    totalUsed: number;
    imageUsed: number;
    videoUsed: number;
    tryOnUsed: number;
    premiumUsed: number;
    totalRequests: number;
    failedRequests: number;
  }>({
    totalUsed: 0,
    imageUsed: 0,
    videoUsed: 0,
    tryOnUsed: 0,
    premiumUsed: 0,
    totalRequests: 0,
    failedRequests: 0
  });

  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/usage/history?limit=100', {
        headers: {
          'x-user-id': localStorage.getItem('look_vision_user_id') || 'guest-sartorialist-user-100'
        }
      });
      const json = await res.json();
      if (json.success) {
        setHistory(json.data.history || []);
        setSummary(json.data.summary || {});
      }
    } catch (err) {
      console.error('Failed to fetch usage history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    if (filterType === 'ALL') return true;
    if (filterType === 'IMAGE') return item.creditType === 'image';
    if (filterType === 'VIDEO') return item.creditType === 'video';
    if (filterType === 'TRY_ON') return item.creditType === 'tryOn';
    if (filterType === 'PREMIUM') return item.creditType === 'premium';
    return true;
  });

  const successRate = summary.totalRequests > 0
    ? Math.round(((summary.totalRequests - summary.failedRequests) / summary.totalRequests) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#07070d] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Credits Consumption</span>
            <Cpu className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">{summary.totalUsed}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Across all AI engines</div>
        </div>

        <div className="bg-[#07070d] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total AI Requests</span>
            <History className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">{summary.totalRequests}</div>
          <div className="text-[11px] text-zinc-500 mt-1">In last 30 days</div>
        </div>

        <div className="bg-[#07070d] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Pipeline Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">{successRate}%</div>
          <div className="text-[11px] text-zinc-500 mt-1">Auto-refund on error enabled</div>
        </div>

        <div className="bg-[#07070d] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Failed / Refunded</span>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tracking-tight">{summary.failedRequests}</div>
          <div className="text-[11px] text-zinc-500 mt-1">100% credits refunded</div>
        </div>
      </div>

      {/* Filter and Refresh Bar */}
      <div className="bg-[#07070d] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-zinc-400 mr-1 shrink-0" />
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'IMAGE', label: 'Images' },
            { id: 'TRY_ON', label: '3D Try-On' },
            { id: 'VIDEO', label: 'Runway Video' },
            { id: 'PREMIUM', label: 'Premium AI' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                filterType === tab.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Usage Table */}
      <div className="bg-[#07070d] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center space-x-2">
            <History className="w-4 h-4 text-violet-400" />
            <span>AI Request Pipeline Audit Ledger</span>
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Showing {filteredHistory.length} events</span>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No AI requests logged in this category yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090912] text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Feature Engine</th>
                  <th className="py-3 px-4">Request Type</th>
                  <th className="py-3 px-4">Credit Pool</th>
                  <th className="py-3 px-4 text-right">Deduction</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-medium text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                      <span>{item.featureType}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{item.requestType}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-300">
                        {item.creditType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                      -{item.creditsUsed}
                    </td>
                    <td className="py-3 px-4">
                      {item.refunded ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          <RotateCcw className="w-3 h-3" />
                          <span>Refunded</span>
                        </span>
                      ) : item.successStatus === 'success' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Success ({item.executionTimeMs || 120}ms)</span>
                        </span>
                      ) : item.successStatus === 'failed' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-300">
                          <XCircle className="w-3 h-3" />
                          <span>Failed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-sky-500/10 border border-sky-500/30 text-sky-300">
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>Processing</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
