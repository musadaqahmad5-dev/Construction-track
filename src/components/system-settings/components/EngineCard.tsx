import React, { ReactNode } from 'react';
import { StatusBadge } from './StatusBadge';

interface EngineCardProps {
  name: string;
  status: string;
  score: number;
  description: string;
  activeMetrics?: { label: string; value: string | number }[];
  children?: ReactNode;
  actions?: ReactNode;
}

export const EngineCard: React.FC<EngineCardProps> = ({
  name,
  status,
  score,
  description,
  activeMetrics = [],
  children,
  actions
}) => {
  return (
    <div className="bg-[#06060c] border border-white/5 p-5 rounded-3xl space-y-4 text-left hover:border-violet-500/10 transition-all duration-300">
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-white tracking-tight">{name}</h4>
          <p className="text-[10px] text-zinc-500 leading-none uppercase font-mono">Operational Node</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/10">
            {score}%
          </span>
        </div>
      </div>

      <p className="text-[11.5px] text-zinc-300 leading-relaxed font-sans">
        {description}
      </p>

      {activeMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-xl border border-white/[0.03]">
          {activeMetrics.map((met, idx) => (
            <div key={idx} className="space-y-0.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">{met.label}</span>
              <span className="text-[10.5px] font-mono text-zinc-200 font-semibold">{met.value}</span>
            </div>
          ))}
        </div>
      )}

      {children && (
        <div className="space-y-3 pt-2">
          {children}
        </div>
      )}

      {actions && (
        <div className="flex justify-end pt-2 border-t border-white/[0.03] gap-2 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
