import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Sparkles, Database, Layers, Activity, ShieldCheck, RefreshCw, Radio, Zap } from 'lucide-react';
import { ARIASystemStatus } from './types';

interface ARIASystemHeaderProps {
  activeIntent?: string;
  isStreaming?: boolean;
  onRefreshTelemetry?: () => void;
  onOpenOnboarding?: () => void;
}

export const ARIASystemHeader: React.FC<ARIASystemHeaderProps> = ({
  activeIntent = 'GENERAL',
  isStreaming = false,
  onRefreshTelemetry,
  onOpenOnboarding
}) => {
  const [systems, setSystems] = useState<ARIASystemStatus[]>([
    {
      id: 'sys_1',
      name: 'AI Stylist Intelligence',
      category: 'Stylist',
      status: 'online',
      latencyMs: 14,
      description: 'Streaming Conversation Engine & Adaptive Response Pipeline',
      version: 'v2.4.0',
      lastSync: 'Just now'
    },
    {
      id: 'sys_2',
      name: 'Fashion Reasoning Engine',
      category: 'Reasoning',
      status: 'online',
      latencyMs: 28,
      description: 'Multi-Agent Rule Classifier & Constraint Evaluator',
      version: 'v3.1.2',
      lastSync: 'Just now'
    },
    {
      id: 'sys_3',
      name: 'Style DNA Connector',
      category: 'StyleDNA',
      status: 'online',
      latencyMs: 18,
      description: 'Cognitive Passport Matrix & Personalized Aesthetic Weights',
      version: 'v1.8.0',
      lastSync: 'Just now'
    },
    {
      id: 'sys_4',
      name: 'Conversation Memory',
      category: 'Memory',
      status: 'online',
      latencyMs: 22,
      description: 'Firestore Session Graph & Personal Fashion Memory Store',
      version: 'v2.0.4',
      lastSync: 'Just now'
    },
    {
      id: 'sys_5',
      name: 'Theme Intelligence System',
      category: 'Theme',
      status: 'online',
      latencyMs: 9,
      description: 'Temporal Lighting Mapper & Atmospheric Canvas Adaptor',
      version: 'v1.4.1',
      lastSync: 'Just now'
    },
    {
      id: 'sys_6',
      name: 'Google Gemini 2.5 Bridge',
      category: 'Gemini',
      status: 'online',
      latencyMs: 85,
      description: 'Multimodal Neural Vision & Chain-of-Thought Generator',
      version: 'Gemini 2.5 Flash',
      lastSync: 'Just now'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSystems(prev =>
        prev.map(s => ({
          ...s,
          latencyMs: Math.floor(Math.random() * 20) + (s.category === 'Gemini' ? 70 : 8),
          lastSync: 'Just now'
        }))
      );
      setIsRefreshing(false);
      if (onRefreshTelemetry) onRefreshTelemetry();
    }, 600);
  };

  return (
    <div className="w-full bg-[#07070c] border border-white/5 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6 animate-pulse text-indigo-300" />
            {isStreaming && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                ARIA <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-sans uppercase font-semibold">Intelligence Layer</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Personal Fashion Intelligence Interface orchestrating LOOK VISION core neural models & style memory
            </p>
          </div>
        </div>

        {/* Telemetry controls & quick metrics */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <div className="text-[11px] font-mono">
              <span className="text-zinc-400">Intent: </span>
              <span className="text-indigo-300 font-bold uppercase">{activeIntent}</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-[11px] font-mono">
              <span className="text-zinc-400">CoT Engine: </span>
              <span className="text-amber-300 font-bold">Active</span>
            </div>
          </div>

          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 hover:from-indigo-600/30 hover:to-violet-600/30 border border-indigo-500/30 text-indigo-300 transition-all text-xs font-mono flex items-center gap-1.5 font-medium"
              title="Recalibrate ARIA Identity & Style Passport"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Identity Calibration</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
            title="Refresh System Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>

      {/* Connected Subsystems Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4 relative z-10">
        {systems.map((sys) => (
          <motion.div
            key={sys.id}
            whileHover={{ scale: 1.02 }}
            className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-indigo-500/20 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 group-hover:text-indigo-300 transition-colors">
                {sys.category}
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            </div>

            <h4 className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
              {sys.name}
            </h4>

            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono text-zinc-400">
              <span>{sys.version}</span>
              <span className="text-indigo-400 font-semibold">{sys.latencyMs}ms</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
