import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shirt, Sparkles, User, Settings, CheckCircle, ChevronRight, Check, X, 
  HelpCircle, Calendar, Plus, RefreshCw, Trash2, Sliders, Play, Award, 
  UserCheck2, Sparkle
} from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '../types';
import { UnifiedFashionOS, UnifiedState } from '../features/ai-core/UnifiedFashionOS';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
  wardrobe: WardrobeItem[];
  onAddGarment: (title: string, description: string, category: ClothingCategory) => Promise<void>;
  onResetWardrobe: () => Promise<void>;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete, 
  onSkip, 
  wardrobe, 
  onAddGarment,
  onResetWardrobe
}) => {
  const [step, setStep] = useState(1); // Steps 1 to 6
  const [preferences, setPreferences] = useState<'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold'>('minimalist');
  const [vectorWeights, setVectorWeights] = useState<number[]>([0.7, 0.4, 0.5, 0.3, 0.2, 0.1, 0.6, 0.3]);
  const [tempTitle, setTempTitle] = useState('');
  const [tempCategory, setTempCategory] = useState<ClothingCategory>('Casual');
  const [tempDesc, setTempDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [satisfaction, setSatisfaction] = useState(90);

  // Constants
  const STEPS_TOTAL = 6;

  const handleStyleVibeChange = (vibe: 'minimalist' | 'classic' | 'streetwear' | 'vintage' | 'bold', idx: number) => {
    setPreferences(vibe);
    // Dynamically adjust preference weights vector based on vibe click
    const nextWeights = [...vectorWeights];
    nextWeights[idx] = Math.min(1.0, nextWeights[idx] + 0.2);
    setVectorWeights(nextWeights);
  };

  const handleAddFirstItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTitle.trim()) return;
    setIsAdding(true);
    try {
      await onAddGarment(tempTitle, tempDesc || 'Hand-picked during onboarding', tempCategory);
      setTempTitle('');
      setTempDesc('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSeedSamples = async () => {
    setIsAdding(true);
    try {
      await onResetWardrobe(); // Clear duplicates
      const samples = [
        { title: 'Tailored Single-Breasted Blazer', desc: 'Italian blazer, formal lightweight knit fabric', cat: 'Formal' as ClothingCategory },
        { title: 'Loopback Heavy Cotton Hoodie', desc: '100% organic cotton, baggy dropped shoulder fit', cat: 'Casual' as ClothingCategory },
        { title: 'Technical Shell Windrunner', desc: 'Waterproof outer layer with adjustable hood lining', cat: 'Sportswear' as ClothingCategory }
      ];
      for (const item of samples) {
        await onAddGarment(item.title, item.desc, item.cat);
      }
    } catch (err) {
      console.error("Failed seeding style templates:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const triggerOnboardCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      // Inject weight metrics into system
      UnifiedFashionOS.syncWardrobeItems(wardrobe);
      UnifiedFashionOS.generateOutfit(wardrobe, 'Your First Ensembled Look');
      setIsCompiling(false);
      setStep(5); // Progress to feedback step
    }, 1200);
  };

  const triggerFeedbackAction = (type: 'WORN_CONFIRMED' | 'IGNORED_SUGGESTION') => {
    const activeOutfit = UnifiedFashionOS.getState().activeSuggestion;
    if (!activeOutfit) return;
    
    setFeedbackSuccess(true);
    UnifiedFashionOS.receiveRealityFeedback(
      activeOutfit.id,
      activeOutfit.name,
      type,
      activeOutfit.suitabilityScore,
      85,
      satisfaction,
      activeOutfit.vibeTags
    );

    setTimeout(() => {
      setFeedbackSuccess(false);
      setStep(6); // Progress to completion step
    }, 1000);
  };

  const exitOnboardingComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center py-10 px-4" id="onboarding-flow-container">
      <div className="w-full max-w-xl bg-[#121212] border border-white/8 rounded-2xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
        
        {/* Progress bar header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
              <Shirt size={13} className="text-white" />
            </div>
            <span className="font-serif font-black text-sm text-white tracking-wide">Onboarding progress</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/55 font-bold uppercase tracking-wider">Step {step} of {STEPS_TOTAL}</span>
            <button 
              onClick={onSkip}
              className="text-[10px] font-mono tracking-widest font-bold text-white/40 hover:text-white uppercase cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Real Progress indicator bar */}
        <div className="w-full bg-white/5 h-1 rounded-full mb-8">
          <motion.div 
            className="bg-white h-1 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / STEPS_TOTAL) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Steps display screen */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.15 }}
            className="min-h-[300px] flex flex-col justify-between"
          >
            {/* STEP 1: WELCOME SCREEN */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-white/5 text-white rounded-2xl mx-auto flex items-center justify-center border border-white/10">
                    <Sparkles size={26} />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-white leading-tight">Welcome to Wardrobe Companion</h3>
                  <p className="text-xs text-white/60 font-light max-w-sm mx-auto leading-relaxed">
                    Build a smart, sustainable, and highly personalized closet workspace. Let us walk you through calibrating the recommendation engine.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-white hover:bg-neutral-200 text-black rounded-xl px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Get Started</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: STYLE PREFERENCES */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h4 className="font-serif font-black text-xl text-white">Define Your Style Signature</h4>
                  <p className="text-xs text-white/40 leading-snug">Choose the style aesthetic that best matches your daily taste vibe</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'minimalist', index: 0, label: 'Minimalist Clean', desc: 'Focus on lines, high contrast, neutral colors' },
                    { id: 'streetwear', index: 1, label: 'Streetwear Comfort', desc: 'Oversized shapes, sneakers, graphic layers' },
                    { id: 'classic', index: 2, label: 'Classic Editorial', desc: 'Tailored trousers, linen collars, retro warmth' },
                    { id: 'vintage', index: 3, label: 'Luxury Quiet', desc: 'Fine cashmere coat wear, subtle details' },
                    { id: 'bold', index: 4, label: 'Tech/Cyberpunk', desc: 'Technical weather jacket wear, buckles, zippers' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleStyleVibeChange(v.id as any, v.index)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[95px] ${
                        preferences === v.id
                          ? 'border-white bg-white/5 shadow-xs'
                          : 'border-white/8 bg-[#181818] hover:bg-[#202020]'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <strong className="text-xs text-white font-bold">{v.label}</strong>
                        {preferences === v.id && (
                          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                            <Check size={9} className="text-black" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-white/50 font-light leading-snug mt-2">{v.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-mono text-white/40 hover:text-white font-bold uppercase cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-white hover:bg-neutral-200 text-black rounded-xl px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ADD FIRST WARDROBE ITEMS */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h4 className="font-serif font-black text-xl text-white">Populate Your Digital Closet</h4>
                  <p className="text-xs text-white/40 leading-snug">Register at least 2 pieces of clothing, or load our curated aesthetic templates</p>
                </div>

                <div className="space-y-4">
                  {/* Quick Form */}
                  <form onSubmit={handleAddFirstItem} className="grid grid-cols-12 gap-2 bg-[#181818] p-4 rounded-xl border border-white/8">
                    <input
                      type="text"
                      placeholder="e.g. Classic Trench Coat"
                      required
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="col-span-6 bg-[#121212] border border-white/8 px-3 py-2 rounded-lg text-xs text-white placeholder-white/35 focus:ring-1 focus:outline-none focus:border-white/20"
                    />
                    <select
                      value={tempCategory}
                      onChange={(e) => setTempCategory(e.target.value as ClothingCategory)}
                      className="col-span-4 bg-[#121212] border border-white/8 px-2 py-2 rounded-lg text-xs text-white cursor-pointer focus:outline-none focus:border-white/20"
                    >
                      <option value="Casual">Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Sportswear">Sportswear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="col-span-2 bg-white hover:bg-neutral-200 text-black rounded-lg text-xs font-bold leading-none cursor-pointer flex items-center justify-center transition-colors"
                    >
                      + Add
                    </button>
                  </form>

                  {/* Curated list / loading */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40 uppercase">
                      <span>Closet catalog</span>
                      <span>{wardrobe.length} registered</span>
                    </div>

                    {wardrobe.length === 0 ? (
                      <div className="border border-white/10 border-dashed rounded-xl p-6 text-center space-y-4 bg-[#181818]">
                        <p className="text-xs text-white/40 font-serif italic">Your wardrobe is empty.</p>
                        <button
                          onClick={handleSeedSamples}
                          disabled={isAdding}
                          className="inline-flex border border-white/30 hover:border-white bg-[#121212] hover:bg-white hover:text-[#0A0A0A] text-white text-[10px] font-mono uppercase font-bold px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                        >
                          Load Curated Aesthetics
                        </button>
                      </div>
                    ) : (
                      <div className="max-h-[140px] overflow-y-auto space-y-2">
                        {wardrobe.map((item, idx) => (
                          <div key={item.id || idx} className="flex justify-between items-center p-3 border border-white/5 rounded-lg text-xs bg-[#181818]">
                            <strong className="text-white/90">{item.title}</strong>
                            <span className="text-[9px] font-mono bg-white/5 border border-white/10 rounded px-2 py-0.5 text-white/70 font-bold uppercase">{item.category}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-mono text-white/40 hover:text-white font-bold uppercase cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={wardrobe.length < 2 && !isAdding}
                    className="bg-white hover:bg-neutral-200 disabled:opacity-40 text-black rounded-xl px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed ({wardrobe.length}/2)</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: GENERATE FIRST OUTFIT */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-2xl mx-auto flex items-center justify-center">
                    <UserCheck2 size={26} />
                  </div>
                  <h3 className="text-2xl font-serif font-black text-white leading-tight">Unlocking Personalized Looks</h3>
                  <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
                    Based on your style vibe aesthetic input and your closet assets ({wardrobe.length} loaded), we are ready to execute our styled compilation algorithms.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs font-mono text-white/40 hover:text-white font-bold uppercase cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={triggerOnboardCompile}
                    disabled={isCompiling}
                    className="bg-white hover:bg-neutral-200 text-black rounded-xl px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {isCompiling ? (
                      <>
                        <RefreshCw className="animate-spin text-black" size={12} />
                        <span>Compiling looks...</span>
                      </>
                    ) : (
                      <>
                        <Sparkle size={12} className="text-black fill-black" />
                        <span>Compile First Look</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: RECORD FEEDBACK */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-black text-xl text-white">Your Generated Look</h4>
                    <p className="text-xs text-white/40 leading-snug">Record feedback to let our 8-dimensional style coefficients adjust</p>
                  </div>

                  <div className="p-5 bg-[#181818] rounded-2xl border border-white/8 text-left space-y-4 relative">
                    <div>
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.25em] block font-bold">Recommended Look</span>
                      <strong className="text-lg font-serif block text-white mt-1">
                        {UnifiedFashionOS.getState().activeSuggestion?.name || "Casual Double-Breasted blazer look"}
                      </strong>
                    </div>
                    
                    <div className="flex gap-4 items-center bg-[#121212] p-4 rounded-xl border border-white/5">
                      <div className="space-y-2 w-full">
                        <label className="text-[8px] font-mono text-white/50 block uppercase font-bold">Feedback satisfaction rating: {satisfaction}%</label>
                        <input
                          type="range" min="30" max="100" value={satisfaction}
                          onChange={(e) => setSatisfaction(parseInt(e.target.value))}
                          className="h-1 bg-white/10 rounded-lg appearance-none cursor-pointer w-full accent-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* success state -> white outline only */}
                    <button
                      onClick={() => triggerFeedbackAction('WORN_CONFIRMED')}
                      disabled={feedbackSuccess}
                      className="border border-white bg-transparent hover:bg-white/10 text-white py-3 rounded-xl text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                    >
                      <Check size={12} /> Confirm Worn
                    </button>
                    {/* error state -> solid white */}
                    <button
                      onClick={() => triggerFeedbackAction('IGNORED_SUGGESTION')}
                      disabled={feedbackSuccess}
                      className="bg-white hover:bg-neutral-200 text-black py-3 rounded-xl text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <X size={12} /> Skip / Reject
                    </button>
                  </div>

                  {feedbackSuccess && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-[10px] text-white/70 font-mono tracking-wide"
                    >
                      Backpropagating signal logic matching preferences coefficients...
                    </motion.p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 6: COMPLETE */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-white rounded-2xl mx-auto flex items-center justify-center">
                    <Award size={26} />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-white leading-tight">Calibration Complete!</h3>
                  <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed font-light">
                    Your style vector models have been compiled. The system is synchronized, persistent, and ready for your first 100 beta activities.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={exitOnboardingComplete}
                    className="bg-white hover:bg-neutral-200 text-black rounded-xl px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Enter SaaS Workspace</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
