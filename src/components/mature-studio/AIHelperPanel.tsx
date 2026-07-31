import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bot, Wand2, X, ArrowRight, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';
import { AIHelperSuggestion } from '../../types/matureStudio';

interface AIHelperPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: AIHelperSuggestion) => void;
}

const PRESET_SUGGESTIONS: AIHelperSuggestion[] = [
  {
    title: "Chiaroscuro Obsidian Corsetry",
    category: "Luxury Corsetry",
    artisticTheme: "Cyber Chiaroscuro",
    material: "Liquid Obsidian Mesh & Anodized Gold Trim",
    prompt: "Anatomical sculptural corsetry with obsidian fluid drape, high compression rib structure, set against dramatic studio chiaroscuro lighting.",
    colorPalette: ["#0A0A0F", "#D97706", "#7C3AED"]
  },
  {
    title: "Photonic Organza Runway Gown",
    category: "Fantasy Gown",
    artisticTheme: "Bioluminescent Met Gala",
    material: "Fiber-Optic Silk & Fluid Organza",
    prompt: "Ethereal translucent fluid silk organza gown with integrated photonic bioluminescence, cascading volumetric drape, and subtle particle luminosity.",
    colorPalette: ["#10B981", "#3B82F6", "#EC4899"]
  },
  {
    title: "Avant-Garde Architectural Coat",
    category: "Sculptural Outerwear",
    artisticTheme: "Futuristic Structural Tailoring",
    material: "Anodized Liquid Titanium & Matte Latex",
    prompt: "Exaggerated architectural shoulders on an asymmetrical floor-length overcoat with laser-cut geometric ventilation and matte metallic luster.",
    colorPalette: ["#18181B", "#A1A1AA", "#6366F1"]
  },
  {
    title: "Body-Art Textile Silhouette",
    category: "Body-Art Textile",
    artisticTheme: "Second-Skin Haute Couture",
    material: "Micro-Embossed Velvet & Liquid Silicone",
    prompt: "Anatomically mapped body-art textile featuring intricate laser-etched lattice patterns that contour fluidly across the body with glossy highlights.",
    colorPalette: ["#05050A", "#818CF8", "#F43F5E"]
  }
];

export const AIHelperPanel: React.FC<AIHelperPanelProps> = ({
  isOpen,
  onClose,
  onApplySuggestion
}) => {
  const [customQuery, setCustomQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIHelperSuggestion[]>(PRESET_SUGGESTIONS);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleAskAI = async () => {
    if (!customQuery.trim()) return;

    setIsThinking(true);
    try {
      const response = await fetch('/api/mature-fashion/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Creative atelier request: ${customQuery}. Suggest a luxury haute couture concept.`,
          category: 'Editorial Couture',
          type: 'image'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const customGen: AIHelperSuggestion = {
          title: customQuery.length > 30 ? `${customQuery.substring(0, 30)}...` : customQuery,
          category: 'Editorial Couture',
          artisticTheme: 'AI Stylist Direct Inspiration',
          material: 'Anodized Silk & High-Frequency Mesh',
          prompt: `${customQuery} with anatomical couture draping, hyper-editorial lighting, and sculptural silhouette details.`,
          colorPalette: ["#0A0A0F", "#8B5CF6", "#38BDF8"]
        };
        setAiSuggestions([customGen, ...aiSuggestions]);
      }
    } catch (e) {
      // Fallback
    } finally {
      setIsThinking(false);
      setCustomQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#07070c] border border-violet-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.2)] text-zinc-100"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#0e0728] to-[#07070c] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-serif">Haute Couture AI Assistant</h3>
                <p className="text-[11px] text-zinc-400">On-demand editorial fashion director & concept generator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Custom Prompt Generator Bar */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Ask Creative Director AI
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g. Suggest a futuristic Met Gala gown inspired by liquid mercury..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  className="flex-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 font-sans"
                />
                <button
                  onClick={handleAskAI}
                  disabled={isThinking || !customQuery.trim()}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isThinking ? 'Inspiring...' : 'Inspire'}</span>
                </button>
              </div>
            </div>

            {/* Suggestions list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center space-x-1">
                  <Compass className="w-3.5 h-3.5 text-violet-400" />
                  <span>Curated Atelier Concepts</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Click concept to auto-fill studio</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiSuggestions.map((item, idx) => {
                  const itemKey = `${item.title}_${idx}`;
                  const isApplied = appliedId === itemKey;

                  return (
                    <div
                      key={itemKey}
                      onClick={() => {
                        setAppliedId(itemKey);
                        onApplySuggestion(item);
                        setTimeout(() => {
                          onClose();
                        }, 400);
                      }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 group relative overflow-hidden ${
                        isApplied
                          ? 'bg-violet-600/30 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                          : 'bg-slate-950/80 border-white/10 hover:border-violet-500/40 hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">{item.title}</span>
                        {isApplied ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 line-clamp-2 italic font-serif">"{item.prompt}"</p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                        <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-zinc-300">{item.category}</span>
                        <div className="flex items-center space-x-1">
                          {item.colorPalette.map((hex, cIdx) => (
                            <span key={cIdx} className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
