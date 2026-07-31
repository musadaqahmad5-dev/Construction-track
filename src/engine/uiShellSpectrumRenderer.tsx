import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Shield, ChevronRight, Layers, Activity } from 'lucide-react';
import {
  ThemePhenomenonDNA,
  PRESET_THEME_OUTPUTS,
  globalThemePhenomenonEngine
} from './themePhenomenonEngine';
import {
  VisualTokenSystem,
  globalThemeDNAVisualTokenGenerator
} from './themeTokenGenerator';
import { ThemeIntelligenceContext } from './themeIntelligenceIntegration';

export type UIShellMode = 'static' | 'dynamic';

export type SupportedComponentType =
  | 'primaryButton'
  | 'secondaryButton'
  | 'iconButton'
  | 'navItem'
  | 'card'
  | 'panel'
  | 'badge'
  | 'aiAssistant';

export interface UIShellSpectrumConfig {
  mode: UIShellMode;
  animationVelocitySec: number;
  glowIntensity: number;
  refractionBlurPx: number;
  particleDensity: number;
  enableClickPulse: boolean;
  enableHoverHighlight: boolean;
  enableSelectionEmphasis: boolean;
  spectrumShiftStep: number;
}

export interface UIShellComponentStyle {
  background: string;
  border: string;
  boxShadow: string;
  color: string;
  backdropFilter: string;
  transition: string;
  hover: {
    background: string;
    border: string;
    boxShadow: string;
    transform: string;
  };
  active: {
    transform: string;
    boxShadow: string;
  };
}

export class UIShellSpectrumRenderer {
  private activeDNA: ThemePhenomenonDNA;
  private visualTokens: VisualTokenSystem;
  private config: UIShellSpectrumConfig;
  private activeSpectrumIndex: number = 0;

  constructor(
    initialDNA: ThemePhenomenonDNA = PRESET_THEME_OUTPUTS['cyber ai'],
    configOverrides?: Partial<UIShellSpectrumConfig>
  ) {
    this.activeDNA = initialDNA;
    this.visualTokens = globalThemeDNAVisualTokenGenerator.generateTokens(initialDNA);
    this.config = {
      mode: 'dynamic',
      animationVelocitySec: initialDNA.phenomenonEntity.animationVelocitySec || 3.0,
      glowIntensity: initialDNA.phenomenonEntity.glowIntensity || 0.85,
      refractionBlurPx: initialDNA.phenomenonEntity.refractionBlurPx || 16,
      particleDensity: initialDNA.phenomenonEntity.particleDensity || 80,
      enableClickPulse: true,
      enableHoverHighlight: true,
      enableSelectionEmphasis: true,
      spectrumShiftStep: 0,
      ...configOverrides
    };
  }

  public setThemeDNA(dna: ThemePhenomenonDNA): void {
    this.activeDNA = dna;
    this.visualTokens = globalThemeDNAVisualTokenGenerator.generateTokens(dna);
    this.config.animationVelocitySec = dna.phenomenonEntity.animationVelocitySec;
    this.config.glowIntensity = dna.phenomenonEntity.glowIntensity;
    this.config.refractionBlurPx = dna.phenomenonEntity.refractionBlurPx;
    this.config.particleDensity = dna.phenomenonEntity.particleDensity;
  }

  public setMode(mode: UIShellMode): void {
    this.config.mode = mode;
  }

  public updateConfig(overrides: Partial<UIShellSpectrumConfig>): void {
    this.config = { ...this.config, ...overrides };
  }

  public getConfig(): UIShellSpectrumConfig {
    return { ...this.config };
  }

  public getDNA(): ThemePhenomenonDNA {
    return this.activeDNA;
  }

  public getVisualTokens(): VisualTokenSystem {
    return this.visualTokens;
  }

  public advanceSpectrum(): void {
    const spectrum = this.activeDNA.phenomenonEntity.visualSpectrum;
    if (spectrum.length > 0) {
      this.activeSpectrumIndex = (this.activeSpectrumIndex + 1) % spectrum.length;
      this.config.spectrumShiftStep = this.activeSpectrumIndex;
    }
  }

  public getSpectrumCssVariables(): Record<string, string> {
    const { phenomenonEntity, shellCoat } = this.activeDNA;
    const spectrum = phenomenonEntity.visualSpectrum;
    const currentAccent = spectrum[this.activeSpectrumIndex % spectrum.length] || shellCoat.edgeIlluminationColor;
    const nextAccent = spectrum[(this.activeSpectrumIndex + 1) % spectrum.length] || currentAccent;

    return {
      '--look-shell-mode': this.config.mode,
      '--look-shell-primary-accent': currentAccent,
      '--look-shell-secondary-accent': nextAccent,
      '--look-shell-spectrum-linear': `linear-gradient(135deg, ${spectrum.join(', ')})`,
      '--look-shell-spectrum-radial': `radial-gradient(circle at 50% 50%, ${spectrum.slice(0, 3).join(', ')})`,
      '--look-shell-border-color': phenomenonEntity.shellBorderColor,
      '--look-shell-glow-color': phenomenonEntity.shellGlowColor,
      '--look-shell-glow-shadow': `0 0 ${Math.round(this.config.glowIntensity * 24)}px ${phenomenonEntity.shellGlowColor}`,
      '--look-shell-backdrop-blur': `${this.config.refractionBlurPx}px`,
      '--look-shell-anim-speed': `${this.config.animationVelocitySec}s`
    };
  }

  public getComponentStyle(component: SupportedComponentType): UIShellComponentStyle {
    const { shellTokens, coatTokens, interactionTokens } = this.visualTokens;
    const { phenomenonEntity } = this.activeDNA;

    const currentAccent = phenomenonEntity.visualSpectrum[this.activeSpectrumIndex % phenomenonEntity.visualSpectrum.length] || shellTokens.accentPrimary;

    switch (component) {
      case 'primaryButton':
        return {
          background: this.config.mode === 'dynamic'
            ? `linear-gradient(135deg, ${currentAccent} 0%, ${shellTokens.accentSecondary} 100%)`
            : shellTokens.primaryButtonBg,
          border: `1px solid ${phenomenonEntity.shellBorderColor}`,
          boxShadow: `0 4px 20px ${phenomenonEntity.shellGlowColor}`,
          color: shellTokens.primaryButtonText,
          backdropFilter: `blur(${coatTokens.shellCoat.glassmorphismBlurPx}px)`,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          hover: {
            background: shellTokens.primaryButtonHoverBg,
            border: `1px solid ${currentAccent}`,
            boxShadow: `0 6px 28px ${phenomenonEntity.shellGlowColor}, 0 0 12px ${currentAccent}`,
            transform: `translateY(${interactionTokens.hoverTranslateYPx}px) scale(${interactionTokens.hoverScale})`
          },
          active: {
            transform: `scale(${interactionTokens.activeScale})`,
            boxShadow: `0 2px 10px ${phenomenonEntity.shellGlowColor}`
          }
        };

      case 'secondaryButton':
        return {
          background: shellTokens.secondaryButtonBg,
          border: `1px solid ${shellTokens.secondaryButtonBorder}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          color: shellTokens.secondaryButtonText,
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease-out',
          hover: {
            background: shellTokens.secondaryButtonHoverBg,
            border: `1px solid ${phenomenonEntity.shellBorderColor}`,
            boxShadow: `0 0 15px ${phenomenonEntity.shellGlowColor}`,
            transform: 'translateY(-1px)'
          },
          active: {
            transform: 'scale(0.98)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }
        };

      case 'iconButton':
        return {
          background: 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${phenomenonEntity.shellBorderColor}`,
          boxShadow: `0 0 12px ${phenomenonEntity.shellGlowColor}`,
          color: currentAccent,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.25s ease',
          hover: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${currentAccent}`,
            boxShadow: `0 0 20px ${phenomenonEntity.shellGlowColor}`,
            transform: 'scale(1.08)'
          },
          active: {
            transform: 'scale(0.94)',
            boxShadow: `0 0 8px ${phenomenonEntity.shellGlowColor}`
          }
        };

      case 'navItem':
        return {
          background: 'transparent',
          border: '1px solid transparent',
          boxShadow: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'none',
          transition: 'all 0.2s ease',
          hover: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${phenomenonEntity.shellBorderColor}`,
            boxShadow: `0 0 12px ${phenomenonEntity.shellGlowColor}`,
            transform: 'translateX(2px)'
          },
          active: {
            transform: 'none',
            boxShadow: `0 0 16px ${phenomenonEntity.shellGlowColor}`
          }
        };

      case 'card':
        return {
          background: coatTokens.themeCoat.elevationDepths.medium,
          border: `1px solid rgba(255, 255, 255, 0.08)`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px ${phenomenonEntity.shellBorderColor}`,
          color: '#f4f4f5',
          backdropFilter: `blur(${coatTokens.shellCoat.glassmorphismBlurPx}px)`,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          hover: {
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${phenomenonEntity.shellBorderColor}`,
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${phenomenonEntity.shellGlowColor}`,
            transform: 'translateY(-3px) scale(1.005)'
          },
          active: {
            transform: 'scale(0.998)',
            boxShadow: `0 4px 16px rgba(0, 0, 0, 0.5)`
          }
        };

      case 'panel':
        return {
          background: this.visualTokens.themeTokens.panelBackground,
          border: `1px solid ${phenomenonEntity.shellBorderColor}`,
          boxShadow: `0 16px 48px rgba(0, 0, 0, 0.7), 0 0 30px ${phenomenonEntity.shellGlowColor}`,
          color: '#ffffff',
          backdropFilter: `blur(${coatTokens.shellCoat.glassmorphismBlurPx * 1.2}px)`,
          transition: 'all 0.4s ease',
          hover: {
            background: this.visualTokens.themeTokens.panelBackground,
            border: `1px solid ${currentAccent}`,
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${phenomenonEntity.shellGlowColor}`,
            transform: 'none'
          },
          active: {
            transform: 'none',
            boxShadow: `0 16px 48px rgba(0, 0, 0, 0.7)`
          }
        };

      case 'badge':
        return {
          background: shellTokens.badgeBg,
          border: `1px solid ${shellTokens.badgeBorder}`,
          boxShadow: `0 0 10px ${phenomenonEntity.shellGlowColor}`,
          color: shellTokens.badgeText,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
          hover: {
            background: this.hexToRgba(currentAccent, 0.3),
            border: `1px solid ${currentAccent}`,
            boxShadow: `0 0 16px ${phenomenonEntity.shellGlowColor}`,
            transform: 'scale(1.05)'
          },
          active: {
            transform: 'scale(0.95)',
            boxShadow: `0 0 6px ${phenomenonEntity.shellGlowColor}`
          }
        };

      case 'aiAssistant':
        return {
          background: `radial-gradient(circle at 30% 30%, ${this.hexToRgba(currentAccent, 0.35)} 0%, ${this.hexToRgba(this.activeDNA.permanentEntity.backgroundColor, 0.9)} 100%)`,
          border: `1.5px solid ${phenomenonEntity.shellBorderColor}`,
          boxShadow: `0 0 35px ${phenomenonEntity.shellGlowColor}, inset 0 0 15px ${this.hexToRgba(currentAccent, 0.3)}`,
          color: '#ffffff',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          hover: {
            background: `radial-gradient(circle at 30% 30%, ${this.hexToRgba(currentAccent, 0.5)} 0%, ${this.hexToRgba(this.activeDNA.permanentEntity.backgroundColor, 0.95)} 100%)`,
            border: `1.5px solid ${currentAccent}`,
            boxShadow: `0 0 50px ${phenomenonEntity.shellGlowColor}, inset 0 0 25px ${currentAccent}`,
            transform: 'scale(1.06) translateY(-2px)'
          },
          active: {
            transform: 'scale(0.96)',
            boxShadow: `0 0 20px ${phenomenonEntity.shellGlowColor}`
          }
        };

      default:
        return {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          color: 'inherit',
          backdropFilter: 'none',
          transition: 'none',
          hover: { background: '', border: '', boxShadow: '', transform: '' },
          active: { transform: '', boxShadow: '' }
        };
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    const cleaned = hex.replace('#', '');
    if (cleaned.length !== 6) return `rgba(139, 92, 246, ${alpha})`;
    const num = parseInt(cleaned, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private lightenColor(hex: string, amount: number): string {
    const cleaned = hex.replace('#', '');
    if (cleaned.length !== 6) return hex;
    const num = parseInt(cleaned, 16);
    let r = (num >> 16) + Math.round(255 * amount);
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * amount);
    let b = (num & 0x0000ff) + Math.round(255 * amount);
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

export const globalUIShellSpectrumRenderer = new UIShellSpectrumRenderer();

export interface UIShellContextType {
  themeDNA: ThemePhenomenonDNA;
  visualTokens: VisualTokenSystem;
  config: UIShellSpectrumConfig;
  setThemeByName: (themeName: string) => void;
  setCustomDNA: (dna: ThemePhenomenonDNA) => void;
  setMode: (mode: UIShellMode) => void;
  updateConfig: (overrides: Partial<UIShellSpectrumConfig>) => void;
  getComponentStyle: (component: SupportedComponentType) => UIShellComponentStyle;
  triggerClickPulse: (x?: number, y?: number) => void;
  clickPulseState: { active: boolean; x: number; y: number };
}

const UIShellContext = createContext<UIShellContextType | null>(null);

export interface UIShellProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
  initialMode?: UIShellMode;
  configOverrides?: Partial<UIShellSpectrumConfig>;
}

export const UIShellProvider: React.FC<UIShellProviderProps> = ({
  children,
  initialTheme = 'cyber ai',
  initialMode = 'dynamic',
  configOverrides
}) => {
  const existingContext = useContext(UIShellContext);
  const themeIntel = useContext(ThemeIntelligenceContext);

  // OBJECTIVE 6 & 1: Single global initialization guard.
  // Prevents duplicate render layers, duplicate timers, and duplicate DOM nodes.
  if (existingContext) {
    return <>{children}</>;
  }

  // OBJECTIVE 2: Automatically bind to global ThemeIntelligenceContext if present
  const activeDNAFromIntel = themeIntel?.themeDNA;

  const [themeDNA, setThemeDNAState] = useState<ThemePhenomenonDNA>(() => {
    return activeDNAFromIntel || globalThemePhenomenonEngine.getPreset(initialTheme) || globalThemePhenomenonEngine.generate(initialTheme);
  });

  useEffect(() => {
    if (activeDNAFromIntel && activeDNAFromIntel !== themeDNA) {
      setThemeDNAState(activeDNAFromIntel);
    }
  }, [activeDNAFromIntel]);

  const [mode, setModeState] = useState<UIShellMode>(initialMode);
  const [config, setConfigState] = useState<UIShellSpectrumConfig>(() => ({
    mode: initialMode,
    animationVelocitySec: themeDNA.phenomenonEntity.animationVelocitySec || 3.0,
    glowIntensity: themeDNA.phenomenonEntity.glowIntensity || 0.85,
    refractionBlurPx: themeDNA.phenomenonEntity.refractionBlurPx || 16,
    particleDensity: themeDNA.phenomenonEntity.particleDensity || 80,
    enableClickPulse: true,
    enableHoverHighlight: true,
    enableSelectionEmphasis: true,
    spectrumShiftStep: 0,
    ...configOverrides
  }));

  const [clickPulseState, setClickPulseState] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 0,
    y: 0
  });

  const renderer = useMemo(() => {
    return new UIShellSpectrumRenderer(themeDNA, config);
  }, [themeDNA]);

  useEffect(() => {
    renderer.setThemeDNA(themeDNA);
  }, [themeDNA, renderer]);

  const visualTokens = useMemo(() => {
    return globalThemeDNAVisualTokenGenerator.generateTokens(themeDNA);
  }, [themeDNA]);

  useEffect(() => {
    renderer.setMode(mode);
    renderer.updateConfig(config);
  }, [mode, config, renderer]);

  useEffect(() => {
    if (mode !== 'dynamic') return;

    const intervalMs = (config.animationVelocitySec * 1000) / Math.max(1, themeDNA.phenomenonEntity.visualSpectrum.length);
    const timer = setInterval(() => {
      renderer.advanceSpectrum();
      setConfigState(prev => ({ ...prev, spectrumShiftStep: (prev.spectrumShiftStep + 1) % 100 }));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [mode, config.animationVelocitySec, themeDNA, renderer]);

  const setThemeByName = useCallback((themeName: string) => {
    if (themeIntel?.switchTheme) {
      themeIntel.switchTheme(themeName);
    } else {
      const preset = globalThemePhenomenonEngine.getPreset(themeName);
      const newDNA = preset || globalThemePhenomenonEngine.generate(themeName);
      setThemeDNAState(newDNA);
      renderer.setThemeDNA(newDNA);
    }
  }, [renderer, themeIntel]);

  const setCustomDNA = useCallback((dna: ThemePhenomenonDNA) => {
    setThemeDNAState(dna);
    renderer.setThemeDNA(dna);
  }, [renderer]);

  const setMode = useCallback((newMode: UIShellMode) => {
    setModeState(newMode);
    setConfigState(prev => ({ ...prev, mode: newMode }));
    renderer.setMode(newMode);
  }, [renderer]);

  const updateConfig = useCallback((overrides: Partial<UIShellSpectrumConfig>) => {
    setConfigState(prev => ({ ...prev, ...overrides }));
    renderer.updateConfig(overrides);
  }, [renderer]);

  const getComponentStyle = useCallback((component: SupportedComponentType): UIShellComponentStyle => {
    return renderer.getComponentStyle(component);
  }, [renderer]);

  const triggerClickPulse = useCallback((x = 0, y = 0) => {
    if (!config.enableClickPulse) return;
    setClickPulseState({ active: true, x, y });
    setTimeout(() => {
      setClickPulseState(prev => ({ ...prev, active: false }));
    }, themeDNA.foundationEntity.impactShockwaveVelocityMs || 300);
  }, [config.enableClickPulse, themeDNA]);

  const spectrumCssVars = useMemo(() => {
    return renderer.getSpectrumCssVariables();
  }, [renderer, config.spectrumShiftStep]);

  const contextValue: UIShellContextType = {
    themeDNA,
    visualTokens,
    config,
    setThemeByName,
    setCustomDNA,
    setMode,
    updateConfig,
    getComponentStyle,
    triggerClickPulse,
    clickPulseState
  };

  return (
    <UIShellContext.Provider value={contextValue}>
      <div
        className="ui-shell-spectrum-root relative w-full h-full min-h-screen text-zinc-100 transition-colors duration-500 overflow-hidden"
        style={{
          backgroundColor: visualTokens.themeTokens.appBackground,
          backgroundImage: visualTokens.themeTokens.appBackgroundGradient,
          ...spectrumCssVars
        } as React.CSSProperties}
      >
        {/* OBJECTIVE 3: Environmental Effect Layer 1 - Background Spectrum Transition Orb */}
        <motion.div
          className="pointer-events-none absolute -top-1/3 -left-1/3 w-[166%] h-[166%] rounded-full opacity-25 blur-3xl z-0"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.06, 1]
          }}
          transition={{
            duration: Math.max(10, config.animationVelocitySec * 6),
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            background: `radial-gradient(circle at 50% 50%, var(--look-shell-primary-accent, rgba(168,85,247,0.3)) 0%, var(--look-shell-glow-color, rgba(124,58,237,0.15)) 40%, transparent 70%)`
          }}
        />

        {/* OBJECTIVE 3: Environmental Effect Layer 2 - Luxury Spectrum Glow Aura */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-1000 z-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, var(--look-shell-glow-color, rgba(168,85,247,0.2)) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, var(--look-shell-secondary-accent, rgba(99,102,241,0.15)) 0%, transparent 50%)`,
            boxShadow: `inset 0 0 ${Math.round(config.glowIntensity * 50)}px var(--look-shell-glow-color, rgba(168,85,247,0.15))`
          }}
        />

        {/* OBJECTIVE 3: Environmental Effect Layer 3 - Depth Illumination & Top Spectrum Rim */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] z-20 transition-all duration-500 opacity-90"
          style={{
            background: `var(--look-shell-spectrum-linear, linear-gradient(90deg, #8b5cf6, #3b82f6))`,
            boxShadow: `0 0 16px var(--look-shell-glow-color, #8b5cf6)`
          }}
        />

        {/* OBJECTIVE 3: Environmental Effect Layer 4 - Glass Refractions & Luxury Atmosphere */}
        <div
          className="pointer-events-none absolute inset-0 z-0 backdrop-blur-[var(--look-shell-backdrop-blur,16px)] opacity-30 transition-all duration-700"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)`
          }}
        />

        {/* Texture Micro-Grain Veil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 bg-cover bg-center z-0"
          style={{ opacity: themeDNA.themeCoat.noiseGrainFactor * 4 }}
        />

        {/* Click Shockwave Pulse Effect */}
        {clickPulseState.active && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: themeDNA.foundationEntity.pulseScaleExpansion || 2.5, opacity: 0 }}
            transition={{ duration: (themeDNA.foundationEntity.impactShockwaveVelocityMs || 300) / 1000, ease: 'easeOut' }}
            className="pointer-events-none absolute rounded-full blur-md z-50"
            style={{
              left: clickPulseState.x - 75,
              top: clickPulseState.y - 75,
              width: 150,
              height: 150,
              backgroundColor: themeDNA.clickResponse.rippleColor,
              boxShadow: `0 0 40px ${themeDNA.clickResponse.glowFlashColor}`
            }}
          />
        )}

        <div className="relative z-10 w-full h-full min-h-screen">
          {children}
        </div>
      </div>
    </UIShellContext.Provider>
  );
};

export function useUIShellSpectrum(): UIShellContextType {
  const context = useContext(UIShellContext);
  if (!context) {
    throw new Error('useUIShellSpectrum must be used within a UIShellProvider');
  }
  return context;
}

// ==========================================
// SUPPORTED REACT COMPONENTS WRAPPERS
// ==========================================

type SafeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
>;

export interface ShellPrimaryButtonProps extends SafeButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const ShellPrimaryButton: React.FC<ShellPrimaryButtonProps> = ({
  children,
  icon,
  onClick,
  className = '',
  ...props
}) => {
  const { getComponentStyle, triggerClickPulse } = useUIShellSpectrum();
  const style = getComponentStyle('primaryButton');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerClickPulse(e.clientX - rect.left, e.clientY - rect.top);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={style.hover}
      whileTap={style.active}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium tracking-wide shadow-lg cursor-pointer overflow-hidden backdrop-blur-md ${className}`}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        color: style.color
      }}
      {...props}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export interface ShellSecondaryButtonProps extends SafeButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const ShellSecondaryButton: React.FC<ShellSecondaryButtonProps> = ({
  children,
  icon,
  onClick,
  className = '',
  ...props
}) => {
  const { getComponentStyle, triggerClickPulse } = useUIShellSpectrum();
  const style = getComponentStyle('secondaryButton');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerClickPulse(e.clientX, e.clientY);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={style.hover}
      whileTap={style.active}
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer backdrop-blur-md ${className}`}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        color: style.color
      }}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};

export interface ShellIconButtonProps extends SafeButtonProps {
  icon: React.ReactNode;
  title?: string;
}

export const ShellIconButton: React.FC<ShellIconButtonProps> = ({
  icon,
  title,
  onClick,
  className = '',
  ...props
}) => {
  const { getComponentStyle, triggerClickPulse } = useUIShellSpectrum();
  const style = getComponentStyle('iconButton');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerClickPulse(e.clientX, e.clientY);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={style.hover}
      whileTap={style.active}
      onClick={handleClick}
      title={title}
      className={`p-2.5 rounded-xl inline-flex items-center justify-center cursor-pointer backdrop-blur-md ${className}`}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        color: style.color
      }}
      {...props}
    >
      {icon}
    </motion.button>
  );
};

export interface ShellNavItemProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ShellNavItem: React.FC<ShellNavItemProps> = ({
  label,
  icon,
  active = false,
  onClick,
  className = ''
}) => {
  const { getComponentStyle, themeDNA } = useUIShellSpectrum();
  const style = getComponentStyle('navItem');

  return (
    <motion.button
      whileHover={style.hover}
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 ${
        active ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-100'
      } ${className}`}
      style={active ? {
        background: `rgba(255, 255, 255, 0.07)`,
        border: `1px solid ${themeDNA.phenomenonEntity.shellBorderColor}`,
        boxShadow: `0 0 16px ${themeDNA.phenomenonEntity.shellGlowColor}`
      } : {
        background: style.background,
        border: style.border
      }}
    >
      {active && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
          style={{
            backgroundColor: themeDNA.phenomenonEntity.visualSpectrum[0] || '#a855f7',
            boxShadow: `0 0 10px ${themeDNA.phenomenonEntity.shellGlowColor}`
          }}
        />
      )}
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
};

export interface ShellCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ShellCard: React.FC<ShellCardProps> = ({
  children,
  title,
  subtitle,
  className = ''
}) => {
  const { getComponentStyle } = useUIShellSpectrum();
  const style = getComponentStyle('card');

  return (
    <motion.div
      whileHover={style.hover}
      className={`p-6 rounded-2xl border backdrop-blur-xl relative overflow-hidden ${className}`}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        color: style.color
      }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>}
          {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export interface ShellPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const ShellPanel: React.FC<ShellPanelProps> = ({ children, className = '' }) => {
  const { getComponentStyle } = useUIShellSpectrum();
  const style = getComponentStyle('panel');

  return (
    <div
      className={`p-6 rounded-3xl backdrop-blur-2xl relative ${className}`}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        color: style.color
      }}
    >
      {children}
    </div>
  );
};

export interface ShellBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const ShellBadge: React.FC<ShellBadgeProps> = ({ children, icon, className = '' }) => {
  const { getComponentStyle } = useUIShellSpectrum();
  const style = getComponentStyle('badge');

  return (
    <motion.span
      whileHover={style.hover}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md ${className}`}
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        color: style.color
      }}
    >
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      <span>{children}</span>
    </motion.span>
  );
};

export interface ShellAIAssistantProps {
  onInteract?: () => void;
  statusText?: string;
}

export const ShellAIAssistant: React.FC<ShellAIAssistantProps> = ({
  onInteract,
  statusText = 'AI Phenomenon Active'
}) => {
  const { getComponentStyle, themeDNA, triggerClickPulse } = useUIShellSpectrum();
  const style = getComponentStyle('aiAssistant');

  const handleClick = (e: React.MouseEvent) => {
    triggerClickPulse(e.clientX, e.clientY);
    if (onInteract) onInteract();
  };

  return (
    <motion.div
      whileHover={style.hover}
      whileTap={style.active}
      onClick={handleClick}
      className="cursor-pointer p-4 rounded-2xl flex items-center gap-4 relative overflow-hidden backdrop-blur-2xl border"
      style={{
        background: style.background,
        border: style.border,
        boxShadow: style.boxShadow,
        color: style.color
      }}
    >
      <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/20 shadow-inner">
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-white/40"
        />
      </div>

      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/90">
          {themeDNA.themeName} Intelligence Core
        </div>
        <div className="text-xs text-zinc-300 mt-0.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {statusText}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-white/60" />
    </motion.div>
  );
};

export function createUIShellConfig(overrides?: Partial<UIShellSpectrumConfig>): UIShellSpectrumConfig {
  return {
    mode: 'dynamic',
    animationVelocitySec: 3.0,
    glowIntensity: 0.85,
    refractionBlurPx: 16,
    particleDensity: 80,
    enableClickPulse: true,
    enableHoverHighlight: true,
    enableSelectionEmphasis: true,
    spectrumShiftStep: 0,
    ...overrides
  };
}
