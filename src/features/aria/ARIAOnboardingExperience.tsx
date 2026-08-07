import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Fingerprint, Cpu, Layers, Check, ArrowRight, ShieldCheck, Zap, RefreshCw, X, Sliders, Briefcase, ShoppingBag, Palette, Target, Compass } from 'lucide-react';
import { ARIAStyleDNATrait } from './types';
import { UserIdentityBootstrapEngine } from '../identity/UserIdentityBootstrapEngine';
import { UserOnboardingProfile } from '../identity/userIdentityTypes';

interface ARIAOnboardingExperienceProps {
  isOpen: boolean;
  userId?: string;
  onClose: () => void;
  onCompleteOnboarding?: (traits: ARIAStyleDNATrait[], profile?: UserOnboardingProfile) => void;
}

export const ARIAOnboardingExperience: React.FC<ARIAOnboardingExperienceProps> = ({
  isOpen,
  userId = 'guest-sartorialist-user-100',
  onClose,
  onCompleteOnboarding
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // 1. Fashion Personality
  const [fashionPersonality, setFashionPersonality] = useState<string>('Architectural Modernist');

  // 2. Lifestyle Context
  const [lifestyleContext, setLifestyleContext] = useState<string>('Executive & Creative Director');

  // 3. Preferred Aesthetics
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>(['Architectural Tailoring', 'Quiet Luxury']);

  // 4. Color Preferences
  const [selectedColors, setSelectedColors] = useState<string[]>(['Midnight Onyx', 'Alabaster White', 'Electric Indigo']);

  // 5. Formality Level
  const [formalityLevel, setFormalityLevel] = useState<number>(0.75);

  // 6. Fashion Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Capsule Versatility', 'Wardrobe Gap Identification']);

  // 7. Shopping Behavior
  const [shoppingBehavior, setShoppingBehavior] = useState<string>('Investment Quality Long-Term');

  if (!isOpen) return null;

  // Options Data
  const personalityOptions = [
    { name: 'Architectural Modernist', desc: 'Sharp geometric cuts, structured shoulders, precise minimalist silhouettes' },
    { name: 'Cyber Techwear Visionary', desc: 'Ergonomic layering, waterproof tech textiles, dark modular hardware' },
    { name: 'Quiet Luxury Minimalist', desc: 'Unbranded perfection, silk crepe, Loro Piana cashmere, muted earth tones' },
    { name: 'Eco Botanical Artisan', desc: 'Organic linens, raw un-dyed cottons, botanical dyes, natural drape' },
    { name: 'Avant-Garde Sartorialist', desc: 'Asymmetric pleating, bold experimental volumes, high-contrast textures' }
  ];

  const lifestyleOptions = [
    { name: 'Executive & Creative Director', desc: 'High-visibility leadership, keynote presentations, formal dinners' },
    { name: 'Tech Innovator & Remote', desc: 'Fluid smart-casual, video conference elegance, movement flexibility' },
    { name: 'Active Urbanite & Globe-Trotter', desc: 'Packable luxury, weather-adaptive layers, high-velocity travel' },
    { name: 'Formal Event & Gala Specialist', desc: 'Evening wear focus, bespoke tailoring, red carpet readiness' }
  ];

  const aestheticOptions = [
    { id: 'aes_1', name: 'Architectural Tailoring', desc: 'Structured jackets, sharp lapels, tailored trousers' },
    { id: 'aes_2', name: 'Quiet Luxury', desc: 'Ultra-fine cashmere, subtle sheen, zero overt branding' },
    { id: 'aes_3', name: 'High-Contrast Luxe', desc: 'Jewel tone pops over obsidian slate canvases' },
    { id: 'aes_4', name: 'Modern Resort & Riviera', desc: 'Fluid linen trousers, unlined blazers, open collar silk' },
    { id: 'aes_5', name: 'Elevated Cyber Utility', desc: 'Modular pockets, taped zippers, ergonomic articulation' }
  ];

  const colorOptions = [
    { name: 'Midnight Onyx', hex: '#0a0a10', category: 'Dark' },
    { name: 'Alabaster White', hex: '#f4f4f6', category: 'Light' },
    { name: 'Electric Indigo', hex: '#6366f1', category: 'Accent' },
    { name: 'Camel Cashmere', hex: '#b48356', category: 'Warm' },
    { name: 'Sage Green', hex: '#48655b', category: 'Earth' },
    { name: 'Deep Espresso', hex: '#2c1e19', category: 'Dark' }
  ];

  const goalOptions = [
    { id: 'goal_1', name: 'Capsule Versatility', desc: 'Maximize outfit combinations with minimal core garments' },
    { id: 'goal_2', name: 'Event & Gala Styling', desc: 'High-yield recommendations for formal and evening occasions' },
    { id: 'goal_3', name: 'Weather Adaptation', desc: 'Smart layer adjustments based on real-time climate data' },
    { id: 'goal_4', name: 'Wardrobe Gap Identification', desc: 'Discover key missing pieces to complete outfit synergies' }
  ];

  const behaviorOptions = [
    { name: 'Investment Quality Long-Term', desc: 'Fewer, higher-quality heritage garments built to endure' },
    { name: 'Curated Sustainable Brands', desc: 'Strict ethical sourcing, organic fibers, circular manufacturing' },
    { name: 'High-Velocity Experimental', desc: 'Trend-forward avant-garde statements and limited drops' },
    { name: 'Minimalist Essential Staples', desc: 'Repeatable uniform of timeless functional core pieces' }
  ];

  const toggleAesthetic = (name: string) => {
    setSelectedAesthetics(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const toggleColor = (name: string) => {
    setSelectedColors(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const toggleGoal = (name: string) => {
    setSelectedGoals(prev =>
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
  };

  const getFormalityLabel = (val: number) => {
    if (val < 0.3) return 'Casual & Relaxed (0.2)';
    if (val < 0.6) return 'Smart Casual & Everyday (0.5)';
    if (val < 0.85) return 'Business Professional & Evening (0.75)';
    return 'Haute Formal & Black-Tie (0.95)';
  };

  const handleFinishOnboarding = async () => {
    setIsSynthesizing(true);

    const onboardingProfile: UserOnboardingProfile = {
      userId,
      completedAt: new Date().toISOString(),
      fashionPersonality,
      lifestyleContext,
      preferredAesthetics: selectedAesthetics,
      colorPreferences: selectedColors,
      formalityLevel,
      fashionGoals: selectedGoals,
      shoppingBehavior
    };

    try {
      // 1. Save to UserIdentityBootstrapEngine across Firestore paths:
      // - users/{uid}/onboarding/profile
      // - users/{uid}/styleDNA/profile
      // - users/{uid}/themeProfile/active
      // - users/{uid}/ariaProfile/context
      // - users/{uid}/identity/profile (isOnboardingCompleted: true)
      await UserIdentityBootstrapEngine.completeOnboarding(userId, onboardingProfile);

      // 2. Build ARIAStyleDNATrait array for callback compatibility
      const traits: ARIAStyleDNATrait[] = [
        {
          id: `dna_persona_${Date.now()}`,
          label: 'Fashion Personality',
          value: fashionPersonality,
          category: 'Vibe',
          confidenceScore: 0.99,
          source: 'User Stated',
          isEditable: true
        },
        {
          id: `dna_lifestyle_${Date.now()}`,
          label: 'Lifestyle Context',
          value: lifestyleContext,
          category: 'Vibe',
          confidenceScore: 0.98,
          source: 'User Stated',
          isEditable: true
        },
        {
          id: `dna_aesthetic_${Date.now()}`,
          label: 'Preferred Aesthetics',
          value: selectedAesthetics.join(', ') || 'Architectural Tailoring',
          category: 'Vibe',
          confidenceScore: 0.97,
          source: 'User Stated',
          isEditable: true
        },
        {
          id: `dna_colors_${Date.now()}`,
          label: 'Color Vectors',
          value: selectedColors.join(', ') || 'Midnight Onyx, Alabaster White',
          category: 'Palette',
          confidenceScore: 0.99,
          source: 'User Stated',
          isEditable: true
        },
        {
          id: `dna_formality_${Date.now()}`,
          label: 'Formality Preference',
          value: `${Math.round(formalityLevel * 100)}%`,
          category: 'Formality',
          confidenceScore: 0.99,
          source: 'User Stated',
          isEditable: true
        }
      ];

      setTimeout(() => {
        setIsSynthesizing(false);
        setIsCompleted(true);
        if (onCompleteOnboarding) {
          onCompleteOnboarding(traits, onboardingProfile);
        }
      }, 1000);
    } catch (err) {
      console.error('[ARIAOnboardingExperience] Onboarding completion error:', err);
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#06060c] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-zinc-100 max-h-[90vh] flex flex-col"
      >
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                ARIA Sartorial Calibration
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                  {isCompleted ? 'COMPLETED' : `Step ${currentStep} of 4`}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Personal AI Fashion Intelligence Workspace Initialization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {!isCompleted && (
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden my-4 relative z-10 shrink-0">
            <div
              className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Scrollable Step Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-2 relative z-10 space-y-4">
          {/* STEP 1: Personality & Lifestyle Context */}
          {currentStep === 1 && !isCompleted && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  1. Select Your Core Fashion Personality
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">Defines your primary Style DNA vector and silhouette preference.</p>
                <div className="grid grid-cols-1 gap-2 mt-3">
                  {personalityOptions.map((p) => {
                    const isSelected = fashionPersonality === p.name;
                    return (
                      <button
                        key={p.name}
                        onClick={() => setFashionPersonality(p.name)}
                        className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-mono">{p.name}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{p.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-500 border-indigo-300 text-white' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  2. Select Your Lifestyle Context
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">Calibrates daily occasion ratios and garment durability rules.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {lifestyleOptions.map((l) => {
                    const isSelected = lifestyleContext === l.name;
                    return (
                      <button
                        key={l.name}
                        onClick={() => setLifestyleContext(l.name)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-violet-950/40 border-violet-500/60 text-white shadow-lg shadow-violet-500/10'
                            : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div>
                          <h5 className="text-xs font-bold text-white font-mono">{l.name}</h5>
                          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{l.desc}</p>
                        </div>
                        <div className="flex justify-end mt-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase border ${
                            isSelected ? 'bg-violet-500/20 text-violet-300 border-violet-500/40' : 'bg-white/5 text-zinc-500 border-white/10'
                          }`}>
                            {isSelected ? 'Active' : 'Select'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Preferred Aesthetics & Color Preferences */}
          {currentStep === 2 && !isCompleted && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  3. Select Preferred Sartorial Aesthetics
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">Select one or more aesthetic vectors for ARIA's recommendation engine.</p>
                <div className="grid grid-cols-1 gap-2 mt-3">
                  {aestheticOptions.map((a) => {
                    const isSelected = selectedAesthetics.includes(a.name);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAesthetic(a.name)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div>
                          <h5 className="text-xs font-bold text-white font-mono">{a.name}</h5>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{a.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  4. Select Color Vector Preferences
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">Harmonizes vision color matching & background theme spectrum.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                  {colorOptions.map((c) => {
                    const isSelected = selectedColors.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        onClick={() => toggleColor(c.name)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md'
                            : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="text-left overflow-hidden">
                          <span className="text-xs font-medium text-white block truncate">{c.name}</span>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase block">{c.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Formality Level, Fashion Goals & Shopping Behavior */}
          {currentStep === 3 && !isCompleted && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  5. Formality Level Spectrum
                </h4>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mt-1">
                  <span>Target Preference:</span>
                  <span className="text-indigo-400 font-semibold">{getFormalityLabel(formalityLevel)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formalityLevel}
                  onChange={(e) => setFormalityLevel(parseFloat(e.target.value))}
                  className="w-full mt-3 accent-indigo-500 bg-white/10 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>0.0 Casual</span>
                  <span>0.5 Smart Casual</span>
                  <span>1.0 Black-Tie</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <Target className="w-4 h-4 text-purple-400" />
                  6. Select Priority Fashion Goals
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {goalOptions.map((g) => {
                    const isSelected = selectedGoals.includes(g.name);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.name)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/40 border-purple-500/60 text-white shadow-lg shadow-purple-500/10'
                            : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div>
                          <h5 className="text-xs font-bold text-white font-mono">{g.name}</h5>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{g.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-mono">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  7. Select Shopping Behavior Profile
                </h4>
                <div className="grid grid-cols-1 gap-2 mt-3">
                  {behaviorOptions.map((b) => {
                    const isSelected = shoppingBehavior === b.name;
                    return (
                      <button
                        key={b.name}
                        onClick={() => setShoppingBehavior(b.name)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-lg shadow-emerald-500/10'
                            : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div>
                          <h5 className="text-xs font-bold text-white font-mono">{b.name}</h5>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{b.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-500 border-emerald-300 text-white' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Synthesis & Final Review */}
          {currentStep === 4 && !isCompleted && (
            <div className="space-y-4">
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4" />
                    Personal Sartorial Identity Vector
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase border border-indigo-500/30 text-indigo-300 bg-indigo-950/40">
                    98.6% Accuracy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-indigo-500/20">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Fashion Personality:</span>
                    <span className="text-white font-medium">{fashionPersonality}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Lifestyle Context:</span>
                    <span className="text-white font-medium">{lifestyleContext}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Formality Preference:</span>
                    <span className="text-indigo-300 font-medium">{Math.round(formalityLevel * 100)}% ({getFormalityLabel(formalityLevel).split(' ')[0]})</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Shopping Behavior:</span>
                    <span className="text-emerald-300 font-medium">{shoppingBehavior.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-500/20">
                  <span className="text-zinc-500 block text-[10px] font-mono mb-1">Color Vectors:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedColors.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-zinc-300 font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-3 space-y-1 font-mono text-[10px] text-emerald-400/90">
                <span className="text-zinc-400 block mb-1">Firestore Document Targets:</span>
                <p>✓ users/{userId}/onboarding/profile</p>
                <p>✓ users/{userId}/styleDNA/profile</p>
                <p>✓ users/{userId}/themeProfile/active</p>
                <p>✓ users/{userId}/ariaProfile/context</p>
              </div>
            </div>
          )}

          {/* Completion Screen */}
          {isCompleted && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <ShieldCheck className="w-8 h-8 animate-bounce" />
              </div>
              <h4 className="text-xl font-bold text-white font-mono">Personalized Workspace Initialized</h4>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Your Style DNA Passport and ARIA Reasoning Context have been saved to Firestore. Welcome to your personalized LOOK VISION v2.4 workspace.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 cursor-pointer hover:scale-105 transition-all"
              >
                Enter Personalized Workspace
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Actions */}
        {!isCompleted && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10 shrink-0 mt-2">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono cursor-pointer"
              >
                Back
              </button>
            ) : (
              <span className="text-xs font-mono text-zinc-500">ARIA Identity Step 1 of 4</span>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishOnboarding}
                disabled={isSynthesizing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30 cursor-pointer"
              >
                <Zap className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>{isSynthesizing ? 'Saving to Firestore...' : 'Initialize Personalized Workspace'}</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
