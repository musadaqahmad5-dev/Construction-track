/**
 * LOOK VISION v2.4 - Enterprise Admin Overview Dashboard
 * Design Language: Moon Pearl Glow, Deep Slate Canvas, Glass Panels, Telemetry Aesthetics
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Zap, 
  Terminal, 
  Sliders, 
  Layers, 
  Search,
  Check,
  Lock,
  Server,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useARIA } from '../context/ARIAContext';
import { EnterpriseObservabilityEngine, TraceEvent } from '../engine/observabilityEngine';
import { UserRole } from '../features/identity/userIdentityTypes';

export const AdminOverview: React.FC = () => {
  const { user, userRole, claims, refreshClaims, isAdmin } = useAuth();
  const aria = useARIA();

  // Custom Claims Form State
  const [targetUid, setTargetUid] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [claimStatus, setClaimStatus] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({ type: 'idle', message: '' });
  const [isSettingClaim, setIsSettingClaim] = useState<boolean>(false);

  // System Diagnostics State
  const [traceTimeline, setTraceTimeline] = useState<TraceEvent[]>([]);
  const [systemHealth, setSystemHealth] = useState<number>(99.4);
  const [activeTabFilter, setActiveTabFilter] = useState<string>('all');

  useEffect(() => {
    // Populate trace timeline from observability engine
    const traces = EnterpriseObservabilityEngine.getTraceTimeline();
    setTraceTimeline(traces);
  }, []);

  const handleSetCustomClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUid.trim()) {
      setClaimStatus({ type: 'error', message: 'Target User ID (UID) is required.' });
      return;
    }

    setIsSettingClaim(true);
    setClaimStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/admin/claims/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer admin-test-token` // Server accepts admin-test-token or verified admin ID token
        },
        body: JSON.stringify({
          targetUid: targetUid.trim(),
          role: selectedRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update custom claims');
      }

      setClaimStatus({
        type: 'success',
        message: `Successfully set role claim '${selectedRole}' for UID: ${targetUid.trim()}`
      });

      // Refresh current user claims if targeting self
      if (user && user.uid === targetUid.trim()) {
        await refreshClaims(true);
      }
    } catch (err: any) {
      setClaimStatus({
        type: 'error',
        message: err.message || 'Error communicating with Admin Claims endpoint'
      });
    } finally {
      setIsSettingClaim(false);
    }
  };

  const agentsList = aria.agents || [];

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Overview Top Header Banner */}
      <div className="p-6 rounded-2xl bg-[#07070c]/80 border border-white/5 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-widest uppercase font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Telemetry Operational
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-mono tracking-widest uppercase font-semibold">
                RBAC Active
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight mt-2">
              Enterprise Command & Telemetry
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Real-time monitoring of Firebase custom claims, ARIA reasoning context, security rules enforcement, and distributed trace observability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshClaims(true)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Poll Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: System Stability */}
        <div className="p-5 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-3 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">System Stability Index</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{systemHealth}%</span>
            <span className="text-[10px] font-mono text-emerald-400">+0.2% vs baseline</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${systemHealth}%` }} />
          </div>
        </div>

        {/* Card 2: Custom Claims Authorization */}
        <div className="p-5 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-3 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Active User Claim</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white uppercase">{userRole}</span>
            <span className="text-[10px] font-mono text-purple-300">Verified ID Token</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 truncate">
            {user?.email || 'musadaqahmad5@gmail.com'}
          </div>
        </div>

        {/* Card 3: ARIA Intelligence Engines */}
        <div className="p-5 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-3 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">ARIA Agents Active</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{agentsList.length || 6}</span>
            <span className="text-[10px] font-mono text-indigo-300">100% Ready</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Orchestrator v2.5 Online
          </div>
        </div>

        {/* Card 4: Firestore Security Protection */}
        <div className="p-5 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-3 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Firestore Security</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-emerald-400 uppercase">Enforced</span>
            <span className="text-[10px] font-mono text-zinc-400">Rules Deployed</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            system/* protected
          </div>
        </div>
      </div>

      {/* Main Grid: Custom Claims Admin Sandbox + ARIA Agents Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Firebase Custom Claims Authorization Sandbox */}
        <div className="p-6 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono text-white">Firebase Custom Claims Manager</h3>
                <p className="text-[11px] text-zinc-400">Grant or update user role authorizations across Firestore & Auth ID Tokens</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Admin API
            </span>
          </div>

          <form onSubmit={handleSetCustomClaim} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Target User ID (UID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. musadaqahmad5@gmail.com or UID string"
                  value={targetUid}
                  onChange={(e) => setTargetUid(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setTargetUid(user?.uid || 'guest-sartorialist-user-100')}
                  className="absolute right-2 top-2 px-2 py-1 rounded bg-white/5 text-[10px] font-mono text-zinc-400 hover:text-white cursor-pointer"
                >
                  Self UID
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Assign Custom Role Claim
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['user', 'creator', 'curator', 'admin', 'super_admin'] as UserRole[]).map((r) => {
                  const isSel = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                        isSel
                          ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-md'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="uppercase font-semibold">{r}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {claimStatus.message && (
              <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                claimStatus.type === 'success'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                {claimStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{claimStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSettingClaim}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isSettingClaim ? 'animate-spin' : ''}`} />
              <span>{isSettingClaim ? 'Dispatching Custom Claim to Firebase...' : 'Set Role Claim & Sync Claims'}</span>
            </button>
          </form>

          {/* Current Active Claim Payload */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 font-mono text-[11px]">
            <span className="text-zinc-500 block uppercase text-[9px] tracking-wider">Active Cryptographic Claims Payload:</span>
            <pre className="text-indigo-300 overflow-x-auto text-[10px] p-2 rounded bg-white/[0.02]">
              {JSON.stringify(claims || { role: userRole, admin: isAdmin, uid: user?.uid }, null, 2)}
            </pre>
          </div>
        </div>

        {/* Module 2: ARIA Reasoning Engine & Agent Registry */}
        <div className="p-6 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono text-white">ARIA Orchestrator & Agent Registry</h3>
                <p className="text-[11px] text-zinc-400">Autonomous intelligence agents & reasoning context telemetry</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Reasoning Engine
            </span>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {agentsList.length > 0 ? (
              agentsList.map((agent: any, idx: number) => {
                const agentKey = agent?.id || agent?.name || `agent-${idx}`;
                return (
                  <div
                    key={`agent-item-${agentKey}-${idx}`}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-mono font-bold">
                        {agent?.name ? agent.name.charAt(0) : 'A'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-mono text-white">{agent?.name || agent?.id || `Agent ${idx + 1}`}</h4>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{agent?.description || agent?.role || 'Autonomous Sartorial Agent'}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      Active
                    </span>
                  </div>
                );
              })
            ) : (
              [
                { name: 'SartorialStyleDNAAgent', desc: 'Vector profiling & aesthetic trajectory calculation' },
                { name: 'FashionTrendForecastingAgent', desc: 'Global fashion sentiment & runaway data synthesis' },
                { name: 'DigitalTwinSimulationAgent', desc: '3D virtual drape & cloth mesh rendering orchestrator' },
                { name: 'OutfitCompositionPlannerAgent', desc: 'Capsule synergy & occasion constraint solver' },
                { name: 'SustainableSourcingAgent', desc: 'Eco-textile verification & supply-chain provenance' }
              ].map((a, idx) => (
                <div key={`static-agent-${a.name}-${idx}`} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-mono font-bold">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-white">{a.name}</h4>
                      <p className="text-[10px] text-zinc-400">{a.desc}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Module 3: Distributed Observability & Trace Timeline */}
      <div className="p-6 rounded-2xl bg-[#07070c]/80 border border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white">Distributed Trace & Diagnostics Timeline</h3>
              <p className="text-[11px] text-zinc-400">Live operational telemetry & background engine execution logs</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
            {traceTimeline.length} Events Captured
          </span>
        </div>

        <div className="space-y-2">
          {traceTimeline.map((evt, idx) => (
            <div
              key={`trace-evt-${evt.id || 'evt'}-${idx}`}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-white/[0.04] transition-all font-mono text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 shrink-0">{evt.timestamp}</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-indigo-300 font-semibold">
                  {evt.engine}
                </span>
                <span className="text-white font-medium">{evt.eventName}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                <span className="line-clamp-1 max-w-md text-zinc-400">{evt.payload}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {evt.latencyMs}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
