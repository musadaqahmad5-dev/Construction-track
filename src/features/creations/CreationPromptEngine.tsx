import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Wand2, Sliders, RefreshCw, Cpu, Layers, 
  Palette, ShieldCheck, CheckCircle, ArrowRight, Zap, Lightbulb
} from 'lucide-react';
import { CreationPromptParameters } from './CreationTypes';

interface CreationPromptEngineProps {
  onParametersGenerated: (params: CreationPromptParameters) => void;
  userStyleDNA?: string[];
  isAnalyzing?: boolean;
}

export function transformUserPromptToFashionParameters(
  prompt: string, 
  userStyleDNA: string[] = ['Minimalist', 'Architectural', 'Monochrome', 'Quiet Luxury']
): CreationPromptParameters {
  const lower = prompt.toLowerCase();

  let silhouette = 'Tailored Structured';
  if (lower.includes('futuristic') || lower.includes('cyber')) silhouette = 'Architectural Angular Volumetric';
  else if (lower.includes('dress') || lower.includes('evening') || lower.includes('gown')) silhouette = 'Ethereal Floor-Length Draped';
  else if (lower.includes('street') || lower.includes('casual')) silhouette = 'Oversized Boxy Dropped-Shoulder';
  else if (lower.includes('jacket') || lower.includes('coat')) silhouette = 'Double-Breasted Hourglass Trench';

  let fabric = 'Italian Cashmere & Technical Silk';
  if (lower.includes('futuristic') || lower.includes('cyber')) fabric = 'Liquid Metallic Nylon & Kevlar Weave';
  else if (lower.includes('silk') || lower.includes('gown')) fabric = 'Heavy Mulberry Silk Organza';
  else if (lower.includes('leather')) fabric = 'Full-Grain Tuscan Calfskin Leather';
  else if (lower.includes('denim')) fabric = 'Japanese Selvedge Raw Denim';

  let texture = 'Matte Micro-Grid';
  if (lower.includes('glossy') || lower.includes('leather')) texture = 'High-Gloss Embossed Glossy';
  else if (lower.includes('metallic') || lower.includes('gold') || lower.includes('silver')) texture = 'Metallic Brushed Sheen';
  else if (lower.includes('cashmere') || lower.includes('wool')) texture = 'Plush Tactile Brushed Wool';

  let colorPalette = ['#05050A', '#1C1C28', '#8B5CF6', '#D4AF37'];
  if (lower.includes('street') || lower.includes('tokyo')) colorPalette = ['#0D0D12', '#22C55E', '#3B82F6', '#F43F5E'];
  else if (lower.includes('minimal') || lower.includes('quiet')) colorPalette = ['#09090D', '#27272A', '#A1A1AA', '#FAFAFA'];
  else if (lower.includes('summer') || lower.includes('resort')) colorPalette = ['#FAFAF9', '#E0F2FE', '#FEF08A', '#F97316'];

  let fashionEra = 'Contemporary Avant-Garde (2026+)';
  if (lower.includes('vintage') || lower.includes('90s')) fashionEra = '90s Minimalist Runway';
  else if (lower.includes('classic') || lower.includes('tailored')) fashionEra = 'Savile Row Timeless Classic';

  let occasion = 'High-Fashion Gala & Editorial Runway';
  if (lower.includes('street') || lower.includes('daily')) occasion = 'Metropolitan Luxury Streetwear';
  else if (lower.includes('business') || lower.includes('work')) occasion = 'Executive Power Dressing';

  let luxuryLevel = 'Haute Couture';
  if (lower.includes('street')) luxuryLevel = 'Streetwear Premium';
  else if (lower.includes('quiet') || lower.includes('cashmere')) luxuryLevel = 'Bespoke Luxury';

  const stylingDirection = `ARIA Synthesized concept based on "${prompt}". Harmonizes high-contrast textures with precise architectural drape.`;

  // Calculate alignment score with user's Style DNA
  const matchCount = userStyleDNA.filter(dna => 
    prompt.toLowerCase().includes(dna.toLowerCase()) || 
    silhouette.toLowerCase().includes(dna.toLowerCase()) ||
    fabric.toLowerCase().includes(dna.toLowerCase())
  ).length;

  const styleDNAScore = Math.min(98, Math.max(82, 85 + matchCount * 4));

  return {
    userPrompt: prompt,
    silhouette,
    fabric,
    texture,
    colorPalette,
    fashionEra,
    occasion,
    luxuryLevel,
    stylingDirection,
    styleDNAScore
  };
}

const PRESET_PROMPTS = [
  { label: 'Futuristic Cyber Haute Couture', prompt: 'Create an ultra-luxurious futuristic cyber couture gown with iridescent liquid metallic weave and glowing trim' },
  { label: 'Quiet Luxury Cashmere Coat', prompt: 'Bespoke double-breasted cashmere trench coat in deep charcoal and muted champagne accents' },
  { label: 'Neo-Tokyo Avant Streetwear', prompt: 'Architectural oversized technical bomber jacket with high-density modular pockets and neon edge highlights' },
  { label: 'Ethereal Silk Evening Collection', prompt: 'Ethereal floor-length draped silk gown with sculpted shoulder caps for red carpet galas' },
  { label: 'Architectural Techwear Outerwear', prompt: 'Weatherproof articulated urban shell jacket with laser-cut ventilation and matte black finish' }
];

export const CreationPromptEngine: React.FC<CreationPromptEngineProps> = ({
  onParametersGenerated,
  userStyleDNA = ['Minimalist', 'Architectural', 'Monochrome', 'Quiet Luxury'],
  isAnalyzing = false
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [currentParams, setCurrentParams] = useState<CreationPromptParameters | null>(null);

  const handleSynthesize = (promptToUse?: string) => {
    const text = promptToUse || inputPrompt;
    if (!text.trim()) return;
    
    const params = transformUserPromptToFashionParameters(text, userStyleDNA);
    setCurrentParams(params);
    onParametersGenerated(params);
  };

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>ARIA Prompt Intelligence Engine</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.4
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Transforms natural prompt intent into high-fidelity fashion parameters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300 font-mono flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Style DNA Active</span>
          </div>
        </div>
      </div>

      {/* INPUT BAR */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <span>Creative Vision Prompt</span>
          <span className="text-zinc-500 font-normal">({userStyleDNA.join(', ')})</span>
        </label>
        
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSynthesize()}
            placeholder="e.g. Create a futuristic luxury outfit with sculpted leather and metallic drape..."
            className="w-full bg-[#05050a] border border-white/10 rounded-xl px-4 py-3.5 pl-11 pr-32 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          <Sparkles className="w-4 h-4 text-indigo-400 absolute left-4 pointer-events-none" />
          
          <button
            onClick={() => handleSynthesize()}
            disabled={!inputPrompt.trim() || isAnalyzing}
            className="absolute right-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <span>Synthesize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* QUICK PRESETS */}
      <div className="space-y-2">
        <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Style DNA Quick Prompts:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputPrompt(preset.prompt);
                handleSynthesize(preset.prompt);
              }}
              className="px-3 py-1.5 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 rounded-lg text-xs text-zinc-300 hover:text-indigo-300 transition-all cursor-pointer font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* TRANSFORMED PARAMETERS INSIGHT CARD */}
      {currentParams && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#05050a] border border-indigo-500/20 rounded-xl p-4 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                ARIA Parameter Breakdown
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Style DNA Match: {currentParams.styleDNAScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase font-mono block">Silhouette</span>
              <span className="font-semibold text-zinc-200 block truncate">{currentParams.silhouette}</span>
            </div>

            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase font-mono block">Fabric & Weave</span>
              <span className="font-semibold text-zinc-200 block truncate">{currentParams.fabric}</span>
            </div>

            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase font-mono block">Luxury Level</span>
              <span className="font-semibold text-indigo-300 block truncate">{currentParams.luxuryLevel}</span>
            </div>

            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase font-mono block">Occasion</span>
              <span className="font-semibold text-zinc-200 block truncate">{currentParams.occasion}</span>
            </div>
          </div>

          {/* PALETTE DISCOVERY */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-zinc-400 font-medium">Derived Palette:</span>
            <div className="flex items-center gap-2">
              {currentParams.colorPalette.map((color, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono text-zinc-300">
                  <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                  <span>{color}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
