import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Fingerprint, Cpu, Layers, MessageSquare, Terminal, RefreshCw, Zap, ShieldCheck, Palette, Brain, GitBranch } from 'lucide-react';
import { ARIASystemHeader } from './ARIASystemHeader';
import { ARIAStyleDNASynthesizer } from './ARIAStyleDNASynthesizer';
import { ARIAReasoningDiagnostics } from './ARIAReasoningDiagnostics';
import { ARIAWardrobeSynergyOptimizer } from './ARIAWardrobeSynergyOptimizer';
import { ARIAThemeWorkspaceAdapter } from './ARIAThemeWorkspaceAdapter';
import { ARIAWorkspaceIntelligence } from './ARIAWorkspaceIntelligence';
import { ARIAMemoryIntelligence } from './ARIAMemoryIntelligence';
import { ARIADecisionIntelligence } from './ARIADecisionIntelligence';
import { ARIAOnboardingExperience } from './ARIAOnboardingExperience';
import { AIStylistWorkspace } from '../aiStylist/AIStylistWorkspace';
import { WardrobeItem } from '../../types';

export interface ARIAIntelligenceInterfaceProps {
  userId?: string;
  initialSessionId?: string;
  wardrobe?: WardrobeItem[];
  onNavigate?: (view: string) => void;
}

export const ARIAIntelligenceInterface: React.FC<ARIAIntelligenceInterfaceProps> = ({
  userId = 'guest-sartorialist-user-100',
  initialSessionId,
  wardrobe = [],
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'STUDIO' | 'DNA' | 'DIAGNOSTICS' | 'WARDROBE_SYNERGY' | 'THEME_WORKSPACE' | 'WORKSPACE_INTEL' | 'MEMORY_INTEL' | 'DECISION_INTEL'>('STUDIO');
  const [activeIntent, setActiveIntent] = useState<string>('GENERAL');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Trigger prompt directly in ARIA Studio
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has completed first-time onboarding
    const completed = localStorage.getItem('aria_onboarding_completed_v2.4');
    if (!completed) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleApplyDNAToChat = (dnaPrompt: string) => {
    setActiveTab('STUDIO');
    setExternalPrompt(dnaPrompt);
  };

  const handleTestReasoning = (prompt: string) => {
    setActiveTab('STUDIO');
    setExternalPrompt(prompt);
  };

  const handlePromptForGap = (gapPrompt: string) => {
    setActiveTab('STUDIO');
    setExternalPrompt(gapPrompt);
  };

  const handleCompleteOnboarding = (traits: any[]) => {
    setActiveTab('DNA');
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#05050a] text-zinc-100 p-3 sm:p-6 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#05050a] via-[#07070f] to-[#05050a] pointer-events-none -z-10" />

      {/* ARIA System Header */}
      <ARIASystemHeader
        activeIntent={activeIntent}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* First-time Onboarding Modal */}
      <ARIAOnboardingExperience
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      {/* Main Mode Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('STUDIO')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'STUDIO'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span>ARIA Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('DNA')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'DNA'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20 border border-violet-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <Fingerprint className="w-4 h-4 text-violet-300" />
          <span>Style DNA Connector</span>
        </button>

        <button
          onClick={() => setActiveTab('DIAGNOSTICS')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'DIAGNOSTICS'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <Cpu className="w-4 h-4 text-indigo-300" />
          <span>Reasoning Diagnostics</span>
        </button>

        <button
          onClick={() => setActiveTab('WARDROBE_SYNERGY')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'WARDROBE_SYNERGY'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 border border-emerald-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-300" />
          <span>Capsule & Wardrobe Synergy</span>
        </button>

        <button
          onClick={() => setActiveTab('THEME_WORKSPACE')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'THEME_WORKSPACE'
              ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <Palette className="w-4 h-4 text-purple-300" />
          <span>Theme & Workspace Adaptation</span>
        </button>

        <button
          onClick={() => setActiveTab('WORKSPACE_INTEL')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'WORKSPACE_INTEL'
              ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-300" />
          <span>Workspace Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('MEMORY_INTEL')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'MEMORY_INTEL'
              ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-600/20 border border-violet-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <Brain className="w-4 h-4 text-indigo-300 animate-pulse" />
          <span>Memory Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('DECISION_INTEL')}
          className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'DECISION_INTEL'
              ? 'bg-gradient-to-r from-emerald-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-emerald-600/20 border border-emerald-400/30 font-semibold'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
          }`}
        >
          <GitBranch className="w-4 h-4 text-emerald-300" />
          <span>Decision Layer</span>
        </button>
      </div>

      {/* Main Tab Content Display */}
      <AnimatePresence mode="wait">
        {activeTab === 'STUDIO' && (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <AIStylistWorkspace
              userId={userId}
              initialSessionId={initialSessionId}
              onNavigate={onNavigate}
            />
          </motion.div>
        )}

        {activeTab === 'DNA' && (
          <motion.div
            key="dna"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ARIAStyleDNASynthesizer
              userId={userId}
              onApplyDNAToChat={handleApplyDNAToChat}
            />
          </motion.div>
        )}

        {activeTab === 'DIAGNOSTICS' && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ARIAReasoningDiagnostics
              onTestReasoning={handleTestReasoning}
            />
          </motion.div>
        )}

        {activeTab === 'WARDROBE_SYNERGY' && (
          <motion.div
            key="wardrobe"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ARIAWardrobeSynergyOptimizer
              wardrobe={wardrobe}
              onSelectOutfitItem={(item) => handleTestReasoning(`Build an architectural outfit around my ${item.title}`)}
              onPromptARIAForGap={handlePromptForGap}
            />
          </motion.div>
        )}

        {activeTab === 'THEME_WORKSPACE' && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ARIAThemeWorkspaceAdapter />
          </motion.div>
        )}

        {activeTab === 'WORKSPACE_INTEL' && (
          <motion.div
            key="workspace_intel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ARIAWorkspaceIntelligence
              onExecuteShortcut={(shortcutPrompt) => handleTestReasoning(shortcutPrompt)}
            />
          </motion.div>
        )}

        {activeTab === 'MEMORY_INTEL' && (
          <motion.div
            key="memory_intel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ARIAMemoryIntelligence
              userId={userId}
              onApplyPromptToStudio={(prompt) => handleTestReasoning(prompt)}
            />
          </motion.div>
        )}

        {activeTab === 'DECISION_INTEL' && (
          <motion.div
            key="decision_intel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ARIADecisionIntelligence
              userId={userId}
              wardrobe={wardrobe}
              onApplyOutfitToStudio={(outfitName) => handleTestReasoning(`Create a styling variation based on ${outfitName}`)}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
