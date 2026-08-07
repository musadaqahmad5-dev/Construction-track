/**
 * LOOK VISION v2.4 - Enterprise Admin Navigation Sidebar
 * Design Language: Moon Pearl Glow, Slate Canvas, Glass Panels
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Cpu, 
  Palette, 
  Database, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  RefreshCw, 
  Sliders, 
  Terminal,
  Lock,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../features/identity/userIdentityTypes';

export type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'aria_control' 
  | 'theme_intelligence' 
  | 'civilization_memory' 
  | 'system_ops';

interface AdminNavigationProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  activeTab,
  onSelectTab,
  onExitAdmin
}) => {
  const { user, userRole, refreshClaims, isSuperAdmin } = useAuth();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshClaims = async () => {
    setIsRefreshing(true);
    await refreshClaims(true);
    setIsRefreshing(false);
  };

  const navItems: { id: AdminTab; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'overview',
      label: 'Overview',
      desc: 'Command Center & Telemetry',
      icon: LayoutDashboard
    },
    {
      id: 'users',
      label: 'Users & RBAC',
      desc: 'Claims & Identity Management',
      icon: Users
    },
    {
      id: 'aria_control',
      label: 'ARIA Control',
      desc: 'Orchestrator & Agent Registry',
      icon: Cpu
    },
    {
      id: 'theme_intelligence',
      label: 'Theme Intelligence',
      desc: 'Adaptive Design & Color Policies',
      icon: Palette
    },
    {
      id: 'civilization_memory',
      label: 'Civilization Memory',
      desc: 'Sartorial Knowledge Graph',
      icon: Database
    },
    {
      id: 'system_ops',
      label: 'System Operations',
      desc: 'Containers, Firestore & Gateways',
      icon: Activity
    }
  ];

  return (
    <aside className="w-72 bg-[#07070c] border-r border-white/5 flex flex-col h-full shrink-0 select-none relative z-20">
      {/* Top Admin Brand Header */}
      <div className="p-5 border-b border-white/5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-500/10">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-mono tracking-wider">LOOK VISION</h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono tracking-tight">Enterprise Command Center</p>
          </div>
        </div>

        {/* User Identity Claim Pill */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Authenticated Identity</span>
            <span className="text-xs font-mono font-medium text-white truncate block">
              {user?.email || user?.uid || 'Root Admin'}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase border font-bold ${
            isSuperAdmin 
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {userRole}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
          Governance Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full p-3 rounded-xl text-left border transition-all flex items-center gap-3 group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-950/40 to-purple-950/20 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
              }`}
            >
              <div className={`p-2 rounded-lg border transition-all ${
                isActive 
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' 
                  : 'bg-white/5 border-white/5 text-zinc-400 group-hover:text-zinc-200'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className={`text-xs font-mono font-semibold block ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                  {item.label}
                </span>
                <span className="text-[10px] text-zinc-500 truncate block">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button
          onClick={handleRefreshClaims}
          disabled={isRefreshing}
          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Reverifying...' : 'Reverify Token Claims'}</span>
        </button>

        <button
          onClick={onExitAdmin}
          className="w-full py-2 px-3 rounded-xl bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-500/20 text-indigo-200 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Consumer Workspace</span>
        </button>
      </div>
    </aside>
  );
};
