import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Eye, Terminal } from 'lucide-react';

export interface OnboardingWizardProps {
  userId: string;
  userEmail: string;
  onOnboardingComplete: (allocatedTheme: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ userId, userEmail, onOnboardingComplete }) => {
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // The 4 Flagship Theme Options presented beautifully to regular users
  const themeMoodboards = [
    {
      id: 'CYBER_HERITAGE',
      title: 'Cyber Heritage',
      description: 'Futuristic technical shell staging mixed with neon teal accents.',
      vibe: 'Techwear • Mono Spacing • Digital Cues',
      gradient: 'from-teal-500/20 to-blue-600/5',
      borderColor: 'group-hover:border-teal-400/40',
      activeHighlight: 'border-teal-400 bg-teal-500/10 text-teal-300'
    },
    {
      id: 'MINIMALIST_LUXURY',
      title: 'Minimalist Luxury',
      description: 'Poised negative spaces, soft stone tones, and quiet luxury lines.',
      vibe: 'Tailored Straight-Leg • Oatmeal Beige • Silent Luxury',
      gradient: 'from-zinc-500/10 to-zinc-800/5',
      borderColor: 'group-hover:border-zinc-400/40',
      activeHighlight: 'border-zinc-300 bg-white/5 text-zinc-100'
    },
    {
      id: 'HAUTE_COUTURE',
      title: 'Haute Couture',
      description: 'Avant-Garde runway drama, bold velvet tones, and artistic shapes.',
      vibe: 'Editorial Lookbooks • Royal Indigo • High-Fashion Serif',
      gradient: 'from-purple-500/20 to-pink-600/5',
      borderColor: 'group-hover:border-purple-400/40',
      activeHighlight: 'border-purple-400 bg-purple-500/10 text-purple-300'
    },
    {
      id: 'STREETWEAR_TECHNICAL',
      title: 'Streetwear Technical',
      description: 'Urban utility layers, dense concrete aesthetics, and bold outlines.',
      vibe: 'Gorpcore Vests • Dry Sage Moss • Heavy Warning Orange',
      gradient: 'from-orange-500/20 to-emerald-600/5',
      borderColor: 'group-hover:border-orange-400/40',
      activeHighlight: 'border-orange-500 bg-orange-500/10 text-orange-400'
    }
  ];

  const handleFinalizeProfile = async () => {
    setIsSubmitting(true);
    try {
      // Dispatches the dynamic selection straight to your pre-compiled Express gateway controller
      const response = await fetch('/api/v1/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          email: userEmail,
          manualSkinChoice: selectedSkin // If null, backend safely fires the random bucket allocator
        })
      });

      const result = await response.json();
      if (result.success) {
        onOnboardingComplete(result.payload.allocatedThemeSkin);
      }
    } catch (error) {
      console.error('[ONBOARDING FRONTEND ERROR] Allocation pipeline broken:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 animate-fadeIn">
      {/* Dynamic Progress Indicator Track */}
      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-12 border border-white/5">
        <div 
          className="bg-indigo-500 h-full transition-all duration-500 ease-out" 
          style={{ width: currentStep === 1 ? '50%' : '100%' }}
        />
      </div>

      {currentStep === 1 ? (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest">
              Aesthetic Calibration // Step 01
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">Select Your Starting Visual Skin</h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto font-medium">
              Choose a template that matches your design preference, or let the AI assign you a random category bucket instantly.
            </p>
          </div>

          {/* 🍱 Dynamic Asymmetrical Selection Grid Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themeMoodboards.map((skin) => {
              const isSelected = selectedSkin === skin.id;
              return (
                <div
                  key={skin.id}
                  onClick={() => setSelectedSkin(skin.id)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer bg-gradient-to-br ${skin.gradient} ${
                    isSelected 
                      ? skin.activeHighlight + ' shadow-2xl shadow-indigo-500/5 scale-[1.01]' 
                      : 'border-white/5 hover:border-zinc-700/50 bg-[#07070c]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-bold tracking-wide text-zinc-100">{skin.title}</h3>
                    <div className={`w-5 h-5 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-3">{skin.description}</p>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {skin.vibe}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <button
              onClick={() => {
                setSelectedSkin(null); // Explicitly passing null triggers random selection
                setCurrentStep(2);
              }}
              className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Skip & Let AI Choose Randomly ➔
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: SUMMARY CONFIRMATION RADAR */
        <div className="space-y-8 max-w-xl mx-auto text-center animate-slideUp">
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl inline-flex items-center justify-center text-indigo-400 mb-2 shadow-xl">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-wide">Confirm Passport Calibration</h2>
            <p className="text-xs text-zinc-400 font-medium">
              We are ready to synchronize your profile coordinates across the secure enterprise database cluster.
            </p>
          </div>

          <div className="bg-[#07070c] border border-white/5 rounded-xl p-4 text-left font-mono text-xs text-zinc-400 space-y-2 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5"><Terminal className="w-24 h-24" /></div>
            <div><span className="text-indigo-400">► ACCOUNT_UID:</span> {userId}</div>
            <div><span className="text-indigo-400">► SECURE_EMAIL:</span> {userEmail}</div>
            <div>
              <span className="text-indigo-400">► ALLOCATION_MODE:</span>{' '}
              {selectedSkin ? `MANUAL (${selectedSkin})` : 'PROGRAMMATIC RANDOM BUCKET'}
            </div>
            <div className="border-t border-white/5 pt-2 text-zinc-500">Ready to listen for firestore.rules gates...</div>
          </div>

          <button
            onClick={handleFinalizeProfile}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Finalize & Launch Workspace'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default OnboardingWizard;
