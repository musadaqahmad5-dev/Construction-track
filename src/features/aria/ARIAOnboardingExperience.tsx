import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Fingerprint, Cpu, Layers, Check, ArrowRight, ShieldCheck, Zap, RefreshCw, X, Radio } from 'lucide-react';
import { ARIAStyleDNATrait } from './types';

interface ARIAOnboardingExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (traits: ARIAStyleDNATrait[]) => void;
}

export const ARIAOnboardingExperience: React.FC<ARIAOnboardingExperienceProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>(['Architectural Tailoring']);
  const [selectedPalettes, setSelectedPalettes] = useState<string[]>(['Monochrome Slate & Noir']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Capsule Versatility']);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  if (!isOpen) return null;

  const archetypes = [
    { id: 'arch_1', name: 'Architectural Tailoring', desc: 'Structured shoulders, sharp pleats, and precise silhouettes' },
    { id: 'arch_2', name: 'Minimalist Avant-Garde', desc: 'Monochromatic fluidity, unexpected textures, and quiet luxury' },
    { id: 'arch_3', name: 'High-Contrast Luxe', desc: 'Bold emerald, gold, or cobalt accents on deep dark canvases' },
    { id: 'arch_4', name: 'Modern Resort & Riviera', desc: 'Breathable linens, fluid trousers, and effortless elegance' },
    { id: 'arch_5', name: 'Elevated Cyber & Utility', desc: 'Functional tech textiles, ergonomic layering, and dark hardware' }
  ];

  const palettes = [
    { id: 'pal_1', name: 'Monochrome Slate & Noir', colors: ['#000000', '#1f2937', '#4b5563', '#f3f4f6'] },
    { id: 'pal_2', name: 'Deep Jewel & Night Shades', colors: ['#090d16', '#1e1b4b', '#064e3b', '#831843'] },
    { id: 'pal_3', name: 'Warm Sand & Earth Tones', colors: ['#292524', '#78350f', '#a16207', '#fef3c7'] },
    { id: 'pal_4', name: 'High Voltage Cyber Accents', colors: ['#09090b', '#4f46e5', '#10b981', '#f59e0b'] }
  ];

  const goals = [
    { id: 'goal_1', name: 'Capsule Versatility', desc: 'Maximize outfit combinations with minimal core garments' },
    { id: 'goal_2', name: 'Event & Gala Styling', desc: 'High-yield recommendations for formal and evening occasions' },
    { id: 'goal_3', name: 'Climate & Weather Adaptation', desc: 'Smart layer adjustments based on local temperature metrics' },
    { id: 'goal_4', name: 'Wardrobe Gap Identification', desc: 'Discover key pieces needed to complete existing outfit spreads' }
  ];

  const toggleArchetype = (name: string) => {
    setSelectedArchetypes(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const togglePalette = (name: string) => {
    setSelectedPalettes(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const toggleGoal = (name: string) => {
    setSelectedGoals(prev =>
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
  };

  const handleFinishOnboarding = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const newTraits: ARIAStyleDNATrait[] = [
        {
          id: `dna_onb_1_${Date.now()}`,
          label: 'Primary Archetype',
          value: selectedArchetypes.join(', ') || 'Architectural Tailoring',
          category: 'Vibe',
          confidenceScore: 0.99,
          source: 'User Stated',
          isEditable: true
        },
        {
          id: `dna_onb_2_${Date.now()}`,
          label: 'Color Vector Palette',
          value: selectedPalettes.join(', ') || 'Monochrome Slate & Noir',
          category: 'Palette',
          confidenceScore: 0.99,
          source: 'User Stated',
          isEditable: true
        },
        {
          id: `dna_onb_3_${Date.now()}`,
          label: 'Sartorial Priority Goal',
          value: selectedGoals.join(', ') || 'Capsule Versatility',
          category: 'Formality',
          confidenceScore: 0.98,
          source: 'User Stated',
          isEditable: true
        }
      ];

      localStorage.setItem('aria_onboarding_completed_v2.4', 'true');
      onCompleteOnboarding(newTraits);
      setIsSynthesizing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-[#07070d] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-zinc-100"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                ARIA Identity Calibration
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-sans">
                  Step {currentStep} of 3
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Personal Fashion Intelligence Calibration & Style DNA Passport Initialization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden my-5 relative z-10">
          <div
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: Archetype Calibration */}
        {currentStep === 1 && (
          <div className="space-y-4 relative z-10">
            <div>
              <h4 className="text-sm font-semibold text-white">Select Your Primary Aesthetic Archetypes</h4>
              <p className="text-xs text-zinc-400">ARIA uses these sartorial vectors to filter outfit recommendations and styling logic.</p>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {archetypes.map(arch => {
                const isSelected = selectedArchetypes.includes(arch.name);
                return (
                  <button
                    key={arch.id}
                    onClick={() => toggleArchetype(arch.name)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-600/10'
                        : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white font-mono">{arch.name}</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{arch.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Sartorial Palette */}
        {currentStep === 2 && (
          <div className="space-y-4 relative z-10">
            <div>
              <h4 className="text-sm font-semibold text-white">Select Your Preferred Color Palette Vectors</h4>
              <p className="text-xs text-zinc-400">Harmonizes vision color matching and background atmospheric lighting.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {palettes.map(pal => {
                const isSelected = selectedPalettes.includes(pal.name);
                return (
                  <button
                    key={pal.id}
                    onClick={() => togglePalette(pal.name)}
                    className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500/50 text-white shadow-lg shadow-violet-600/10'
                        : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xs font-bold text-white font-mono">{pal.name}</h5>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'bg-violet-600 border-violet-400 text-white' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        {pal.colors.map((c, i) => (
                          <span key={i} className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Priority Sartorial Goals */}
        {currentStep === 3 && (
          <div className="space-y-4 relative z-10">
            <div>
              <h4 className="text-sm font-semibold text-white">Select Your Core Sartorial Goals</h4>
              <p className="text-xs text-zinc-400">Calibrates ARIA's automated Reasoning Engine priority weights.</p>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {goals.map(goal => {
                const isSelected = selectedGoals.includes(goal.name);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.name)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-lg shadow-purple-600/10'
                        : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white font-mono">{goal.name}</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{goal.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/20'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10 relative z-10">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono"
            >
              Back
            </button>
          ) : (
            <span className="text-xs font-mono text-zinc-500">ARIA Calibration Mode</span>
          )}

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              disabled={isSynthesizing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30"
            >
              <Zap className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? 'Synthesizing Passport...' : 'Initialize ARIA Passport'}</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
