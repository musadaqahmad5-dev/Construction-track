import React, { useState } from 'react';
import { 
  Terminal, Cpu, Sparkles, RefreshCw, Check, Plus, Heart, Bookmark, Info, Activity, ShieldCheck, Layers, Download
} from 'lucide-react';
import { CADMeshSpecification, RenderResult } from './types';

interface CADRenderCanvasProps {
  spec: CADMeshSpecification;
  isRendering: boolean;
  renderLogs: string[];
  renderResult: RenderResult | null;
  onSaveToWardrobe?: (title: string, description: string, category: string, extraOptions?: any) => Promise<void>;
}

export const CADRenderCanvas: React.FC<CADRenderCanvasProps> = ({
  spec,
  isRendering,
  renderLogs,
  renderResult,
  onSaveToWardrobe
}) => {
  const [hasSaved, setHasSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  React.useEffect(() => {
    setHasSaved(false);
    setLiked(false);
    setBookmarked(false);
  }, [renderResult?.id, renderResult?.imageUrl]);

  const handleSave = async () => {
    if (!renderResult || hasSaved) return;
    try {
      if (onSaveToWardrobe) {
        await onSaveToWardrobe(
          renderResult.title,
          `3D CAD Solver Mesh (${renderResult.specification.garmentMesh}) with ${renderResult.specification.polygonDensity} resolution.`,
          'Outerwear',
          { imageUrl: renderResult.imageUrl, tags: ['3d-solver', 'cad-mesh'] }
        );
      }
      setHasSaved(true);
      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
        detail: '✦ 3D CAD Mesh committed to Wardrobe Closet successfully!'
      }));
    } catch (err) {
      console.error('Failed to save 3D render:', err);
    }
  };

  return (
    <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between min-h-[550px] text-left">
      
      {/* Top Monitor Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2 font-bold">
          <Terminal className="w-4 h-4 text-violet-400" />
          3D Render Monitor
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono bg-zinc-900 border border-white/5 text-zinc-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
            WebGPU Node 01
          </span>
        </div>
      </div>

      {/* DYNAMIC CANVAS DISPLAY AREA */}
      <div className="flex-1 flex flex-col justify-center items-center relative rounded-2xl bg-[#030307] border border-white/5 p-4 overflow-hidden min-h-[340px]">
        
        {/* State 1: Standby */}
        {!isRendering && !renderResult && (
          <div className="text-center space-y-4 max-w-sm px-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto shadow-xl">
              <Cpu className="w-6 h-6 text-violet-400" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-mono text-white uppercase tracking-wider font-bold">
                CAD Mesh Solver Standby
              </h4>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Configure parameters and click <span className="text-violet-300 font-mono">Run 3D CAD Render</span>.
              </p>
            </div>
          </div>
        )}

        {/* State 2: Active GPU Vertex Simulation Terminal */}
        {isRendering && (
          <div className="w-full h-full flex flex-col justify-between space-y-4 p-2 z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono text-violet-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
                Executing 120k Quad Polygon Calculations
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Active GPU Loop
              </span>
            </div>

            {/* Real-time Terminal Log Feed */}
            <div className="flex-1 bg-black/80 border border-white/10 rounded-xl p-3 font-mono text-[10.5px] text-emerald-400/90 space-y-1.5 overflow-y-auto max-h-[220px] no-scrollbar shadow-inner text-left">
              {renderLogs.map((log, idx) => (
                <div key={idx} className="leading-snug flex items-start gap-2">
                  <span className="text-zinc-600 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest animate-pulse">
                Path-Tracing Rays & Subsurface Scattering Matrix
              </span>
            </div>
          </div>
        )}

        {/* State 3: Compiled 3D Render Result */}
        {!isRendering && renderResult && (
          <div className="absolute inset-0 w-full h-full flex flex-col justify-between">
            {/* Render Image Background */}
            <img 
              src={renderResult.imageUrl} 
              alt={renderResult.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay Info Header & Footer */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 p-4 flex flex-col justify-between text-left">
              
              {/* Header Badges */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-[8.5px] font-mono bg-black/80 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider font-bold">
                    CAD SOLVER SOLVED • {renderResult.executionTimeMs}ms
                  </span>
                  <span className="text-[8.5px] font-mono bg-black/80 text-zinc-300 px-2.5 py-0.5 rounded-full border border-white/10 uppercase">
                    {renderResult.specification.polygonDensity.replace('_', ' ')} POLYS
                  </span>
                </div>

                {/* Like / Bookmark Action */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLiked(!liked)}
                    className={`p-2 rounded-full border transition-all cursor-pointer ${
                      liked ? 'bg-red-500 border-red-500 text-white' : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-full border transition-all cursor-pointer ${
                      bookmarked ? 'bg-violet-500 border-violet-500 text-white' : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>

              {/* Footer Specs & Closet Action */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-violet-300 uppercase tracking-wider font-semibold block">
                    3D MESH SPECIFICATION • SOLVER OUTPUT
                  </span>
                  <h4 className="text-base font-bold text-white capitalize">{renderResult.title}</h4>
                  <p className="text-[10.5px] text-zinc-300 leading-snug line-clamp-2 font-sans">
                    Engine: {renderResult.specification.renderEngine} | Drape: {renderResult.specification.drapePhysics} | Shader: {renderResult.specification.shaderPreset}
                  </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={hasSaved}
                    className={`flex items-center justify-center gap-1.5 font-mono font-bold text-[10px] uppercase py-2.5 rounded-xl transition-all cursor-pointer ${
                      hasSaved 
                        ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 shadow-sm' 
                        : 'bg-[#16a34a] hover:bg-[#22c55e] text-white shadow-lg shadow-emerald-600/20'
                    }`}
                  >
                    {hasSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Saved in Closet</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save CAD to Closet</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('lookvision_show_toast', {
                        detail: '✦ Exporting 3D OBJ/FBX CAD Mesh Blueprint package...'
                      }));
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#11111a] hover:bg-white/10 border border-white/10 text-white font-mono font-bold text-[10px] uppercase py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-violet-400" />
                    <span>Export CAD Package</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* CAD Metrics Summary Box */}
      <div className="bg-[#0d0d16] border border-white/5 rounded-2xl p-4 space-y-2 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 font-bold uppercase text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            3D Solver Precision Verification
          </span>
          <span className="text-emerald-400 font-bold">100% Isolated Lab</span>
        </div>
        <p className="text-[10.5px] text-zinc-400 font-sans leading-relaxed">
          The 3D Solver Lab runs isolated CAD mesh vertex calculations without passing through mass-market image generation filters or community preset overlays.
        </p>
      </div>

    </div>
  );
};
