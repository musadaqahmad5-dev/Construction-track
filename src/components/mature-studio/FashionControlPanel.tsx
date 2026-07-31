import React from 'react';
import {
  Sliders,
  ImageIcon,
  Film,
  Crown,
  Feather,
  Flame,
  Palette,
  Wand2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Globe
} from 'lucide-react';
import {
  MatureFashionMode,
  MediaType,
  MatureStudioPromptPayload
} from '../../types/matureStudio';

interface FashionControlPanelProps {
  selectedMediaType: MediaType;
  setSelectedMediaType: (m: MediaType) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedMode: MatureFashionMode;
  setSelectedMode: (m: MatureFashionMode) => void;
  conceptPrompt: string;
  setConceptPrompt: (p: string) => void;
  material: string;
  setMaterial: (m: string) => void;
  colorPaletteInput: string;
  setColorPaletteInput: (cp: string) => void;
  artisticTheme: string;
  setArtisticTheme: (t: string) => void;
  drapeTension: number;
  setDrapeTension: (dt: number) => void;
  lighting: string;
  setLighting: (l: string) => void;
  texture: string;
  setTexture: (tx: string) => void;
  silhouette: string;
  setSilhouette: (s: string) => void;
  visibilityChoice: 'private' | 'public';
  setVisibilityChoice: (v: 'private' | 'public') => void;
  ageVerified: boolean;
  setAgeVerified: (v: boolean) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onOpenAIHelper: () => void;
  categories: string[];
}

const LIGHTING_OPTIONS = [
  { id: 'dramatic_chiaroscuro', label: 'Dramatic Chiaroscuro' },
  { id: 'neon_noir', label: 'Neon Noir Studio' },
  { id: 'hyper_editorial', label: 'Hyper-Editorial High Key' },
  { id: 'ethereal_glow', label: 'Ethereal Soft Glow' },
  { id: 'runway_spotlight', label: 'Cinematic Runway Spotlight' }
];

const SILHOUETTE_OPTIONS = [
  { id: 'architectural', label: 'Architectural Rigidity' },
  { id: 'anatomical_flow', label: 'Anatomical Contour Flow' },
  { id: 'exaggerated', label: 'Exaggerated Proportions' },
  { id: 'minimalist_asymmetric', label: 'Minimalist Asymmetric Drape' }
];

export const FashionControlPanel: React.FC<FashionControlPanelProps> = ({
  selectedMediaType,
  setSelectedMediaType,
  selectedCategory,
  setSelectedCategory,
  selectedMode,
  setSelectedMode,
  conceptPrompt,
  setConceptPrompt,
  material,
  setMaterial,
  colorPaletteInput,
  setColorPaletteInput,
  artisticTheme,
  setArtisticTheme,
  drapeTension,
  setDrapeTension,
  lighting,
  setLighting,
  texture,
  setTexture,
  silhouette,
  setSilhouette,
  visibilityChoice,
  setVisibilityChoice,
  ageVerified,
  setAgeVerified,
  isGenerating,
  onGenerate,
  onOpenAIHelper,
  categories
}) => {
  return (
    <div className="space-y-5 bg-[#07070c] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-violet-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Atelier Parameters</h2>
        </div>
        <button
          type="button"
          onClick={onOpenAIHelper}
          className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-[10px] font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer"
        >
          <Wand2 className="w-3 h-3 text-violet-400" />
          <span>AI Director Helper</span>
        </button>
      </div>

      {/* Media Format Selector */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
          Output Media Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedMediaType('image')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              selectedMediaType === 'image'
                ? 'bg-violet-600/30 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                : 'bg-slate-950/60 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-violet-400" />
            <span>Editorial Image</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMediaType('video')}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              selectedMediaType === 'video'
                ? 'bg-purple-600/30 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-slate-950/60 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <Film className="w-4 h-4 text-purple-400" />
            <span>Runway Video</span>
          </button>
        </div>
      </div>

      {/* Fashion Category Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
          Garment Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500 font-sans"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Artistic Style Presets */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
          Artistic Style Preset
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'editorial_couture', label: 'Editorial Couture', icon: Crown },
            { id: 'avant_garde', label: 'Avant-Garde', icon: Feather },
            { id: 'body_art_textile', label: 'Body-Art Textile', icon: Flame },
            { id: 'fantasy_conceptual', label: 'Fantasy Concept', icon: Palette }
          ].map((modeItem) => {
            const IconComp = modeItem.icon;
            const isSel = selectedMode === modeItem.id;
            return (
              <button
                key={modeItem.id}
                type="button"
                onClick={() => setSelectedMode(modeItem.id as MatureFashionMode)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center space-x-2 cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-violet-600/30 to-purple-600/30 border-violet-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-white/5 text-zinc-400 hover:border-white/20'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSel ? 'text-violet-400' : 'text-zinc-500'}`} />
                <span className="font-medium text-[11px]">{modeItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Concept Prompt Area */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Creative Prompt
          </label>
          <button
            type="button"
            onClick={onOpenAIHelper}
            className="text-[10px] text-violet-400 hover:underline font-mono"
          >
            Need inspiration?
          </button>
        </div>
        <textarea
          rows={3}
          value={conceptPrompt}
          onChange={(e) => setConceptPrompt(e.target.value)}
          placeholder="e.g. Sculptural obsidian corsetry with liquid drape tension, anatomical silhouette lines, and dark studio chiaroscuro lighting..."
          className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none font-sans"
        />
      </div>

      {/* Textile & Color Hex */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">Fabric / Material</label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono">Color Palette Hex</label>
          <input
            type="text"
            value={colorPaletteInput}
            onChange={(e) => setColorPaletteInput(e.target.value)}
            className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
          />
        </div>
      </div>

      {/* Fine-Tuning Controls */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 font-medium text-[11px]">Drape Tension & Compression</span>
            <span className="text-violet-400 font-semibold">{drapeTension}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={drapeTension}
            onChange={(e) => setDrapeTension(Number(e.target.value))}
            className="w-full accent-violet-500 bg-slate-950 rounded-lg cursor-pointer h-1.5"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono mb-1">Lighting</label>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none"
            >
              {LIGHTING_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase font-mono mb-1">Silhouette</label>
            <select
              value={silhouette}
              onChange={(e) => setSilhouette(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none"
            >
              {SILHOUETTE_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Memory Destination Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/10 text-xs">
        <span className="text-zinc-300 font-medium">Default Destination:</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setVisibilityChoice('private')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
              visibilityChoice === 'private'
                ? 'bg-violet-600 text-white font-bold'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            🔒 Private Memory
          </button>
          <button
            type="button"
            onClick={() => setVisibilityChoice('public')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
              visibilityChoice === 'public'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            🌐 Community Public
          </button>
        </div>
      </div>

      {/* 18+ Authorization Check */}
      <div className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center space-x-2.5">
        <input
          type="checkbox"
          id="panelAgeCheck"
          checked={ageVerified}
          onChange={(e) => setAgeVerified(e.target.checked)}
          className="rounded bg-slate-900 border-white/20 text-violet-600 focus:ring-violet-500 cursor-pointer"
        />
        <label htmlFor="panelAgeCheck" className="text-[10px] text-zinc-400 cursor-pointer select-none">
          I confirm 18+ creator authorization for advanced fashion expression.
        </label>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        disabled={isGenerating || !ageVerified}
        onClick={onGenerate}
        className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Synthesizing Haute Couture...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Synthesize {selectedMediaType === 'video' ? 'Runway Video' : 'Editorial Image'}</span>
          </>
        )}
      </button>
    </div>
  );
};
