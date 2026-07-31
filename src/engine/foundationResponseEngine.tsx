import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ThemePhenomenonDNA,
  PRESET_THEME_OUTPUTS,
  FoundationEntity,
  ClickVisualResponse
} from './themePhenomenonEngine';

export type FoundationInteractionEvent = 'click' | 'hover' | 'active' | 'focus';

export type FoundationWaveType =
  | 'organic-earth'
  | 'crystal-pearl'
  | 'heat-expansion'
  | 'quantum-digital'
  | 'hydro-ripple'
  | 'gold-filament';

export interface FoundationResponseParams {
  themeName: string;
  waveType: FoundationWaveType;
  rippleColor: string;
  glowFlashColor: string;
  durationMs: number;
  shockwaveRadiusPx: number;
  scaleFactor: number;
  hapticPattern: number[];
  soundFrequencyHz: number;
  focusRingGlow: string;
  hoverElevationPx: number;
  activeScale: number;
  description: string;
}

export interface ActiveRippleState {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  glow: string;
  durationMs: number;
}

export interface FoundationMotionPreset {
  hover: {
    scale: number;
    y: number;
    transition: { duration: number; ease?: any };
  };
  active: {
    scale: number;
    transition: { duration: number; ease?: any };
  };
  focus: {
    boxShadow: string;
    transition: { duration: number };
  };
}

export class FoundationVisualResponseEngine {
  public generateResponseParams(
    dna: ThemePhenomenonDNA,
    eventType: FoundationInteractionEvent = 'click'
  ): FoundationResponseParams {
    const { themeName, permanentEntity, phenomenonEntity, foundationEntity, clickResponse } = dna;
    const waveType = this.determineWaveType(permanentEntity.category, themeName);

    const baseParams: FoundationResponseParams = {
      themeName,
      waveType,
      rippleColor: clickResponse.rippleColor,
      glowFlashColor: clickResponse.glowFlashColor,
      durationMs: clickResponse.rippleDurationMs || 300,
      shockwaveRadiusPx: clickResponse.shockwaveRadiusPx || 130,
      scaleFactor: clickResponse.scaleFactor || 1.03,
      hapticPattern: clickResponse.hapticPattern || [15, 30, 15],
      soundFrequencyHz: foundationEntity.tactileSoundFrequencyHz || 440,
      focusRingGlow: phenomenonEntity.shellGlowColor,
      hoverElevationPx: -2,
      activeScale: 0.97,
      description: `Foundation tactile visual response engine for ${foundationEntity.name}`
    };

    switch (eventType) {
      case 'hover':
        return {
          ...baseParams,
          durationMs: 200,
          shockwaveRadiusPx: Math.round(baseParams.shockwaveRadiusPx * 0.7),
          scaleFactor: 1.02
        };
      case 'active':
        return {
          ...baseParams,
          durationMs: 150,
          scaleFactor: 0.97
        };
      case 'focus':
        return {
          ...baseParams,
          durationMs: 250,
          shockwaveRadiusPx: Math.round(baseParams.shockwaveRadiusPx * 0.5)
        };
      case 'click':
      default:
        return baseParams;
    }
  }

  public getPresetResponse(
    presetName: string,
    eventType: FoundationInteractionEvent = 'click'
  ): FoundationResponseParams {
    const key = presetName.trim().toLowerCase();
    const dna = PRESET_THEME_OUTPUTS[key] || PRESET_THEME_OUTPUTS['cyber ai'];
    return this.generateResponseParams(dna, eventType);
  }

  public getMotionPreset(waveType: FoundationWaveType): FoundationMotionPreset {
    switch (waveType) {
      case 'organic-earth':
        return {
          hover: { scale: 1.015, y: -2, transition: { duration: 0.25, ease: 'easeOut' } },
          active: { scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } },
          focus: { boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.5)', transition: { duration: 0.2 } }
        };

      case 'crystal-pearl':
        return {
          hover: { scale: 1.02, y: -3, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
          active: { scale: 0.97, transition: { duration: 0.12, ease: 'easeOut' } },
          focus: { boxShadow: '0 0 0 2px rgba(192, 132, 252, 0.6)', transition: { duration: 0.25 } }
        };

      case 'heat-expansion':
        return {
          hover: { scale: 1.03, y: -2, transition: { duration: 0.18, ease: 'backOut' } },
          active: { scale: 0.96, transition: { duration: 0.08, ease: 'easeIn' } },
          focus: { boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.7)', transition: { duration: 0.15 } }
        };

      case 'quantum-digital':
        return {
          hover: { scale: 1.025, y: -1, transition: { duration: 0.15, ease: 'linear' } },
          active: { scale: 0.95, transition: { duration: 0.05, ease: 'linear' } },
          focus: { boxShadow: '0 0 0 2px rgba(34, 211, 238, 0.8)', transition: { duration: 0.1 } }
        };

      case 'hydro-ripple':
        return {
          hover: { scale: 1.02, y: -2, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
          active: { scale: 0.975, transition: { duration: 0.15, ease: 'easeOut' } },
          focus: { boxShadow: '0 0 0 2px rgba(6, 182, 212, 0.6)', transition: { duration: 0.2 } }
        };

      case 'gold-filament':
        return {
          hover: { scale: 1.02, y: -2, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
          active: { scale: 0.97, transition: { duration: 0.12, ease: 'easeInOut' } },
          focus: { boxShadow: '0 0 0 2px rgba(251, 191, 36, 0.7)', transition: { duration: 0.22 } }
        };

      default:
        return {
          hover: { scale: 1.02, y: -2, transition: { duration: 0.2, ease: 'easeOut' } },
          active: { scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } },
          focus: { boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.5)', transition: { duration: 0.2 } }
        };
    }
  }

  private determineWaveType(
    category: string,
    themeName: string
  ): FoundationWaveType {
    const lowerName = themeName.toLowerCase();
    if (lowerName.includes('nature') || category === 'biological') return 'organic-earth';
    if (lowerName.includes('moon') || lowerName.includes('pearl')) return 'crystal-pearl';
    if (lowerName.includes('fire') || lowerName.includes('ember') || category === 'element') return 'heat-expansion';
    if (lowerName.includes('cyber') || lowerName.includes('ai') || category === 'digital') return 'quantum-digital';
    if (lowerName.includes('ocean') || lowerName.includes('sea')) return 'hydro-ripple';
    if (lowerName.includes('luxury') || lowerName.includes('fashion') || category === 'luxurious') return 'gold-filament';
    return 'quantum-digital';
  }
}

export const globalFoundationVisualResponseEngine = new FoundationVisualResponseEngine();

// ==========================================
// REACT FOUNDATION INTERACTION WRAPPER
// ==========================================

export interface FoundationInteractionWrapperProps {
  children: React.ReactNode;
  themeDNA?: ThemePhenomenonDNA;
  presetThemeName?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onHoverStateChange?: (isHovered: boolean) => void;
}

export const FoundationInteractionWrapper: React.FC<FoundationInteractionWrapperProps> = ({
  children,
  themeDNA,
  presetThemeName = 'cyber ai',
  disabled = false,
  className = '',
  style = {},
  onClick,
  onHoverStateChange
}) => {
  const dna = useMemo(() => {
    if (themeDNA) return themeDNA;
    const key = presetThemeName.trim().toLowerCase();
    return PRESET_THEME_OUTPUTS[key] || PRESET_THEME_OUTPUTS['cyber ai'];
  }, [themeDNA, presetThemeName]);

  const responseParams = useMemo(() => {
    return globalFoundationVisualResponseEngine.generateResponseParams(dna, 'click');
  }, [dna]);

  const motionPreset = useMemo(() => {
    return globalFoundationVisualResponseEngine.getMotionPreset(responseParams.waveType);
  }, [responseParams.waveType]);

  const [ripples, setRipples] = useState<ActiveRippleState[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const triggerHapticFeedback = useCallback(() => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(responseParams.hapticPattern);
      } catch {
        // Safe fallback if permissions restrict haptics
      }
    }
  }, [responseParams.hapticPattern]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: ActiveRippleState = {
      id: `ripple_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      x,
      y,
      radius: responseParams.shockwaveRadiusPx,
      color: responseParams.rippleColor,
      glow: responseParams.glowFlashColor,
      durationMs: responseParams.durationMs
    };

    setRipples(prev => [...prev.slice(-4), newRipple]);

    triggerHapticFeedback();

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, responseParams.durationMs);

    if (onClick) onClick(e);
  };

  return (
    <motion.div
      whileHover={disabled ? undefined : motionPreset.hover}
      whileTap={disabled ? undefined : motionPreset.active}
      onHoverStart={() => !disabled && onHoverStateChange && onHoverStateChange(true)}
      onHoverEnd={() => !disabled && onHoverStateChange && onHoverStateChange(false)}
      onFocus={() => !disabled && setIsFocused(true)}
      onBlur={() => !disabled && setIsFocused(false)}
      onClick={handleClick}
      tabIndex={disabled ? -1 : 0}
      className={`relative overflow-hidden outline-none cursor-pointer transition-shadow duration-300 ${className}`}
      style={{
        boxShadow: isFocused ? motionPreset.focus.boxShadow : style.boxShadow,
        ...style
      }}
    >
      {/* Ripple / Shockwave Layer */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: responseParams.scaleFactor * 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: r.durationMs / 1000, ease: 'easeOut' }}
            className="pointer-events-none absolute rounded-full z-30 blur-[2px]"
            style={{
              left: r.x - r.radius / 2,
              top: r.y - r.radius / 2,
              width: r.radius,
              height: r.radius,
              backgroundColor: r.color,
              boxShadow: `0 0 30px ${r.glow}, inset 0 0 15px ${r.glow}`
            }}
          />
        ))}
      </AnimatePresence>

      {/* Internal Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// ==========================================
// INTERACTIVE CONVENIENCE COMPONENTS
// ==========================================

export interface FoundationButtonProps {
  children: React.ReactNode;
  presetThemeName?: string;
  themeDNA?: ThemePhenomenonDNA;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FoundationButton: React.FC<FoundationButtonProps> = ({
  children,
  presetThemeName = 'cyber ai',
  themeDNA,
  onClick,
  className = '',
  style = {}
}) => {
  return (
    <FoundationInteractionWrapper
      presetThemeName={presetThemeName}
      themeDNA={themeDNA}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl border border-white/10 font-medium text-sm text-zinc-100 backdrop-blur-md bg-white/5 hover:border-violet-500/40 ${className}`}
      style={style}
    >
      {children}
    </FoundationInteractionWrapper>
  );
};
