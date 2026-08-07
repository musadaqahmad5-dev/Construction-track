/**
 * ARIA Outfit Studio Component
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Wand2,
  Palette,
  Layers,
  ShieldCheck,
  Send,
  CheckCircle2,
  Grid
} from 'lucide-react';
import { ariaExperienceController } from '../../features/ariaExperience/ARIAExperienceController';
import { ARIAOutfitResult } from '../../features/ariaExperience/ARIAExperienceTypes';

interface ARIAOutfitStudioProps {
  userId?: string;
  className?: string;
}

export const ARIAOutfitStudio: React.FC<ARIAOutfitStudioProps> = ({
  userId = 'guest_user',
  className = ''
}) => {
  const [prompt, setPrompt] = useState('Create a luxury autumn evening editorial concept');
  const [occasion, setOccasion] = useState('Gala Editorial');
  const [season, setSeason] = useState('Autumn/Winter');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ARIAOutfitResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const studioResult = await ariaExperienceController.generateFashionConcept(
        prompt,
        occasion,
        season,
        userId
      );
      setResult(studioResult);
    } catch (_) {
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`bg-[#06060c] border border-purple-500/30 rounded-2xl p-6 space-y-6 shadow-2xl ${className}`}>
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Generative Outfit & Capsule Studio</h2>
            <p className="text-xs text-zinc-400">Generative Fashion Engine & Capsule Collection Synthesizer</p>
          </div>
        </div>

        {result && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Creative Confidence: {result.confidenceScore}%</span>
          </div>
        )}
      </div>

      {/* Generation Form */}
      <form onSubmit={handleGenerate} className="space-y-4 bg-[#0a0a14] border border-white/5 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Occasion Context</label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Seasonal Focus</label>
            <input
              type="text"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Creative Prompt</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe aesthetic concept, color palette, or tailoring style..."
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-purple-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'Synthesize'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Generated Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 pt-2"
        >
          {/* Concept Overview */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold uppercase">
                {result.aestheticTheme}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{result.conceptTitle}</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">{result.description}</p>
          </div>

          {/* Color Palette & Capsule Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Palette */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                Color Harmony Palette
              </h4>
              <div className="flex gap-2">
                {result.colorPalette.map((hex, idx) => (
                  <div key={idx} className="flex-1 space-y-1">
                    <div className="h-8 rounded-lg border border-white/10" style={{ backgroundColor: hex }} />
                    <span className="text-[9px] font-mono text-zinc-400 block text-center">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modular Capsule Pieces */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-400" />
                Modular Capsule Garments
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.capsuleSuggestions.map((piece, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-200">
                    {piece}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Styling Directions */}
          <div className="bg-[#080810] border border-white/5 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-mono text-purple-300 uppercase tracking-wider">Styling & Creative Direction</h4>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {result.stylingNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};
