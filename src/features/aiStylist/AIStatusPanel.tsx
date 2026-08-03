import React from 'react';
import { ShieldCheck, Cpu, Shirt, ShoppingBag, Radio, Sparkles } from 'lucide-react';

export interface AIStatusItem {
  label: string;
  status: 'Online' | 'Connected' | 'Active';
  icon: React.ElementType;
  accent: string;
}

export const AIStatusPanel: React.FC = () => {
  const statuses: AIStatusItem[] = [
    { label: 'AI Stylist Brain', status: 'Online', icon: Cpu, accent: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Memory Engine', status: 'Active', icon: Radio, accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { label: 'Digital Twin Studio', status: 'Connected', icon: Sparkles, accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Wardrobe Core', status: 'Connected', icon: Shirt, accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { label: 'Marketplace Engine', status: 'Connected', icon: ShoppingBag, accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Unified Core', status: 'Connected', icon: ShieldCheck, accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a12]/80 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
          System Neural Status
        </h4>
        <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
          Subsystem Matrix V2.4
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {statuses.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <IconComponent className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                <span className="text-zinc-300 font-medium truncate text-[11px]">{item.label}</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${item.accent}`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
