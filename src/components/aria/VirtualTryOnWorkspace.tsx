/**
 * ARIA v2.5 Virtual Try-On Workspace
 * Product: LOOK VISION v2.4
 * Theme: Moon Pearl Glow
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Eye, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  Shirt, 
  History, 
  Layers, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { useARIAContext } from '../../aria/core/ARIAContext';
import { VisionAnalysisResult, VisionAnalysisRequest } from '../../aria/vision/VisionTypes';
import { TryOnContextBuilder } from '../../aria/vision/TryOnContextBuilder';
import { CompatibilityBadge } from './CompatibilityBadge';
import { ColorPaletteWidget } from './ColorPaletteWidget';
import { OutfitAnalysisPanel } from './OutfitAnalysisPanel';
import { VisionHistoryTimeline } from './VisionHistoryTimeline';

interface VirtualTryOnWorkspaceProps {
  className?: string;
}

export const VirtualTryOnWorkspace: React.FC<VirtualTryOnWorkspaceProps> = ({
  className = ''
}) => {
  const { 
    visionHistory, 
    analyzeImage, 
    deleteVisionAnalysis, 
    visionStatus,
    styleDNAProfile,
    memories
  } = useARIAContext();

  const [activeTab, setActiveTab] = useState<'TRY_ON' | 'HISTORY'>('TRY_ON');
  const [imageName, setImageName] = useState('');
  const [sampleImage, setSampleImage] = useState<string>(
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
  );
  const [activeAnalysis, setActiveAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleImages = [
    { name: 'Tailored Single-Breasted Blazer Look', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Minimalist Monochromatic Wool Coat', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Casual Silk Cashmere Layered Ensemble', url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: VisionAnalysisRequest = {
        imageUrl: sampleImage,
        imageName: imageName.trim() || 'Custom Uploaded Garment Ensemble',
        targetContext: 'Virtual Try-On Compatibility Assessment'
      };

      const result = await analyzeImage(payload);
      setActiveAnalysis(result);
    } catch (err) {
      console.error('[VirtualTryOnWorkspace] Error analyzing image:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tryOnContext = activeAnalysis ? TryOnContextBuilder.buildContext(activeAnalysis, styleDNAProfile) : null;

  return (
    <div className={`space-y-6 text-left ${className}`}>
      {/* Workspace Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-[#05050a] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400 text-white shadow-lg shrink-0">
              <Eye className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                  ARIA v2.5 Visual Intelligence Layer
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-mono font-bold text-white uppercase tracking-wider mt-1">
                Virtual Try-On Intelligence Workspace
              </h2>
              <p className="text-xs text-zinc-400 font-serif italic mt-0.5">
                Garment Detection • Pattern & Fabric Recognition • Proportional Compatibility Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TRY_ON')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeTab === 'TRY_ON'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              Try-On Analyzer
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'HISTORY'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History ({visionHistory.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'TRY_ON' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Selector & Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#0a0a14] to-[#05050a] border border-white/10 space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 pb-2 border-b border-white/5">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                Garment / Look Image Source
              </h4>

              {/* Image Preview Box */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[3/4] flex items-center justify-center">
                <img
                  src={sampleImage}
                  alt="Fashion Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs font-mono text-white">
                  <span className="truncate">{imageName || 'Selected Fashion Ensemble'}</span>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded font-bold shrink-0">
                    HD Vision
                  </span>
                </div>
              </div>

              {/* Sample Preset Chooser */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Select Preset Look or Provide Custom Image Title
                </label>
                <div className="space-y-1.5">
                  {sampleImages.map((samp, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setSampleImage(samp.url);
                        setImageName(samp.name);
                      }}
                      className={`w-full p-2 rounded-xl border text-xs font-mono text-left cursor-pointer transition-all flex items-center gap-2 ${
                        sampleImage === samp.url
                          ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 font-bold'
                          : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border-white/5'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{samp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-3 pt-2">
                <input
                  type="text"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                  placeholder="Custom Look / Garment Name"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500/50 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || visionStatus.isAnalyzing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing Visual Intelligence Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Run Visual & Compatibility Analysis</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Analysis Results & Try-On Context */}
          <div className="lg:col-span-7 space-y-4">
            {activeAnalysis ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Visual Analysis & Compatibility Matrix
                  </h4>
                  <CompatibilityBadge score={activeAnalysis.compatibility.overallCompatibilityScore} size="lg" />
                </div>

                {/* Color Palette */}
                <ColorPaletteWidget palette={activeAnalysis.colorPalette} />

                {/* Outfit Panel */}
                <OutfitAnalysisPanel
                  garments={activeAnalysis.garments}
                  compatibility={activeAnalysis.compatibility}
                />

                {/* Try-On Context Box */}
                {tryOnContext && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-500/30 space-y-2">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Virtual Try-On Context & Pairing Advice
                    </h5>
                    <p className="text-xs font-mono text-zinc-200">
                      {tryOnContext.styleDNAPairingAdvise}
                    </p>
                    <div className="pt-1 text-[10px] font-mono text-zinc-400">
                      <span className="font-bold text-white">Recommended Styling Accessories:</span> {tryOnContext.recommendedAccessories.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-zinc-400 space-y-3">
                <Eye className="w-8 h-8 text-indigo-400 mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-zinc-200">Visual Intelligence Engine Ready</h4>
                <p className="max-w-md mx-auto">
                  Select a preset look on the left or upload a garment image to analyze garment categories, colors, fit profiles, and calculate Style DNA compatibility.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <VisionHistoryTimeline
          history={visionHistory}
          onDeleteAnalysis={deleteVisionAnalysis}
        />
      )}
    </div>
  );
};
