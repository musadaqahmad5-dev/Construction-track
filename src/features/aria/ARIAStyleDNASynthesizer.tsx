import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, Palette, Shield, Sparkles, Check, Edit3, Plus, Trash2, Cpu, RefreshCw, BarChart2, Layers } from 'lucide-react';
import { ARIAStyleDNATrait } from './types';

interface ARIAStyleDNASynthesizerProps {
  userId?: string;
  onApplyDNAToChat?: (dnaPrompt: string) => void;
}

export const ARIAStyleDNASynthesizer: React.FC<ARIAStyleDNASynthesizerProps> = ({
  userId = 'guest-sartorialist-user-100',
  onApplyDNAToChat
}) => {
  const [dnaTraits, setDnaTraits] = useState<ARIAStyleDNATrait[]>([
    {
      id: 'dna_1',
      label: 'Primary Palette',
      value: 'Deep Charcoal, Midnight Navy, Off-White, Emerald Accents',
      category: 'Palette',
      confidenceScore: 0.98,
      source: 'Vision Analysis',
      isEditable: true
    },
    {
      id: 'dna_2',
      label: 'Archetype Profile',
      value: 'Sartorial Avant-Garde & Architectural Tailoring',
      category: 'Vibe',
      confidenceScore: 0.95,
      source: 'Inferred from History',
      isEditable: true
    },
    {
      id: 'dna_3',
      label: 'Silhouette Line',
      value: 'Structured Shoulders, Relaxed High-Waist Trousers, Fluid Layering',
      category: 'Silhouette',
      confidenceScore: 0.92,
      source: 'Behavioral Matrix',
      isEditable: true
    },
    {
      id: 'dna_4',
      label: 'Formality Window',
      value: 'Smart-Elevated Casual to Modern Black Tie Minimalist',
      category: 'Formality',
      confidenceScore: 0.96,
      source: 'User Stated',
      isEditable: true
    },
    {
      id: 'dna_5',
      label: 'Material Affinity',
      value: 'Heavyweight Italian Wool, Matte Silk, Raw Japanese Denim, Washed Linen',
      category: 'BrandAffinity',
      confidenceScore: 0.91,
      source: 'Inferred from History',
      isEditable: true
    },
    {
      id: 'dna_6',
      label: 'Climatic Adaptation',
      value: 'Breathable Inner Layers + Insulated Oversized Outer Coats',
      category: 'Seasonality',
      confidenceScore: 0.89,
      source: 'Behavioral Matrix',
      isEditable: true
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const categories = ['ALL', 'Palette', 'Vibe', 'Silhouette', 'Formality', 'BrandAffinity', 'Seasonality'];

  const filteredTraits = activeFilter === 'ALL'
    ? dnaTraits
    : dnaTraits.filter(t => t.category === activeFilter);

  const handleStartEdit = (trait: ARIAStyleDNATrait) => {
    setEditingId(trait.id);
    setEditValue(trait.value);
  };

  const handleSaveEdit = (id: string) => {
    setDnaTraits(prev =>
      prev.map(t => (t.id === id ? { ...t, value: editValue, confidenceScore: 0.99, source: 'User Stated' } : t))
    );
    setEditingId(null);
  };

  const handleRecalibrateDNA = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setDnaTraits(prev =>
        prev.map(t => ({
          ...t,
          confidenceScore: Math.min(0.99, Math.round((t.confidenceScore + 0.02) * 100) / 100)
        }))
      );
      setIsSynthesizing(false);
    }, 800);
  };

  return (
    <div className="w-full bg-[#07070c] border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Style DNA Connector
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono border border-violet-500/30">
                Cognitive Passport
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Personalized aesthetic weights and sartorial vectors calculated by ARIA Neural Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalibrateDNA}
            disabled={isSynthesizing}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
            <span>Recalibrate DNA</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
              activeFilter === cat
                ? 'bg-violet-600/30 text-white border border-violet-500/50 shadow-lg shadow-violet-500/10'
                : 'bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of DNA Traits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-2">
        {filteredTraits.map((trait) => {
          const isEditing = editingId === trait.id;
          const confPct = Math.round(trait.confidenceScore * 100);

          return (
            <motion.div
              key={trait.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-500/20 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
                  {trait.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500">{trait.source}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{confPct}%</span>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-zinc-300 mb-1.5">{trait.label}</h4>

              {isEditing ? (
                <div className="space-y-2 mt-2">
                  <textarea
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="w-full bg-black/60 border border-violet-500/40 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-violet-400 resize-none"
                    rows={2}
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 rounded bg-white/5 text-zinc-400 hover:text-white text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(trait.id)}
                      className="px-2.5 py-1 rounded bg-violet-600 text-white text-[11px] font-medium flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2 mt-1">
                  <p className="text-xs text-zinc-200 font-sans leading-relaxed flex-1">
                    {trait.value}
                  </p>
                  <button
                    onClick={() => handleStartEdit(trait)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-opacity"
                    title="Edit DNA Attribute"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Confidence Progress Line */}
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${confPct}%` }}
                />
              </div>

              {/* Action Chip to send DNA prompt to Chat */}
              {onApplyDNAToChat && !isEditing && (
                <button
                  onClick={() => onApplyDNAToChat(`Style DNA constraint (${trait.label}): ${trait.value}`)}
                  className="mt-3 w-full py-1.5 px-2 rounded-lg bg-white/[0.02] hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 text-[11px] text-zinc-400 hover:text-violet-300 font-mono flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span>Prompt ARIA with this DNA trait</span>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
