import React from 'react';
import { 
  Cpu, Sliders, Box, Layers, Activity, Zap, Play, RefreshCw, Sparkles, SlidersHorizontal, Info, User
} from 'lucide-react';
import { 
  CADMeshSpecification, AvatarType, PoseKinematics, GarmentMesh, PolygonDensity, DrapePhysics, RenderEngine, ShaderPreset 
} from './types';

interface ParameterMatrixProps {
  spec: CADMeshSpecification;
  onChange: (updated: Partial<CADMeshSpecification>) => void;
  onExecuteRender: () => void;
  isRendering: boolean;
}

export const ParameterMatrix: React.FC<ParameterMatrixProps> = ({
  spec,
  onChange,
  onExecuteRender,
  isRendering
}) => {
  return (
    <div className="bg-[#07070c] border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Cpu className="w-56 h-56 text-violet-500" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-mono text-white uppercase tracking-wider flex items-center gap-2 font-bold">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-ping" />
            3D CAD Parameter Workbench
          </h3>
          <p className="text-[11px] text-zinc-400 mt-1 font-sans">
            Configure mesh topology, avatar kinematics, drape physics, and shader presets.
          </p>
        </div>
        <span className="text-[9px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
          CAD Engine v4.8
        </span>
      </div>

      {/* 1. Avatar Kinematics */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono uppercase text-violet-400 tracking-wider flex items-center gap-1.5 font-bold">
          <User className="w-3.5 h-3.5" />
          1. Avatar & Kinematics
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-mono">Avatar Model Base</span>
            <select
              value={spec.avatarType}
              onChange={(e) => onChange({ avatarType: e.target.value as AvatarType })}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer font-mono"
            >
              <option value="RUNWAY_F">Runway Avatar F-02 (Female)</option>
              <option value="ATHLETIC_M">Kinetic Mannequin M-05 (Male)</option>
              <option value="CYBORG_X">Xenon Cyberspace Body (Unisex)</option>
              <option value="MANNEQUIN_D">Gravitational Mannequin (Pure physics)</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-mono">Pose Kinematics</span>
            <select
              value={spec.poseKinematics}
              onChange={(e) => onChange({ poseKinematics: e.target.value as PoseKinematics })}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 cursor-pointer font-mono"
            >
              <option value="T_POSE">T-Pose Default Calibration</option>
              <option value="RUNWAY_STRIDE">Dynamic Runway Stride (1.2m/s)</option>
              <option value="CONTORTED_DRAFT">Contorted Drape Stress Draft</option>
              <option value="SEATED_CAD">Seated CAD Ergonomic Alignment</option>
            </select>
          </div>
        </div>

        {/* Sliders for Avatar Dimensions */}
        <div className="grid grid-cols-2 gap-4 bg-[#0d0d16] border border-white/5 rounded-2xl p-3.5">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Height Parameter</span>
              <span className="text-violet-300 font-bold">{spec.heightCm} cm</span>
            </div>
            <input 
              type="range"
              min={160}
              max={205}
              value={spec.heightCm}
              onChange={(e) => onChange({ heightCm: Number(e.target.value) })}
              className="w-full accent-violet-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Waist-to-Hips Ratio</span>
              <span className="text-violet-300 font-bold">{spec.waistRatio.toFixed(2)}</span>
            </div>
            <input 
              type="range"
              min={0.60}
              max={0.95}
              step={0.01}
              value={spec.waistRatio}
              onChange={(e) => onChange({ waistRatio: Number(e.target.value) })}
              className="w-full accent-violet-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 2. Topology Meshes */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider flex items-center gap-1.5 font-bold">
          <Box className="w-3.5 h-3.5" />
          2. Mesh & Subdivision
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-mono">CAD Mesh Blueprint</span>
            <select
              value={spec.garmentMesh}
              onChange={(e) => onChange({ garmentMesh: e.target.value as GarmentMesh })}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer font-mono"
            >
              <option value="ARCHITECTURAL_GOWN">Liquid Gown Mesh</option>
              <option value="TECH_PARKA">Modular Tech Parka</option>
              <option value="DECONSTRUCTED_BLAZER">Spatial Blazer Mesh</option>
              <option value="BIOMORPHIC_VEST">Biomorphic Vest Mesh</option>
              <option value="PLEATED_KINETIC_SKIRT">Pleated Kinetic Skirt</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-mono">Polygon Resolution</span>
            <select
              value={spec.polygonDensity}
              onChange={(e) => onChange({ polygonDensity: e.target.value as PolygonDensity })}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer font-mono"
            >
              <option value="LOW_30K">30k Low-Poly</option>
              <option value="MID_60K">60k Mid-Poly</option>
              <option value="QUAD_120K">120k Quad Master</option>
              <option value="ULTRA_250K">250k Ultra Quad</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#0d0d16] border border-white/5 rounded-2xl p-3">
          <span className="text-[10px] font-mono text-zinc-400">Subdivision Level</span>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChange({ subdivisionLevels: lvl })}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  spec.subdivisionLevels === lvl 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-[#11111a] text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Drape Physics */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider flex items-center gap-1.5 font-bold">
          <Activity className="w-3.5 h-3.5" />
          3. Drape Physics
        </label>

        <div className="grid grid-cols-2 gap-2">
          {(['LOW', 'MEDIUM', 'HIGH', 'ZERO_G', 'KINETIC'] as const).map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange({ drapePhysics: preset })}
              className={`py-2 px-3 rounded-xl text-[10px] font-mono uppercase border transition-all cursor-pointer text-center ${
                spec.drapePhysics === preset
                  ? 'bg-emerald-600/15 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                  : 'bg-[#11111a] border-white/5 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {preset.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Sliders for Tension and Stiffness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0d0d16] border border-white/5 rounded-2xl p-3.5">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Fiber Tension</span>
              <span className="text-emerald-400 font-bold">{spec.fiberTensionPa} Pa</span>
            </div>
            <input 
              type="range"
              min={100}
              max={10000}
              step={100}
              value={spec.fiberTensionPa}
              onChange={(e) => onChange({ fiberTensionPa: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Shear Stiffness</span>
              <span className="text-emerald-400 font-bold">{spec.shearStiffness.toFixed(2)}</span>
            </div>
            <input 
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={spec.shearStiffness}
              onChange={(e) => onChange({ shearStiffness: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 4. Shader & Renderer */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-1.5 font-bold">
          <Sliders className="w-3.5 h-3.5" />
          4. Shader & Render Engine
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-mono">Render Engine</span>
            <select
              value={spec.renderEngine}
              onChange={(e) => onChange({ renderEngine: e.target.value as RenderEngine })}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
            >
              <option value="UNREAL_5">Unreal Engine 5.4</option>
              <option value="CLO3D">CLO 3D CAD</option>
              <option value="MARVELOUS">Marvelous Designer</option>
              <option value="OCTANE">Octane Spectral</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-mono">Shader Material</span>
            <select
              value={spec.shaderPreset}
              onChange={(e) => onChange({ shaderPreset: e.target.value as ShaderPreset })}
              className="w-full bg-[#11111a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
            >
              <option value="Cyberpunk">Cyberpunk Metallic Chrome</option>
              <option value="Minimalist">Minimalist Matte Cotton</option>
              <option value="Avant-Garde">Avant-Garde Iridescent</option>
              <option value="Desert">Desert Coarse Linen</option>
              <option value="Future-Punk">Future-Punk Carbon Weave</option>
              <option value="Liquid Silk">Liquid Silk Anisotropic</option>
            </select>
          </div>
        </div>

        {/* Shader Sliders */}
        <div className="grid grid-cols-2 gap-4 bg-[#0d0d16] border border-white/5 rounded-2xl p-3.5">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Micro Roughness</span>
              <span className="text-cyan-400 font-bold">{spec.roughnessValue.toFixed(2)}</span>
            </div>
            <input 
              type="range"
              min={0.01}
              max={1.00}
              step={0.01}
              value={spec.roughnessValue}
              onChange={(e) => onChange({ roughnessValue: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Normal Displacement</span>
              <span className="text-cyan-400 font-bold">{spec.normalDisplacementMm.toFixed(1)} mm</span>
            </div>
            <input 
              type="range"
              min={0.0}
              max={10.0}
              step={0.2}
              value={spec.normalDisplacementMm}
              onChange={(e) => onChange({ normalDisplacementMm: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 5. Custom Directives */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block font-bold">
          5. Custom Directives
        </label>
        <textarea
          placeholder="CAD parameters (e.g. 0.25mm seam tension, anisotropic highlights, normal map offset...)"
          value={spec.customVertexNotes}
          onChange={(e) => onChange({ customVertexNotes: e.target.value })}
          rows={2}
          className="w-full bg-[#11111a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 resize-none font-mono"
        />
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onExecuteRender}
        disabled={isRendering}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-mono uppercase tracking-wider text-xs font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/20 transition-all cursor-pointer border border-white/10 active:scale-[0.99]"
      >
        {isRendering ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Executing 120k Quad Vertex Pipeline...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 text-white fill-white" />
            <span>Run Interactive 3D CAD Render</span>
          </>
        )}
      </button>

    </div>
  );
};
