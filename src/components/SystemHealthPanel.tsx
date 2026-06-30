import React, { useState } from 'react';
import { Shield, Sparkles, AlertTriangle, Cpu, TrendingUp, CheckCircle } from 'lucide-react';

interface SystemHealthPanelProps {
  systemHealthScore: number;
  learningSpeedPercent: number;
  biasReductionFactor: number;
  readyForProduction: boolean;
  activeSessions?: number;
  avgGenerationTime?: number;
  errorRate?: number;
  storageUsageBytes?: number;
  id?: string;
  onRunRehearsal?: () => void;
  onClearMemory?: () => void;
}

export const SystemHealthPanel: React.FC<SystemHealthPanelProps> = ({
  systemHealthScore,
  learningSpeedPercent,
  biasReductionFactor,
  readyForProduction,
  activeSessions = 1,
  avgGenerationTime = 38,
  errorRate = 0,
  storageUsageBytes = 4200,
  id,
  onRunRehearsal,
  onClearMemory
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div id={id || "system-health-panel"} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core telemetry CARD 1 */}
        <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-light">
              System Stability
            </span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-3xl font-mono text-white tracking-tight">
              {systemHealthScore}%
            </h4>
            <p className="text-[10px] font-serif italic text-white/45 mt-1 leading-relaxed">
              Synthesizer error boundary clearance score.
            </p>
          </div>
        </div>

        {/* Core telemetry CARD 2 */}
        <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-light">
              Learning Rate
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-3xl font-mono text-white tracking-tight">
              {learningSpeedPercent}%
            </h4>
            <p className="text-[10px] font-serif italic text-white/45 mt-1 leading-relaxed">
              Personal style coordinate convergence speed.
            </p>
          </div>
        </div>

        {/* Core telemetry CARD 3 */}
        <div className="p-5 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-light">
              Debiasing Factor
            </span>
            <Shield className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-3xl font-mono text-white tracking-tight">
              {biasReductionFactor}%
            </h4>
            <p className="text-[10px] font-serif italic text-white/45 mt-1 leading-relaxed">
              Active compensation against metadata over-centering.
            </p>
          </div>
        </div>
      </div>

      {/* Production Readiness Status Block */}
      <div className="p-5 bg-zinc-950/40 border border-white/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-white">
              SaaS Operational Core
            </h4>
          </div>
          <p className="text-[11px] font-serif text-white/60 leading-relaxed font-light">
            The Fashion OS intelligence loop is running in state-synced, persistent production mode.
          </p>
        </div>

        <div className="flex gap-2.5 w-full sm:w-auto">
          {onRunRehearsal && (
            <button
              id="btn-trigger-rehearsal"
              onClick={onRunRehearsal}
              className="px-3.5 py-1.5 bg-white text-black hover:bg-zinc-200 text-[10px] font-mono rounded border border-white uppercase tracking-wider cursor-pointer"
            >
              Rehearse Loop
            </button>
          )}

          {onClearMemory && (
            <button
              id="btn-trigger-clearmemory"
              onClick={() => {
                if (!confirmClear) {
                  setConfirmClear(true);
                  setTimeout(() => setConfirmClear(false), 4000);
                } else {
                  onClearMemory();
                  setConfirmClear(false);
                }
              }}
              className={`px-3 py-1.5 border text-[10px] font-mono rounded uppercase tracking-wider cursor-pointer transition-all ${
                confirmClear 
                  ? 'bg-red-500 text-white border-red-400 font-bold' 
                  : 'bg-red-950/20 border-red-900/20 hover:border-red-800 text-red-400'
              }`}
            >
              {confirmClear ? "Confirm?" : "Reset DNA"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
