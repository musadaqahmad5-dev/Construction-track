import React, { useState } from 'react';
import { 
  Cpu, Activity, Database, Bot, ShieldCheck, TrendingUp, 
  Sparkles, Layers, Zap, Server, BarChart3, Radio, Compass, RefreshCw
} from 'lucide-react';
import { WardrobeItem } from '../types';

// Executive AI OS Control Center Sub-Components
import { ARIALivePrototypePanel } from './dashboard/ARIALivePrototypePanel';
import { ARIAPreviewHealth } from './dashboard/ARIAPreviewHealth';
import { ARIAInvestorDashboard } from './dashboard/ARIAInvestorDashboard';
import { SystemHealthPanel } from './SystemHealthPanel';
import { CivilizationMemoryDashboard } from './aria/CivilizationMemoryDashboard';
import { AgentControlRoom } from './aria/AgentControlRoom';
import { PlatformEcosystemLauncher } from './dashboard/PlatformEcosystemLauncher';
import { EditorsPicks } from './dashboard/EditorsPicks';
import { SidebarWidgets } from './dashboard/SidebarWidgets';

interface LookVisionMainDashboardProps {
  wardrobe: WardrobeItem[];
  onAddGarment?: (title: string, description: string, category: any, extraOptions?: any) => Promise<void>;
  onDeleteGarment?: (id: string) => Promise<void>;
  user?: any;
  onLogout?: () => void;
  onReset?: () => void;
  onLoadSamples?: () => void;
  setActiveSubTab?: (tab: any) => void;
}

export const LookVisionMainDashboard: React.FC<LookVisionMainDashboardProps> = ({
  wardrobe,
  onAddGarment,
  onDeleteGarment,
  user,
  onLogout,
  onReset,
  onLoadSamples,
  setActiveSubTab
}) => {
  // Executive Control Tab State
  const [activeControlTab, setActiveControlTab] = useState<
    'ALL_SYSTEMS' | 'PROTOTYPE_ENGINE' | 'ENGINE_TELEMETRY' | 'CIVILIZATION_MEMORY' | 'AGENT_NETWORK' | 'SYSTEM_HEALTH' | 'INVESTOR_METRICS'
  >('ALL_SYSTEMS');

  const [promptInput, setPromptInput] = useState('');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in select-none text-left font-sans">
      
      {/* 1. EXECUTIVE AI OS CONTROL CENTER HEADER */}
      <div className="bg-[#07070c] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Glowing background accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>LOOK VISION v2.4-telemetry</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[9px] uppercase tracking-wider">
                Executive AI OS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-tight">
              Executive AI OS Control Center
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-serif italic max-w-2xl leading-relaxed">
              Unified command center managing ARIA prototype engine, telemetry, civilization memory, autonomous agent networks, and investor metrics.
            </p>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0 font-mono text-xs">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-500 uppercase block mb-0.5">ARIA Engine</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Live
              </span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-500 uppercase block mb-0.5">Stability</span>
              <span className="text-indigo-300 font-bold">98.4%</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-500 uppercase block mb-0.5">Agent Mesh</span>
              <span className="text-violet-300 font-bold">Active</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[9px] text-zinc-500 uppercase block mb-0.5">Investor Index</span>
              <span className="text-amber-300 font-bold">+184%</span>
            </div>
          </div>
        </div>

        {/* Executive Control Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 flex-nowrap">
          {[
            { id: 'ALL_SYSTEMS', label: '⚡ Unified Control View', icon: Layers },
            { id: 'PROTOTYPE_ENGINE', label: '🔮 Live Prototype Engine', icon: Cpu },
            { id: 'ENGINE_TELEMETRY', label: '📡 Engine Telemetry', icon: Activity },
            { id: 'CIVILIZATION_MEMORY', label: '🧠 Civilization Memory', icon: Database },
            { id: 'AGENT_NETWORK', label: '🤖 Agent Swarm Network', icon: Bot },
            { id: 'SYSTEM_HEALTH', label: '🛡️ System Health & Audit', icon: ShieldCheck },
            { id: 'INVESTOR_METRICS', label: '📈 Investor Metrics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeControlTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveControlTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isSel
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg border border-violet-400/30 font-semibold'
                    : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-violet-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EXECUTIVE CONTROL CENTER MODULES RENDER LAYER */}
      <div className="space-y-6">

        {/* 2.1 ARIA Live Prototype Engine */}
        {(activeControlTab === 'ALL_SYSTEMS' || activeControlTab === 'PROTOTYPE_ENGINE') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> Module 01: ARIA Live Prototype Engine
              </span>
              <span className="text-[9px] font-mono text-zinc-500">Autonomous Orchestration</span>
            </div>
            <ARIALivePrototypePanel setActiveSubTab={setActiveSubTab} />
          </div>
        )}

        {/* 2.2 Engine Telemetry & Preview Health */}
        {(activeControlTab === 'ALL_SYSTEMS' || activeControlTab === 'ENGINE_TELEMETRY') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> Module 02: Engine Telemetry & Preview Health
              </span>
              <span className="text-[9px] font-mono text-zinc-500">Real-Time Observability</span>
            </div>
            <ARIAPreviewHealth />
          </div>
        )}

        {/* 2.3 AI Civilization Memory Status */}
        {(activeControlTab === 'ALL_SYSTEMS' || activeControlTab === 'CIVILIZATION_MEMORY') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> Module 03: AI Civilization Memory Status
              </span>
              <span className="text-[9px] font-mono text-zinc-500">Global Knowledge Graph</span>
            </div>
            <div className="bg-[#07070c] border border-white/10 rounded-3xl p-4 overflow-hidden shadow-2xl">
              <CivilizationMemoryDashboard />
            </div>
          </div>
        )}

        {/* 2.4 Agent Swarm Network */}
        {(activeControlTab === 'ALL_SYSTEMS' || activeControlTab === 'AGENT_NETWORK') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold flex items-center gap-2">
                <Bot className="w-3.5 h-3.5" /> Module 04: Agent Swarm Network
              </span>
              <span className="text-[9px] font-mono text-zinc-500">Autonomous Sartorial Agent Mesh</span>
            </div>
            <div className="bg-[#07070c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <AgentControlRoom />
            </div>
          </div>
        )}

        {/* 2.5 System Health & Audit */}
        {(activeControlTab === 'ALL_SYSTEMS' || activeControlTab === 'SYSTEM_HEALTH') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Module 05: System Health & Audit
              </span>
              <span className="text-[9px] font-mono text-zinc-500">Stability & Bias Clearance</span>
            </div>
            <div className="bg-[#07070c] border border-white/10 rounded-3xl p-6 overflow-hidden shadow-2xl">
              <SystemHealthPanel 
                systemHealthScore={98}
                learningSpeedPercent={94}
                biasReductionFactor={99}
                readyForProduction={true}
              />
            </div>
          </div>
        )}

        {/* 2.6 Investor Metrics */}
        {(activeControlTab === 'ALL_SYSTEMS' || activeControlTab === 'INVESTOR_METRICS') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> Module 06: Investor Metrics & Demo Scenario Engine
              </span>
              <span className="text-[9px] font-mono text-zinc-500">Ecosystem Growth & ROI</span>
            </div>
            <div className="bg-[#07070c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <ARIAInvestorDashboard />
            </div>
          </div>
        )}

        {/* Unified Launcher & Editors Picks Navigation */}
        {activeControlTab === 'ALL_SYSTEMS' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="xl:col-span-3 space-y-4">
              <PlatformEcosystemLauncher
                user={user}
                setActiveSubTab={setActiveSubTab}
              />
              <EditorsPicks setActiveSubTab={setActiveSubTab} onAddGarment={onAddGarment} />
            </div>
            <SidebarWidgets
              setActiveSubTab={setActiveSubTab}
              setPromptInput={setPromptInput}
            />
          </div>
        )}

      </div>
    </div>
  );
};
