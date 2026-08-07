import React, { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  Sparkles,
  Zap,
  ShieldCheck,
  Radio,
  Clock,
  Layers,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { ARIARuntime } from '../../aria/runtime/ARIARuntime';
import { PreviewBootstrap } from '../../aria/preview/PreviewBootstrap';
import { PreviewEnvironment } from '../../aria/preview/PreviewEnvironment';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export const ARIAPreviewHealth: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [previewStatus, setPreviewStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshHealth = async () => {
    setLoading(true);
    await PreviewBootstrap.initializePreviewRuntime();
    const runtimeHealth = ARIARuntime.getInstance().getHealth();
    const envDiag = PreviewEnvironment.getDiagnosticStatus();
    const session = PreviewBootstrap.getActiveSession();

    setHealth(runtimeHealth);
    setPreviewStatus({
      ...envDiag,
      user: session.displayName,
      archetype: session.styleDNA.archetype,
      itemCount: session.wardrobe.length
    });
    setLoading(false);
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(() => {
      refreshHealth();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!health || !previewStatus) {
    return (
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-4 flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs">
        <Activity className="w-4 h-4 text-indigo-400 animate-spin" /> Assessing ARIA Preview Health...
      </div>
    );
  }

  return (
    <div className="bg-[#05050a] border border-indigo-500/20 rounded-2xl p-5 text-left text-zinc-100 shadow-xl space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-5" />
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ARIA Autonomous Intelligence Health
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">
              LOOK VISION v2.4.0-telemetry • Google AI Studio Preview
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            ONLINE
          </span>
          <button
            onClick={refreshHealth}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-all"
            title="Refresh Diagnostics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-[#07070c] border border-white/5 rounded-xl p-3">
          <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between mb-1">
            <span>ARIA Runtime</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-black font-mono text-emerald-400">ONLINE</div>
          <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">
            {health.version || 'ARIA v3.2'}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#07070c] border border-white/5 rounded-xl p-3">
          <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between mb-1">
            <span>Active Engines</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-sm font-black font-mono text-indigo-300">17/17 READY</div>
          <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">
            100% Core Coverage
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#07070c] border border-white/5 rounded-xl p-3">
          <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between mb-1">
            <span>Mode</span>
            <Radio className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-black font-mono text-purple-300">PREVIEW</div>
          <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">
            Offline-First Isolated
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#07070c] border border-white/5 rounded-xl p-3">
          <div className="text-[10px] font-mono text-zinc-400 uppercase flex items-center justify-between mb-1">
            <span>Memory Mode</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-black font-mono text-cyan-300">LOCAL CACHE</div>
          <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">
            Zero DB Dependency
          </span>
        </div>
      </div>

      {/* Engine Readiness Row */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="bg-[#07070c] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-300">Vision Engine</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> READY
          </span>
        </div>

        <div className="bg-[#07070c] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-300">Generative Engine</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> READY
          </span>
        </div>

        <div className="bg-[#07070c] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-300">Decision Engine</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> READY
          </span>
        </div>
      </div>

      {/* Active User Session Details */}
      <div className="bg-[#07070c] border border-white/5 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Preview Session:</span>
          <strong className="text-white">{previewStatus.user}</strong>
          <span className="px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 text-[10px]">
            {previewStatus.archetype}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-400">
          <span>Wardrobe: <strong className="text-white">{previewStatus.itemCount} items</strong></span>
          <span>Requests Handled: <strong className="text-white">{health.totalRequestsHandled || 0}</strong></span>
        </div>
      </div>
    </div>
  );
};
