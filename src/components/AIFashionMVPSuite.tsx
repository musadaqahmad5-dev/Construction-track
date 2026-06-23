import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Shirt, MapPin, Tag, Compass, AlertTriangle } from 'lucide-react';

interface OutfitItem {
  title: string;
  description: string;
  reason: string;
  style: string;
  occasion: string;
}

export const AIFashionMVPSuite: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [styleType, setStyleType] = useState('');
  const [season, setSeason] = useState('');
  const [mode, setMode] = useState<'live-ai' | 'offline-fallback' | 'fallback-error' | ''>('');
  const [warning, setWarning] = useState<string | null>(null);
  
  // Immersive micro-steps during generation to give an exquisite SaaS experience
  const [loadingStep, setLoadingStep] = useState('Consulting sartorial ledger...');

  const suggestions = [
    { label: "👔 Office formal look", value: "office formal look" },
    { label: "💍 Wedding outfit", value: "wedding outfit" },
    { label: "☀️ Casual summer wear", value: "casual summer wear" }
  ];

  const handleGenerate = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setWarning(null);
    setOutfits([]);
    setMode('');

    // Rotate loading statements
    const steps = [
      'Querying Gemini Cognitive Core...',
      'Analyzing seasonal coordinates...',
      'Deconstructing textile fits...',
      'Weaving styled cards...'
    ];
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex]);
        stepIndex++;
      }
    }, 900);

    try {
      const response = await fetch('/.netlify/functions/recommend-mvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to contact the styling engine: HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.mode === "CONFIG_ERROR") {
        throw new Error(data.error || "GEMINI_API_KEY missing in Netlify environment");
      }
      
      // Strict layout parsed verification with fallback options logic
      if (data && Array.isArray(data.outfits)) {
        setOutfits(data.outfits);
        setStyleType(data.style_type || 'Bespoke combination');
        setSeason(data.season || 'All-season');
        setMode(data._mode || 'live-ai');
        setWarning(data.warning || null);
      } else {
        throw new Error('The styling response is improperly formatted.');
      }
    } catch (err: any) {
      console.error('[AIFashionMVPSuite] Error fetching outfits:', err);
      setError(err?.message || 'Unable to establish connections. Reconnecting styling servers...');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white/[0.01] border border-white/5 rounded-2xl p-5 md:p-6 space-y-6 text-left selection:bg-white/10" id="ai-fashion-mvp-suite">
      {/* Module Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-xl border border-indigo-500/15">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">AI Stylist SaaS Suite</span>
            <h2 className="text-sm font-serif font-medium tracking-wide text-white">Cognitive Recommendation Engine</h2>
          </div>
        </div>
        <div className="text-[8.5px] font-mono text-white/30 uppercase tracking-widest hidden sm:block">
          [ Phase 2 MVP ]
        </div>
      </div>

      {/* Input Form & Buttons Setup */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g. wedding outfit, casual summer wear, office formal look..."
              className="w-full bg-black/40 hover:bg-black/60 focus:bg-black/80 text-xs text-white placeholder-white/20 border border-white/5 focus:border-indigo-500/30 rounded-xl py-3 px-4 outline-none transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate(userInput);
              }}
              disabled={loading}
              id="ai-stylist-user-input"
            />
          </div>
          <button
            onClick={() => handleGenerate(userInput)}
            disabled={loading || !userInput.trim()}
            className="cursor-pointer bg-white text-black hover:bg-neutral-200 disabled:bg-white/5 disabled:text-white/20 border border-transparent font-sans py-3 px-5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 select-none"
            id="ai-stylist-generate-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Outfit</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Quick Suggestions Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[8.5px] font-mono text-white/30 tracking-wider mr-1 uppercase">suggestions:</span>
          {suggestions.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUserInput(chip.value);
                handleGenerate(chip.value);
              }}
              disabled={loading}
              className="cursor-pointer text-[9.5px] font-mono text-white/60 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 px-2.5 py-1 rounded-lg transition-all active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State view */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-black/20 rounded-2xl border border-white/5 border-dashed"
            id="ai-stylist-loading-view"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border border-indigo-500/20 rounded-full animate-ping absolute" />
              <div className="w-10 h-10 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#dfd7c2]/60 animate-pulse">
                {loadingStep}
              </p>
              <p className="text-[8.5px] font-mono text-white/20 select-none">
                Connecting to cloud nodes
              </p>
            </div>
          </motion.div>
        )}

        {/* Error State view */}
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-950/20 border border-rose-500/15 rounded-xl flex items-start gap-3.5 text-left"
            id="ai-stylist-error-view"
          >
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">Styling Engine Link Interrupted</h4>
              <p className="text-xs text-rose-200/80 leading-relaxed font-serif italic">
                "{error}"
              </p>
              <button 
                onClick={() => handleGenerate(userInput)}
                className="text-[9px] font-mono text-rose-400 hover:text-white underline uppercase tracking-wider pt-1 border-none bg-none cursor-pointer block"
              >
                [ Retry request ]
              </button>
            </div>
          </motion.div>
        )}

        {/* Success Output view */}
        {outfits.length > 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5 pt-2 animate-fade-in"
            id="ai-stylist-success-view"
          >
            {warning && (
              <div className="bg-amber-500/10 border border-amber-500/15 p-4 rounded-xl flex items-start gap-3.5 text-left" id="ai-stylist-warning-banner">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-extrabold">API Configuration Notice</h4>
                  <p className="text-xs text-amber-200/80 leading-relaxed font-sans">
                    {warning}
                  </p>
                </div>
              </div>
            )}

            {/* Meta tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-black/30 border border-white/5 py-3 px-4 rounded-xl text-xs text-left">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-white/50">
                  <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-mono text-[10px] uppercase">Theme:</span>
                  <span className="text-white font-serif font-medium">{styleType}</span>
                </div>
                <div className="w-px h-3 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-white/50">
                  <Tag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="font-mono text-[10px] uppercase">Season:</span>
                  <span className="text-white font-serif font-medium">{season}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-white/40">
                <span>Mode:</span>
                <span className={`px-2 py-0.5 rounded ${mode === 'live-ai' ? 'bg-indigo-500/15 text-indigo-300' : 'bg-amber-500/15 text-amber-300'}`}>
                  {mode === 'live-ai' ? 'Live Gemini AI' : 'Deterministic fallback'}
                </span>
              </div>
            </div>

            {/* Generated Outfit Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {outfits.map((outfit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-[#121212]/30 hover:bg-[#141414]/50 border border-white/5 hover:border-white/15 p-4.5 rounded-xl transition-all duration-300 flex flex-col justify-between space-y-4 group text-left relative"
                  id={`ai-outfit-card-${index}`}
                >
                  <div className="space-y-2 text-left">
                    {/* Index & Style tag */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-mono text-white/30">LOOK 0{index + 1}</span>
                      <span className="text-[9px] font-mono bg-white/[0.03] text-indigo-300 border border-white/5 px-2 py-0.5 rounded uppercase">
                        {outfit.style}
                      </span>
                    </div>

                    {/* Outfit Title */}
                    <h3 className="text-xs font-serif font-medium text-white group-hover:text-amber-200 transition-colors mt-1 leading-snug">
                      {outfit.title}
                    </h3>

                    {/* Outfit Description */}
                    <p className="text-[11px] text-white/60 leading-relaxed font-serif italic pt-1">
                      "{outfit.description}"
                    </p>
                  </div>

                  {/* Outfit Recommendation Explanation & Occasion */}
                  <div className="space-y-3.5 pt-3 border-t border-white/5 text-left">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block">COORDINATION PRINCIPLE:</span>
                      <p className="text-[10.5px] text-[#dfd7c2]/80 leading-relaxed font-sans font-light">
                        {outfit.reason}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-white/40">
                      <MapPin className="w-3 h-3 text-amber-500/60 shrink-0" />
                      <span className="text-[9px] font-mono uppercase tracking-wider truncate">
                        {outfit.occasion}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Micro warning message about API settings */}
            {mode !== 'live-ai' && (
              <p className="text-[8.5px] font-mono text-white/20 text-center select-none pt-1">
                Note: Standard Gemini key is offline. Recommendations generated via expert sartorial lookbooks.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
