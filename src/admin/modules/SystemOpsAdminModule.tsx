/**
 * LOOK VISION v2.4 - System Operations Admin Module Boundary
 * Controls Cloud Run container health, Express server middleware, and API Gateway status.
 */

import React from 'react';
import { Activity, Server, HardDrive, Cpu, Terminal, ShieldCheck } from 'lucide-react';

export const SystemOpsAdminModule: React.FC = () => {
  return (
    <div className="space-y-6 text-zinc-100 font-sans">
      <div className="p-6 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold font-mono text-white">System Operations & Cloud Infrastructure</h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-2xl">
          Container runtime metrics, Express server routing (<code className="text-emerald-300">/api/admin/*</code>), Firestore connection pools, and API rate limit controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-2">
          <span className="text-xs text-zinc-500 uppercase">Container Port</span>
          <div className="text-2xl font-bold text-white">Port 3000</div>
          <p className="text-[11px] text-zinc-400">0.0.0.0 binding operational</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-2">
          <span className="text-xs text-zinc-500 uppercase">Express Middleware</span>
          <div className="text-2xl font-bold text-emerald-400">verifyAdminToken</div>
          <p className="text-[11px] text-zinc-400">Protected <code className="text-emerald-300">/api/admin/*</code></p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-2">
          <span className="text-xs text-zinc-500 uppercase">Production Build</span>
          <div className="text-2xl font-bold text-indigo-400">CommonJS Bundle</div>
          <p className="text-[11px] text-zinc-400"><code className="text-indigo-300">dist/server.cjs</code> verified</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-bold font-mono text-white">Cloud Container & Rate Gateway Boundary</h3>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase">
            Module Boundary
          </span>
        </div>

        <div className="p-8 text-center space-y-3 bg-white/[0.01] rounded-xl border border-dashed border-white/10">
          <Server className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
          <h4 className="text-sm font-bold font-mono text-white">Cloud Infrastructure Control Module Boundary</h4>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Live container CPU metrics, memory allocation tuning, cache purge triggers, and API gateway throttling rules will be available within this module boundary.
          </p>
        </div>
      </div>
    </div>
  );
};
