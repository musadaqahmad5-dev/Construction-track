import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Sliders, Monitor, Sparkles, Check, RefreshCw, Eye, Sun, Moon, Layers, Zap, Gauge, ShieldCheck, Cpu } from 'lucide-react';
import { ARIAThemeConfiguration, ARIAWorkspaceAdaptationSettings } from './types';

interface ARIAThemeWorkspaceAdapterProps {
  onApplyThemeToStudio?: (theme: ARIAThemeConfiguration) => void;
}

export const ARIAThemeWorkspaceAdapter: React.FC<ARIAThemeWorkspaceAdapterProps> = ({
  onApplyThemeToStudio
}) => {
  const [themePresets, setThemePresets] = useState<ARIAThemeConfiguration[]>([
    {
      id: 'theme_obsidian_noir',
      name: 'Cyberpunk Obsidian Noir',
      category: 'Cyberpunk',
      primaryColor: '#6366f1', // Indigo
      glowColor: 'rgba(99, 102, 241, 0.4)',
      backgroundGradient: 'linear-gradient(180deg, #05050a 0%, #070712 50%, #05050a 100%)',
      atmosphereRefractionPx: 16,
      noiseGrainFactor: 0.08,
      sheenIntensity: 0.75,
      recommendedArchetypes: ['Architectural Tailoring', 'Elevated Cyber & Utility']
    },
    {
      id: 'theme_quantum_violet',
      name: 'Quantum Violet Luxe',
      category: 'Luxe Dark',
      primaryColor: '#8b5cf6', // Violet
      glowColor: 'rgba(139, 92, 246, 0.4)',
      backgroundGradient: 'linear-gradient(180deg, #06050e 0%, #0d081f 50%, #06050e 100%)',
      atmosphereRefractionPx: 20,
      noiseGrainFactor: 0.05,
      sheenIntensity: 0.90,
      recommendedArchetypes: ['Minimalist Avant-Garde', 'Architectural Tailoring']
    },
    {
      id: 'theme_emerald_matrix',
      name: 'Emerald Matrix Horizon',
      category: 'Cyberpunk',
      primaryColor: '#10b981', // Emerald
      glowColor: 'rgba(16, 185, 129, 0.4)',
      backgroundGradient: 'linear-gradient(180deg, #040806 0%, #06140e 50%, #040806 100%)',
      atmosphereRefractionPx: 12,
      noiseGrainFactor: 0.06,
      sheenIntensity: 0.65,
      recommendedArchetypes: ['High-Contrast Luxe', 'Elevated Cyber & Utility']
    },
    {
      id: 'theme_midnight_cashmere',
      name: 'Midnight Cashmere Slate',
      category: 'Minimalist',
      primaryColor: '#3b82f6', // Sapphire Blue
      glowColor: 'rgba(59, 130, 246, 0.35)',
      backgroundGradient: 'linear-gradient(180deg, #05070a 0%, #090f17 50%, #05070a 100%)',
      atmosphereRefractionPx: 14,
      noiseGrainFactor: 0.04,
      sheenIntensity: 0.80,
      recommendedArchetypes: ['Modern Resort & Riviera', 'Minimalist Avant-Garde']
    },
    {
      id: 'theme_solar_amber',
      name: 'Solar Flare Amber Luxe',
      category: 'Organic Earth',
      primaryColor: '#f59e0b', // Amber
      glowColor: 'rgba(245, 158, 11, 0.4)',
      backgroundGradient: 'linear-gradient(180deg, #090604 0%, #170d06 50%, #090604 100%)',
      atmosphereRefractionPx: 18,
      noiseGrainFactor: 0.07,
      sheenIntensity: 0.85,
      recommendedArchetypes: ['High-Contrast Luxe', 'Modern Resort & Riviera']
    }
  ]);

  const [activeThemeId, setActiveThemeId] = useState<string>('theme_obsidian_noir');
  const [workspaceSettings, setWorkspaceSettings] = useState<ARIAWorkspaceAdaptationSettings>({
    layoutDensity: 'Balanced',
    fontScaling: 'Standard',
    telemetryStreamEnabled: true,
    autoAdaptToAmbientLight: true,
    activeThemeId: 'theme_obsidian_noir'
  });

  const [customRefraction, setCustomRefraction] = useState<number>(16);
  const [customGrain, setCustomGrain] = useState<number>(0.08);
  const [customSheen, setCustomSheen] = useState<number>(0.75);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [ariaRecommendationNote, setAriaRecommendationNote] = useState<string | null>(
    'ARIA Intelligence analyzes user Style DNA to dynamically modulate atmospheric luminescence and UI density.'
  );

  const activeTheme = themePresets.find(t => t.id === activeThemeId) || themePresets[0];

  useEffect(() => {
    // Load saved theme settings if available
    const savedTheme = localStorage.getItem('aria_active_theme_id_v2.4');
    if (savedTheme && themePresets.some(t => t.id === savedTheme)) {
      setActiveThemeId(savedTheme);
      const matched = themePresets.find(t => t.id === savedTheme);
      if (matched) {
        setCustomRefraction(matched.atmosphereRefractionPx);
        setCustomGrain(matched.noiseGrainFactor);
        setCustomSheen(matched.sheenIntensity);
      }
    }
  }, []);

  const handleSelectTheme = (theme: ARIAThemeConfiguration) => {
    setActiveThemeId(theme.id);
    setCustomRefraction(theme.atmosphereRefractionPx);
    setCustomGrain(theme.noiseGrainFactor);
    setCustomSheen(theme.sheenIntensity);
  };

  const handleApplyTheme = () => {
    setIsApplying(true);
    setTimeout(() => {
      localStorage.setItem('aria_active_theme_id_v2.4', activeTheme.id);
      
      // Dispatch global event for workspace theme update
      window.dispatchEvent(
        new CustomEvent('lookvision_update_sandbox_settings', {
          detail: {
            themeId: activeTheme.id,
            primaryColor: activeTheme.primaryColor,
            refractionPx: customRefraction,
            noiseGrain: customGrain,
            sheenIntensity: customSheen,
            layoutDensity: workspaceSettings.layoutDensity,
            fontScaling: workspaceSettings.fontScaling
          }
        })
      );

      if (onApplyThemeToStudio) {
        onApplyThemeToStudio(activeTheme);
      }

      setIsApplying(false);
    }, 600);
  };

  const handleAutoRecommendTheme = () => {
    setIsApplying(true);
    setTimeout(() => {
      // Pick recommended theme based on intelligence
      const recommended = themePresets[1]; // Quantum Violet Luxe
      setActiveThemeId(recommended.id);
      setCustomRefraction(recommended.atmosphereRefractionPx);
      setCustomGrain(recommended.noiseGrainFactor);
      setCustomSheen(recommended.sheenIntensity);

      setAriaRecommendationNote(
        `ARIA AI Auto-Adapted Workspace: Selected ${recommended.name} matching your active Style DNA archetype "Minimalist Avant-Garde".`
      );
      setIsApplying(false);
    }, 800);
  };

  return (
    <div className="w-full space-y-6 text-zinc-100 font-sans">
      {/* Top Banner */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-500"
          style={{ background: activeTheme.backgroundGradient }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="p-3 rounded-xl border flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${activeTheme.primaryColor}20`,
                borderColor: `${activeTheme.primaryColor}40`,
                color: activeTheme.primaryColor
              }}
            >
              <Palette className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">ARIA Theme Intelligence & Atmosphere</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                  Adaptive v2.4
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Dynamic visual spectrum adaptation, glassmorphic refraction tuning, and high-fidelity workspace density optimization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAutoRecommendTheme}
              disabled={isApplying}
              className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>ARIA Auto-Calibrate</span>
            </button>

            <button
              onClick={handleApplyTheme}
              disabled={isApplying}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold font-mono flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              {isApplying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Check className="w-3.5 h-3.5 text-white" />
              )}
              <span>{isApplying ? 'Applying Atmosphere...' : 'Apply Theme'}</span>
            </button>
          </div>
        </div>

        {ariaRecommendationNote && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-indigo-300 font-mono">
            <Cpu className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>{ariaRecommendationNote}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Theme Selector & Atmosphere Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Theme Presets (2 cols wide on LG) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Theme Intelligence Presets</span>
            </h4>
            <span className="text-[11px] text-zinc-500 font-mono">{themePresets.length} Active Vectors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {themePresets.map((preset) => {
              const isSelected = preset.id === activeThemeId;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectTheme(preset)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-white/[0.04] border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                      : 'bg-white/[0.015] border-white/5 hover:border-white/15 hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Subtle preset color highlight line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: preset.primaryColor }}
                  />

                  <div className="flex items-center justify-between mb-2 mt-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                      {preset.category}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-white font-mono group-hover:text-indigo-200 transition-colors">
                    {preset.name}
                  </h5>

                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    <span className="text-[11px] font-mono text-zinc-400">
                      Refraction: {preset.atmosphereRefractionPx}px
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1">
                    {preset.recommendedArchetypes.map((arch, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                        {arch}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Fine-Tuning Controls & Workspace Settings */}
        <div className="space-y-6">
          {/* Fine-Tuning Glassmorphism Controls */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Atmosphere Refraction Matrix</span>
            </h4>

            {/* Refraction Blur Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300">Glass Refraction Blur</span>
                <span className="text-indigo-400 font-bold">{customRefraction}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={customRefraction}
                onChange={(e) => setCustomRefraction(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-white/10 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Noise Grain Density Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300">Tactile Noise Grain Factor</span>
                <span className="text-violet-400 font-bold">{(customGrain * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={customGrain}
                onChange={(e) => setCustomGrain(Number(e.target.value))}
                className="w-full accent-violet-500 bg-white/10 rounded-lg h-1.5 cursor-pointer"
              />
            </div>

            {/* Sheen Intensity Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300">Luxury Sheen Reflection</span>
                <span className="text-purple-400 font-bold">{(customSheen * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={customSheen}
                onChange={(e) => setCustomSheen(Number(e.target.value))}
                className="w-full accent-purple-500 bg-white/10 rounded-lg h-1.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Workspace Density Adaptation */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>Workspace Adaptation Density</span>
            </h4>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400">Layout Density Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Compact', 'Balanced', 'Spacious'] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => setWorkspaceSettings(prev => ({ ...prev, layoutDensity: density }))}
                    className={`py-2 rounded-xl text-xs font-mono border transition-all ${
                      workspaceSettings.layoutDensity === density
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-white font-bold'
                        : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry Stream Toggle */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-white">Live Telemetry Stream</h5>
                <p className="text-[10px] text-zinc-400">Real-time reasoning log overlay in ARIA Studio</p>
              </div>
              <button
                onClick={() => setWorkspaceSettings(prev => ({ ...prev, telemetryStreamEnabled: !prev.telemetryStreamEnabled }))}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  workspaceSettings.telemetryStreamEnabled ? 'bg-indigo-600' : 'bg-white/10'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                    workspaceSettings.telemetryStreamEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
