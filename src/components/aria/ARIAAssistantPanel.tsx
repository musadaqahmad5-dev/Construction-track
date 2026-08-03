/**
 * ARIA v2.5 Interactive Assistant Panel
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  X, 
  Activity, 
  Layers, 
  RefreshCw, 
  Sliders, 
  SlidersHorizontal,
  Bot,
  Zap,
  ShieldCheck,
  Search,
  Database
} from 'lucide-react';
import { useARIAContext } from '../../aria/core/ARIAContext';
import { ARIAStructuredResponse } from '../../aria/core/ARIATypes';
import { ARIAInsightCard } from './ARIAInsightCard';
import { ARIAStatusWidget } from './ARIAStatusWidget';
import { MemoryInsightWidget } from './MemoryInsightWidget';
import { FashionMemoryPanel } from './FashionMemoryPanel';

interface ARIAAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ARIAAssistantPanel: React.FC<ARIAAssistantPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { queryARIA, status, registeredModules, context, memorySummary, memories } = useARIAContext();

  const [inputQuery, setInputQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<ARIAStructuredResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'ASSISTANT' | 'MEMORY' | 'MODULES' | 'STATUS'>('ASSISTANT');
  const [isMemoryPanelOpen, setIsMemoryPanelOpen] = useState(false);

  const handleSendQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const queryText = inputQuery.trim();
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await queryARIA({
        query: queryText,
        intent: 'FashionAIQuery',
        targetModule: selectedModule !== 'all' ? selectedModule : undefined,
        contextOverrides: {
          currentWorkspace: context.currentWorkspace
        }
      });

      setResponses(prev => [res, ...prev]);
    } catch (err: any) {
      console.error('[ARIAAssistantPanel] Query dispatch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg h-full bg-[#05050a] border-l border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col text-left overflow-hidden relative"
        >
          {/* Moon Pearl Glow Backdrop Effect */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Panel Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-xl relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/30 text-violet-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-mono font-bold tracking-wider text-zinc-100 uppercase">
                    ARIA v2.5 Intelligence
                  </h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-serif italic">
                  Look Vision Fashion Operating System Core
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center border-b border-white/10 bg-white/[0.02] px-4 py-2 gap-2 relative z-10 overflow-x-auto no-scrollbar">
            {[
              { id: 'ASSISTANT', label: 'AI Assistant', icon: Bot },
              { id: 'MEMORY', label: `Memory (${memories.length})`, icon: Database },
              { id: 'MODULES', label: `Modules (${registeredModules.length})`, icon: Layers },
              { id: 'STATUS', label: 'System Status', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)] font-semibold' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10">
            {activeTab === 'ASSISTANT' && (
              <>
                {/* Compact Memory Insight Widget */}
                <MemoryInsightWidget 
                  summary={memorySummary} 
                  onOpenMemoryManager={() => setIsMemoryPanelOpen(true)} 
                />

                {/* Module Target Selector */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
                    <span>Target Engine Module:</span>
                  </div>
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg text-xs font-mono text-zinc-200 px-2 py-1 outline-none focus:border-violet-500/50 cursor-pointer"
                  >
                    <option value="all">Core Orchestrator (Auto)</option>
                    {registeredModules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Response Feed */}
                {responses.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-mono text-zinc-200 font-semibold">
                        ARIA Core & Memory System Active
                      </h4>
                      <p className="text-xs text-zinc-400 font-serif italic max-w-xs mx-auto mt-1">
                        "Ask ARIA regarding style curation, wardrobe synergy, remembered preferences, or confidence scoring."
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
                      {[
                        'What are my remembered favorite colors?',
                        'Evaluate my wardrobe coherence',
                        'Show my long-term style preferences',
                        'Run ARIA confidence diagnostic'
                      ].map((promptText, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputQuery(promptText);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-violet-500/15 border border-white/10 hover:border-violet-500/30 text-[11px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {responses.map((res) => (
                      <ARIAInsightCard key={res.id} response={res} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'MEMORY' && (
              <div className="space-y-4">
                <MemoryInsightWidget 
                  summary={memorySummary} 
                  onOpenMemoryManager={() => setIsMemoryPanelOpen(true)} 
                />

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold flex items-center gap-2">
                      <Database className="w-4 h-4 text-violet-400" />
                      Active Personal Memories ({memories.length})
                    </h4>
                    <button
                      onClick={() => setIsMemoryPanelOpen(true)}
                      className="text-xs font-mono text-violet-300 hover:underline"
                    >
                      Open Full Manager
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {memories.length === 0 ? (
                      <p className="text-xs font-mono text-zinc-400 italic py-4 text-center">
                        No explicit fashion memory items stored yet.
                      </p>
                    ) : (
                      memories.slice(0, 10).map((m) => (
                        <div key={m.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-violet-400 uppercase font-bold block">
                              {m.category.replace('_', ' ')}
                            </span>
                            <span className="text-zinc-200 text-xs">
                              {typeof m.value === 'string' ? m.value : JSON.stringify(m.value)}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {Math.round(m.confidence * 100)}%
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MODULES' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono text-zinc-400">
                  Registered modules are dynamically loaded by the ARIA Engine.
                </div>
                {registeredModules.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-violet-500/30 transition-all text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-mono font-bold text-zinc-100">{m.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        v{m.version}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans mt-2">
                      {m.description}
                    </p>

                    <div className="mt-3 space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                        Capabilities:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.capabilities.map((cap) => (
                          <span key={cap.id} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-zinc-300 border border-white/5">
                            {cap.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'STATUS' && (
              <div className="space-y-4">
                <ARIAStatusWidget />
                
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-left">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-semibold border-b border-white/5 pb-2">
                    System Architecture Info
                  </h4>
                  <div className="space-y-2 text-xs font-mono text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Version:</span>
                      <span>2.5.0-foundation</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Primary AI Gateway:</span>
                      <span>Gemini 3.6 Flash / 2.5 Flash</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Memory System:</span>
                      <span className="text-emerald-400 font-bold">Active (Offline Compatible)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Current Workspace:</span>
                      <span>{context.currentWorkspace}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Theme System:</span>
                      <span>{context.theme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Session ID:</span>
                      <span className="text-[10px] text-zinc-400 truncate max-w-[180px]">{context.sessionId}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Query Input Bar */}
          {activeTab === 'ASSISTANT' && (
            <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl relative z-10">
              <form onSubmit={handleSendQuery} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask ARIA v2.5 Core Foundation..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-sans text-zinc-100 placeholder-zinc-400 outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                  />
                  {isLoading && (
                    <RefreshCw className="w-4 h-4 text-violet-400 animate-spin absolute right-3 top-3.5" />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Memory Modal */}
          <FashionMemoryPanel 
            isOpen={isMemoryPanelOpen} 
            onClose={() => setIsMemoryPanelOpen(false)} 
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
