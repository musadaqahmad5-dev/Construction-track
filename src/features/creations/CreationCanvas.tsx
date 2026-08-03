import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sliders, Palette, Layers, Sparkles, ShieldCheck, 
  RotateCcw, Save, ArrowRight, Wand2, RefreshCw, Eye, CheckCircle2, AlertCircle
} from 'lucide-react';
import { FashionCreation, CreationVersion, ARIACreativeSuggestion } from './CreationTypes';

interface CreationCanvasProps {
  creation: FashionCreation | null;
  onUpdateCreation: (updatedCreation: FashionCreation, versionLog?: CreationVersion) => void;
  onTryOnRequested?: (creation: FashionCreation) => void;
  onPublishRequested?: (creation: FashionCreation) => void;
}

const FABRIC_OPTIONS = [
  'Italian Mulberry Silk & Cashmere',
  'Tuscan Full-Grain Calfskin Leather',
  'Technical Liquid Metallic Nylon',
  'Savile Row Wool Tweed',
  'Japanese Raw Selvedge Denim',
  'Ethereal Silk Organza',
  'Plush Royal Velvet',
  '3D-Printed Kevlar Mesh'
];

const SILHOUETTE_OPTIONS = [
  'Architectural Tailored Structured',
  'Oversized Boxy Dropped-Shoulder',
  'Ethereal Floor-Length Draped',
  'Double-Breasted Hourglass',
  'Asymmetric Sculpted Avant-Garde',
  'Fluid Streamlined Slip'
];

const PATTERN_OPTIONS = [
  'Solid Matte Monochrome',
  'Architectural Pinstripe Lines',
  'Reflective Monogram Grid',
  'Subtle Gradient Shading',
  'Abstract Organic Floral',
  'High-Contrast Geometric'
];

export const CreationCanvas: React.FC<CreationCanvasProps> = ({
  creation,
  onUpdateCreation,
  onTryOnRequested,
  onPublishRequested
}) => {
  if (!creation) {
    return (
      <div className="bg-[#07070c] border border-white/5 rounded-2xl p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <Sliders className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Creation Selected in Atelier Canvas</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Synthesize a prompt or select a concept from the generator to begin interactive 3D/2D fabric & drape refinement.
        </p>
      </div>
    );
  }

  const [currentFabric, setCurrentFabric] = useState(creation.fabric);
  const [currentSilhouette, setCurrentSilhouette] = useState(creation.silhouette || SILHOUETTE_OPTIONS[0]);
  const [currentPattern, setCurrentPattern] = useState('Solid Matte Monochrome');
  const [luxuryIntensity, setLuxuryIntensity] = useState(creation.luxuryIntensity || 85);
  const [modernVsClassic, setModernVsClassic] = useState(creation.modernVsClassic || 70);
  const [colors, setColors] = useState<string[]>(creation.colorPalette || ['#05050A', '#1C1C28', '#8B5CF6', '#D4AF37']);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state if creation changes from outside
  useEffect(() => {
    setCurrentFabric(creation.fabric);
    setCurrentSilhouette(creation.silhouette || SILHOUETTE_OPTIONS[0]);
    setLuxuryIntensity(creation.luxuryIntensity || 85);
    setModernVsClassic(creation.modernVsClassic || 70);
    setColors(creation.colorPalette || ['#05050A', '#1C1C28', '#8B5CF6', '#D4AF37']);
  }, [creation.id]);

  // Derive dynamic ARIA creative suggestions
  const suggestions: ARIACreativeSuggestion[] = [
    {
      id: 'sug-1',
      type: 'style_dna',
      title: 'Style DNA Alignment',
      description: `Your design aligns ${Math.min(99, creation.confidenceScore + 4)}% with your Minimalist & Luxury Style DNA.`,
      metricLabel: 'Alignment',
      metricValue: `${Math.min(99, creation.confidenceScore + 4)}%`,
      impactColor: 'text-indigo-400'
    },
    {
      id: 'sug-2',
      type: 'luxury_score',
      title: 'Luxury Index Boost',
      description: luxuryIntensity > 80 
        ? 'High luxury score achieved with gold/champagne accent trim.' 
        : 'Increasing Luxury Intensity above 80% unlocks Bespoke Couture badge.',
      metricLabel: 'Luxury Index',
      metricValue: `${luxuryIntensity}/100`,
      impactColor: 'text-amber-400'
    },
    {
      id: 'sug-3',
      type: 'synergy',
      title: 'Wardrobe Synergy',
      description: 'This garment silhouette integrates seamlessly with 8 items in your active closet.',
      metricLabel: 'Synergy',
      metricValue: '+18% Match',
      impactColor: 'text-emerald-400'
    }
  ];

  const handleApplyRefinements = async (changeReason: string) => {
    setIsUpdating(true);

    const changesList: string[] = [];
    if (currentFabric !== creation.fabric) changesList.push(`Fabric changed to ${currentFabric}`);
    if (currentSilhouette !== creation.silhouette) changesList.push(`Silhouette adjusted to ${currentSilhouette}`);
    if (luxuryIntensity !== creation.luxuryIntensity) changesList.push(`Luxury intensity set to ${luxuryIntensity}%`);
    if (modernVsClassic !== creation.modernVsClassic) changesList.push(`Modern vs Classic ratio set to ${modernVsClassic}%`);

    if (changesList.length === 0) changesList.push('Fine-tuned drape & color tones');

    const newVersionNumber = (creation.confidenceScore % 10) + 1;

    const versionLog: CreationVersion = {
      id: `ver-${Date.now()}`,
      creationId: creation.id,
      versionNumber: newVersionNumber,
      imageUrl: creation.imageUrl,
      changes: changesList,
      feedback: changeReason || 'Refined parameters via Creation Canvas Studio',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parameters: {
        colorPalette: colors,
        fabric: currentFabric,
        silhouette: currentSilhouette,
        patternVariation: currentPattern,
        luxuryIntensity,
        modernVsClassic
      }
    };

    const updated: FashionCreation = {
      ...creation,
      fabric: currentFabric,
      silhouette: currentSilhouette,
      colorPalette: colors,
      luxuryIntensity,
      modernVsClassic,
      confidenceScore: Math.min(99, creation.confidenceScore + 2)
    };

    await new Promise(res => setTimeout(res, 500));
    setIsUpdating(false);
    onUpdateCreation(updated, versionLog);

    window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
      detail: `✓ Canvas changes updated & logged to Creation Timeline!`
    }));
  };

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-xl">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>Creation Canvas & Refinement Studio</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Atelier
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Interactive drape, fabric texture & luxury intensity controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onTryOnRequested && (
            <button
              onClick={() => onTryOnRequested(creation)}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Try On Garment</span>
            </button>
          )}

          {onPublishRequested && (
            <button
              onClick={() => onPublishRequested(creation)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish to Market</span>
            </button>
          )}
        </div>
      </div>

      {/* TWO COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PREVIEW IMAGE CARD */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#05050a] group">
            <img
              src={creation.imageUrl}
              alt={creation.title}
              className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-4 left-4 right-4 space-y-1 text-left">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 uppercase">
                {creation.category}
              </span>
              <h4 className="text-base font-bold text-white truncate">{creation.title}</h4>
              <p className="text-xs text-zinc-400 truncate">{creation.stylingDirection}</p>
            </div>
          </div>

          {/* ARIA CREATIVE ASSISTANCE INSIGHTS */}
          <div className="bg-[#05050a] border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Wand2 className="w-4 h-4 text-indigo-400" />
              <span>ARIA Intelligent Design Suggestions</span>
            </div>

            <div className="space-y-2 text-left">
              {suggestions.map((sug) => (
                <div key={sug.id} className="p-2.5 bg-white/5 rounded-lg border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{sug.title}</span>
                    <span className={`font-mono text-[11px] font-bold ${sug.impactColor}`}>
                      {sug.metricValue}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{sug.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REFINEMENT CONTROLS */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* FABRIC SELECTION */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>Fabric & Texture Weave</span>
              <span className="text-indigo-400 font-mono text-[11px]">{currentFabric}</span>
            </label>

            <select
              value={currentFabric}
              onChange={(e) => setCurrentFabric(e.target.value)}
              className="w-full bg-[#05050a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
            >
              {FABRIC_OPTIONS.map((f, i) => (
                <option key={i} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* SILHOUETTE */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>3D Silhouette & Cut</span>
              <span className="text-indigo-400 font-mono text-[11px]">{currentSilhouette}</span>
            </label>

            <select
              value={currentSilhouette}
              onChange={(e) => setCurrentSilhouette(e.target.value)}
              className="w-full bg-[#05050a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
            >
              {SILHOUETTE_OPTIONS.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* PATTERN VARIATION */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Pattern & Surface Overlay
            </label>

            <select
              value={currentPattern}
              onChange={(e) => setCurrentPattern(e.target.value)}
              className="w-full bg-[#05050a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
            >
              {PATTERN_OPTIONS.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* SLIDERS: LUXURY INTENSITY & MODERN VS CLASSIC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#05050a] p-4 rounded-xl border border-white/5">
            {/* LUXURY INTENSITY */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Luxury Intensity</span>
                <span className="font-mono text-amber-400 font-bold">{luxuryIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={luxuryIntensity}
                onChange={(e) => setLuxuryIntensity(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Minimal</span>
                <span>Haute Couture</span>
              </div>
            </div>

            {/* MODERN VS CLASSIC */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Modern vs Classic</span>
                <span className="font-mono text-indigo-400 font-bold">{modernVsClassic}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={modernVsClassic}
                onChange={(e) => setModernVsClassic(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Vintage Heritage</span>
                <span>Avant-Garde</span>
              </div>
            </div>
          </div>

          {/* COLOR PALETTE EDITING */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
              Color Palette Tonal Swatches
            </span>
            <div className="flex items-center gap-3">
              {colors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#05050a] p-2 rounded-xl border border-white/10">
                  <input
                    type="color"
                    value={c}
                    onChange={(e) => {
                      const newColors = [...colors];
                      newColors[idx] = e.target.value;
                      setColors(newColors);
                    }}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-zinc-300 uppercase">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* APPLY BUTTON */}
          <div className="pt-2">
            <button
              onClick={() => handleApplyRefinements('Refined fabric, drape & luxury balance')}
              disabled={isUpdating}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Canvas Refinements...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Canvas & Log Creation Version</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
