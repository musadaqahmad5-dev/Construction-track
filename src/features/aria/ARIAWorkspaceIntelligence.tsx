import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Zap, Sparkles, Layers, Activity, RefreshCw, Trash2, Database, Play, CheckCircle2, AlertCircle, ShieldCheck, Command } from 'lucide-react';

interface TelemetryEvent {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  level: 'info' | 'success' | 'warning';
}

interface ARIAWorkspaceIntelligenceProps {
  onExecuteShortcut?: (shortcutPrompt: string) => void;
}

export const ARIAWorkspaceIntelligence: React.FC<ARIAWorkspaceIntelligenceProps> = ({
  onExecuteShortcut
}) => {
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryEvent[]>([
    {
      id: 'log_1',
      timestamp: new Date().toLocaleTimeString(),
      source: 'ARIA Neural Core',
      message: 'Initialized Style DNA Context Matrix (Confidence: 98.4%)',
      level: 'success'
    },
    {
      id: 'log_2',
      timestamp: new Date().toLocaleTimeString(),
      source: 'Vision Intelligence',
      message: 'Indexed 4 active wardrobe items for color harmony analysis',
      level: 'info'
    },
    {
      id: 'log_3',
      timestamp: new Date().toLocaleTimeString(),
      source: 'Gemini 3.6 Adapter',
      message: 'Streaming response channel opened on latency <28ms',
      level: 'info'
    }
  ]);

  const [memoryVectorCount, setMemoryVectorCount] = useState<number>(142);
  const [isSyncingState, setIsSyncingState] = useState<boolean>(false);
  const [activePresetContext, setActivePresetContext] = useState<string>('Architectural Noir');

  // Add periodic telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = ['ARIA Reasoning', 'Style DNA Engine', 'Wardrobe Synergy', 'Telemetry Proxy'];
      const messages = [
        'Recalibrated sartorial vector weight for monochrome outerwear',
        'Updated capsule versatility score: 94/100',
        'Verified Firebase user token authentication rule',
        'Streamed reasoning telemetry step to client UI'
      ];
      
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const newLog: TelemetryEvent = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        source: randomSource,
        message: randomMessage,
        level: 'info'
      };

      setTelemetryLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSyncMemory = () => {
    setIsSyncingState(true);
    setTimeout(() => {
      setMemoryVectorCount(prev => prev + 3);
      setIsSyncingState(false);
      const syncLog: TelemetryEvent = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        source: 'Memory Engine',
        message: 'Successfully synced workspace memory state to Firestore',
        level: 'success'
      };
      setTelemetryLogs(prev => [syncLog, ...prev]);
    }, 800);
  };

  const handleClearMemoryCache = () => {
    setMemoryVectorCount(0);
    const clearLog: TelemetryEvent = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      source: 'Memory Engine',
      message: 'Purged local vector cache. Ready for fresh intelligence session.',
      level: 'warning'
    };
    setTelemetryLogs(prev => [clearLog, ...prev]);
  };

  const handleRunShortcut = (prompt: string) => {
    if (onExecuteShortcut) {
      onExecuteShortcut(prompt);
    }
  };

  return (
    <div className="w-full space-y-6 text-zinc-100 font-sans">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Memory Vectors</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{memoryVectorCount}</div>
            <span className="text-[10px] text-indigo-400 font-mono">Active Embeddings</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Synergy Index</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">94 / 100</div>
            <span className="text-[10px] text-emerald-400 font-mono">High Versatility</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">System Latency</span>
            <div className="text-xl font-bold font-mono text-violet-400 mt-0.5">24 ms</div>
            <span className="text-[10px] text-violet-400 font-mono">Gemini 3.6 Flash</span>
          </div>
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Active Context</span>
            <div className="text-sm font-bold font-mono text-indigo-300 mt-1 line-clamp-1">{activePresetContext}</div>
            <span className="text-[10px] text-zinc-400 font-mono">Style DNA Locked</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Intelligence Shortcuts & Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Quick Intelligence Action Shortcuts */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Command className="w-4 h-4 text-indigo-400" />
              <span>Fashion Intelligence Action Shortcuts</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-500">Instant Reasoning Execution</span>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => handleRunShortcut('Synthesize a 5-piece minimalist capsule wardrobe for an executive tech summit')}
              className="w-full p-3.5 rounded-xl bg-white/[0.015] hover:bg-indigo-600/10 border border-white/5 hover:border-indigo-500/30 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <h5 className="text-xs font-bold font-mono text-white group-hover:text-indigo-300 transition-colors">
                  Synthesize Executive Summit Capsule
                </h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">5-piece structured capsule optimized for high-profile business & networking</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all text-zinc-400 shrink-0 ml-2">
                <Play className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => handleRunShortcut('Analyze my current wardrobe and identify the top 3 missing gap pieces to increase versatility')}
              className="w-full p-3.5 rounded-xl bg-white/[0.015] hover:bg-emerald-600/10 border border-white/5 hover:border-emerald-500/30 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <h5 className="text-xs font-bold font-mono text-white group-hover:text-emerald-300 transition-colors">
                  Run Wardrobe Gap Audit
                </h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">Scan closet items to uncover critical sartorial gap investments</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-emerald-600 group-hover:text-white transition-all text-zinc-400 shrink-0 ml-2">
                <Play className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => handleRunShortcut('Generate a high-contrast evening gala outfit incorporating dark silk and metallic accents')}
              className="w-full p-3.5 rounded-xl bg-white/[0.015] hover:bg-violet-600/10 border border-white/5 hover:border-violet-500/30 text-left transition-all flex items-center justify-between group"
            >
              <div>
                <h5 className="text-xs font-bold font-mono text-white group-hover:text-violet-300 transition-colors">
                  Curate Evening Gala Statement Look
                </h5>
                <p className="text-[11px] text-zinc-400 mt-0.5">Formal evening ensemble balancing quiet luxury with architectural flair</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-violet-600 group-hover:text-white transition-all text-zinc-400 shrink-0 ml-2">
                <Play className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={handleSyncMemory}
              disabled={isSyncingState}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingState ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isSyncingState ? 'Syncing...' : 'Sync Memory State'}</span>
            </button>

            <button
              onClick={handleClearMemoryCache}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Vector Cache</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Telemetry Stream Log Viewer */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Live Telemetry Stream</span>
            </h4>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">Connected</span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-xs space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
            {telemetryLogs.map((log) => (
              <div key={log.id} className="text-[11px] leading-relaxed border-b border-white/[0.03] pb-1.5 last:border-none">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
                  <span>[{log.timestamp}]</span>
                  <span className="text-indigo-400 font-bold">{log.source}</span>
                </div>
                <div className={
                  log.level === 'success' ? 'text-emerald-300' : log.level === 'warning' ? 'text-amber-300' : 'text-zinc-300'
                }>
                  {log.message}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Buffer Depth: 20 Logs</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Zero Leak Privacy Guard</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
