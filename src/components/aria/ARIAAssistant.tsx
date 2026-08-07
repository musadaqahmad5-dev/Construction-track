/**
 * ARIA Conversational Assistant Experience Component
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Cpu,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  HelpCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { ariaExperienceController } from '../../features/ariaExperience/ARIAExperienceController';
import { ARIAConversationMessage, ARIAExperienceState } from '../../features/ariaExperience/ARIAExperienceTypes';
import { ARIAPrototypeController } from '../../features/ariaPrototype/ARIAPrototypeController';

import { LivePrototypeController } from '../../features/ariaLivePrototype/LivePrototypeController';
import { ARIAPrototypeLiveState } from '../../features/ariaLivePrototype/LivePrototypeTypes';
import { ARIAInvestorDashboard } from '../dashboard/ARIAInvestorDashboard';
import { ARIAUserProfileDashboard } from '../dashboard/ARIAUserProfileDashboard';
import { ARIAPreviewHealth } from '../dashboard/ARIAPreviewHealth';

interface ARIAAssistantProps {
  userId?: string;
  className?: string;
}

const QUICK_PROMPTS = [
  'Create a luxury summer executive travel outfit',
  'Analyze current tailored silhouette trends for 2026',
  'Optimize my capsule wardrobe for an autumn runway gala',
  'Predict my style trajectory over the next 6 months'
];

export const ARIAAssistant: React.FC<ARIAAssistantProps> = ({ userId = 'guest_user', className = '' }) => {
  const [expState, setExpState] = useState<ARIAExperienceState>(ariaExperienceController.getExperienceState());
  const [protoState, setProtoState] = useState<ARIAPrototypeLiveState>(LivePrototypeController.getInstance().getState());
  const [inputQuery, setInputQuery] = useState('');
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeExp = ariaExperienceController.subscribe((newState) => {
      setExpState(newState);
    });
    const unsubscribeProto = LivePrototypeController.getInstance().subscribe((newProto) => {
      setProtoState(newProto);
    });
    ariaExperienceController.initializeExperience(userId);
    LivePrototypeController.getInstance().initialize(userId);
    return () => {
      unsubscribeExp();
      unsubscribeProto();
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [expState.conversationHistory]);

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || inputQuery;
    if (!promptToSend.trim() || expState.isProcessing) return;

    if (!customPrompt) setInputQuery('');

    try {
      await ariaExperienceController.sendMessage(promptToSend, userId);
    } catch (_) {}
  };

  const handleScenario = async (scenario: 'LUXURY_OUTFIT' | 'VISION_ANALYSIS' | 'STYLE_EVOLUTION') => {
    try {
      await LivePrototypeController.getInstance().runScenario(scenario);
    } catch (_) {}
  };

  return (
    <div className={`bg-[#05050a] border border-white/10 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-2xl ${className}`}>
      {/* Header */}
      <div className="bg-[#07070c] border-b border-white/10 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-900 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">ARIA Autonomous Assistant</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-950/60 border border-violet-500/30 text-violet-300 font-semibold">
                v3.2 Prototype
              </span>
            </div>
            <p className="text-xs text-zinc-400">End-to-End Fashion Intelligence Integration</p>
          </div>
        </div>

        {/* Demo Scenarios Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleScenario('LUXURY_OUTFIT')}
            disabled={expState.isProcessing || protoState.isProcessing}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-[11px] font-medium text-indigo-300 hover:text-white transition-all"
          >
            ✈️ Scenario 1: Executive
          </button>
          <button
            onClick={() => handleScenario('VISION_ANALYSIS')}
            disabled={expState.isProcessing || protoState.isProcessing}
            className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-[11px] font-medium text-purple-300 hover:text-white transition-all"
          >
            📸 Scenario 2: Vision
          </button>
          <button
            onClick={() => handleScenario('STYLE_EVOLUTION')}
            disabled={expState.isProcessing || protoState.isProcessing}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/30 text-[11px] font-medium text-amber-300 hover:text-white transition-all"
          >
            🔮 Scenario 3: Trajectory
          </button>
          <button
            onClick={() => setShowInvestorModal(true)}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 hover:text-white transition-all flex items-center gap-1"
          >
            <BarChart3 className="w-3 h-3" /> Investor View
          </button>
          <button
            onClick={() => setShowUserProfileModal(true)}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-[11px] font-bold text-indigo-300 hover:text-white transition-all flex items-center gap-1"
          >
            <User className="w-3 h-3" /> User Profile
          </button>
          <button
            onClick={() => setShowHealthModal(true)}
            className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-1"
          >
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" /> Health Panel
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#05050a]/80">
        {expState.conversationHistory.map((msg: ARIAConversationMessage) => {
          const isUser = msg.sender === 'USER';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-zinc-800 text-zinc-200 border border-white/10'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-md shadow-indigo-500/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] space-y-2 ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-violet-900/40 border border-violet-500/30 text-zinc-100 rounded-tr-none'
                      : 'bg-[#0b0b14] border border-white/10 text-zinc-200 rounded-tl-none shadow-xl'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Explainable Confidence & Intent Badge */}
                  {!isUser && msg.confidenceReport && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          Intent: <strong className="text-violet-300">{msg.intent || 'GENERAL'}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Confidence {msg.confidenceReport.finalConfidence}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reasoning Traces Collapsible */}
                {!isUser && msg.reasoningTraces && msg.reasoningTraces.length > 0 && (
                  <div className="bg-[#08080f] border border-white/5 rounded-xl p-3 text-xs">
                    <button
                      onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                      className="flex items-center justify-between w-full text-zinc-400 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-indigo-300">
                          ARIA Reasoning Audit ({msg.reasoningTraces.length} Engines)
                        </span>
                      </div>
                      {expandedTraceId === msg.id ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedTraceId === msg.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2 border-t border-white/5 pt-2"
                        >
                          {msg.reasoningTraces.map((trace, idx) => (
                            <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-2.5 space-y-1">
                              <div className="flex items-center justify-between font-mono text-[10px]">
                                <span className="text-violet-400 font-bold">{trace.engineName}</span>
                                <span className="text-zinc-500">{trace.latencyMs}ms</span>
                              </div>
                              <p className="text-[11px] text-zinc-300">{trace.reasoningSummary}</p>
                              {trace.evidence && trace.evidence.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {trace.evidence.map((ev, eIdx) => (
                                    <span
                                      key={eIdx}
                                      className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-zinc-400"
                                    >
                                      {ev}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {expState.isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0b0b14] border border-white/10 text-xs text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
              <span>Orchestrating ARIA Intelligence Mesh...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2.5 bg-[#07070c] border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={(e) => handleSend(e, prompt)}
            disabled={expState.isProcessing}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-violet-900/30 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all whitespace-nowrap shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-[#07070c] border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask ARIA for fashion recommendations, trend analyses, or style concepts..."
          disabled={expState.isProcessing}
          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || expState.isProcessing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Execute</span>
        </button>
      </form>
      {/* Investor Dashboard Modal */}
      <AnimatePresence>
        {showInvestorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl my-8"
            >
              <ARIAInvestorDashboard onClose={() => setShowInvestorModal(false)} />
            </motion.div>
          </motion.div>
        )}

        {showUserProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl my-8"
            >
              <ARIAUserProfileDashboard onClose={() => setShowUserProfileModal(false)} />
            </motion.div>
          </motion.div>
        )}

        {showHealthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowHealthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setShowHealthModal(false)}
                  className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-white/10 z-10"
                >
                  ✕
                </button>
                <ARIAPreviewHealth />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

