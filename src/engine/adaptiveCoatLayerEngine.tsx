import React, { useMemo, useState } from 'react';
import { motion, Variants } from 'motion/react';
import {
  ThemePhenomenonDNA,
  PRESET_THEME_OUTPUTS
} from './themePhenomenonEngine';

export type CoatCategory = 'atmosphere' | 'material' | 'energy' | 'luxury';

export type CoatMaterialFinish =
  | 'silk'
  | 'metal'
  | 'crystal'
  | 'pearl'
  | 'obsidian'
  | 'hologram'
  | 'glass'
  | 'velvet';

export interface ThemeCoatLayerProperties {
  id: string;
  name: string;
  category: CoatCategory;
  finish: CoatMaterialFinish;
  depthLevel: number;
  atmosphereOverlayGradient: string;
  grainOpacity: number;
  blurDepthPx: number;
  sheenAngleDeg: number;
  sheenIntensity: number;
  blendMode: 'soft-light' | 'overlay' | 'screen' | 'color-dodge' | 'multiply';
  description: string;
}

export interface ShellCoatLayerProperties {
  id: string;
  name: string;
  category: CoatCategory;
  finish: CoatMaterialFinish;
  edgeReflectionColor: string;
  glowRadiusPx: number;
  glowPulseHz: number;
  spectralShiftGradient: string;
  glassmorphismBlurPx: number;
  refractionIndex: number;
  description: string;
}

export interface CoatLayerDNA {
  themeName: string;
  themeCoatProps: ThemeCoatLayerProperties;
  shellCoatProps: ShellCoatLayerProperties;
  hoverIntensityMultiplier: number;
  activePulseScale: number;
  cssVariables: Record<string, string>;
}

export interface CoatMotionVariants {
  container: Variants;
  sheenSweep: Variants;
  glowPulse: Variants;
  clickPulse: Variants;
}

export const defaultCoatMotionVariants: CoatMotionVariants = {
  container: {
    initial: { opacity: 0.9, scale: 1 },
    hover: { opacity: 1, scale: 1.01 },
    active: { scale: 0.98 }
  },
  sheenSweep: {
    initial: { x: '-100%', opacity: 0 },
    hover: {
      x: '200%',
      opacity: [0, 0.6, 0],
      transition: { duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }
    }
  },
  glowPulse: {
    initial: { opacity: 0.7 },
    animate: {
      opacity: [0.6, 0.95, 0.6],
      transition: { duration: 2.5, ease: 'easeInOut', repeat: Infinity }
    }
  },
  clickPulse: {
    initial: { scale: 0, opacity: 0.8 },
    animate: { scale: 2.2, opacity: 0 },
    exit: { opacity: 0 }
  }
};

export class AdaptiveCoatLayerEngine {
  public generateCoatDNA(
    dna: ThemePhenomenonDNA,
    coatOverrides?: {
      intensity?: number;
      depthLevel?: number;
      grainOpacity?: number;
      glassmorphismBlurPx?: number;
      sheenIntensity?: number;
      blendMode?: 'soft-light' | 'overlay' | 'screen' | 'color-dodge' | 'multiply';
      atmosphereFeeling?: string;
    }
  ): CoatLayerDNA {
    const { themeName, permanentEntity, phenomenonEntity, themeCoat, shellCoat, foundationEntity } = dna;
    const category = this.mapCategory(permanentEntity.category);
    const finish = this.mapFinish(themeCoat.materialTexture, permanentEntity.category);

    const themeCoatProps: ThemeCoatLayerProperties = {
      id: `theme_coat_${dna.themeId}`,
      name: `${themeName} Atmospheric Coat`,
      category,
      finish,
      depthLevel: coatOverrides?.depthLevel ?? permanentEntity.depthIndex,
      atmosphereOverlayGradient: `radial-gradient(ellipse at 50% 20%, ${this.hexToRgba(phenomenonEntity.shellGlowColor, 0.25)} 0%, ${permanentEntity.backgroundColor} 75%)`,
      grainOpacity: coatOverrides?.grainOpacity ?? themeCoat.noiseGrainFactor,
      blurDepthPx: coatOverrides?.glassmorphismBlurPx ?? shellCoat.glassmorphicBlurRadiusPx,
      sheenAngleDeg: 120,
      sheenIntensity: coatOverrides?.sheenIntensity ?? themeCoat.luxurySheenLevel,
      blendMode: coatOverrides?.blendMode ?? (themeCoat.blendMode as ThemeCoatLayerProperties['blendMode']),
      description: `Atmospheric depth coat derived from ${permanentEntity.name} atmosphere.`
    };

    const shellCoatProps: ShellCoatLayerProperties = {
      id: `shell_coat_${dna.themeId}`,
      name: `${themeName} Shell Coat`,
      category: 'energy',
      finish: this.mapFinish(shellCoat.name, permanentEntity.category),
      edgeReflectionColor: shellCoat.edgeIlluminationColor,
      glowRadiusPx: phenomenonEntity.refractionBlurPx + Math.round(phenomenonEntity.glowIntensity * 12),
      glowPulseHz: shellCoat.energyPulseRateHz,
      spectralShiftGradient: `linear-gradient(90deg, ${phenomenonEntity.visualSpectrum.join(', ')})`,
      glassmorphismBlurPx: coatOverrides?.glassmorphismBlurPx ?? shellCoat.glassmorphicBlurRadiusPx,
      refractionIndex: shellCoat.reflectionCoefficient,
      description: `Refraction and glow shell coat for ${phenomenonEntity.name}.`
    };

    const cssVariables: Record<string, string> = {
      '--look-coat-atmosphere-gradient': themeCoatProps.atmosphereOverlayGradient,
      '--look-coat-grain-opacity': `${themeCoatProps.grainOpacity}`,
      '--look-coat-sheen-angle': `${themeCoatProps.sheenAngleDeg}deg`,
      '--look-coat-sheen-opacity': `${themeCoatProps.sheenIntensity * 0.3}`,
      '--look-coat-glow-color': phenomenonEntity.shellGlowColor,
      '--look-coat-glow-radius': `${shellCoatProps.glowRadiusPx}px`,
      '--look-coat-reflection-color': shellCoatProps.edgeReflectionColor,
      '--look-coat-spectrum': shellCoatProps.spectralShiftGradient,
      '--look-coat-glass-blur': `${shellCoatProps.glassmorphismBlurPx}px`
    };

    return {
      themeName,
      themeCoatProps,
      shellCoatProps,
      hoverIntensityMultiplier: coatOverrides?.intensity ? 1 + coatOverrides.intensity * 0.35 : 1.35,
      activePulseScale: foundationEntity.pulseScaleExpansion || 1.05,
      cssVariables
    };
  }

  public getPresetCoatDNA(presetName: string): CoatLayerDNA {
    const key = presetName.trim().toLowerCase();
    const dna = PRESET_THEME_OUTPUTS[key] || PRESET_THEME_OUTPUTS['cyber ai'];
    return this.generateCoatDNA(dna);
  }

  private mapCategory(permCat: string): CoatCategory {
    if (permCat === 'biological' || permCat === 'element') return 'atmosphere';
    if (permCat === 'luxurious') return 'luxury';
    if (permCat === 'digital' || permCat === 'cosmic') return 'energy';
    return 'material';
  }

  private mapFinish(texture: string, category: string): CoatMaterialFinish {
    const lower = texture.toLowerCase();
    if (lower.includes('silk') || lower.includes('satin')) return 'silk';
    if (lower.includes('pearl') || lower.includes('nacre')) return 'pearl';
    if (lower.includes('crystal') || lower.includes('glass')) return 'crystal';
    if (lower.includes('obsidian') || lower.includes('basalt')) return 'obsidian';
    if (lower.includes('circuit') || lower.includes('cyber') || category === 'digital') return 'hologram';
    if (category === 'luxurious') return 'velvet';
    return 'glass';
  }

  private hexToRgba(hex: string, alpha: number): string {
    if (hex.startsWith('rgba')) return hex;
    const cleaned = hex.replace('#', '');
    if (cleaned.length !== 6) return `rgba(139, 92, 246, ${alpha})`;
    const num = parseInt(cleaned, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

export const globalAdaptiveCoatLayerEngine = new AdaptiveCoatLayerEngine();

// ==========================================
// PRESET COAT LAYER OUTPUTS
// ==========================================

export const PRESET_COAT_DNA_SYSTEMS: Record<string, CoatLayerDNA> = {
  nature: globalAdaptiveCoatLayerEngine.getPresetCoatDNA('nature'),
  ocean: globalAdaptiveCoatLayerEngine.getPresetCoatDNA('ocean'),
  fire: globalAdaptiveCoatLayerEngine.getPresetCoatDNA('fire'),
  'moon pearl': globalAdaptiveCoatLayerEngine.getPresetCoatDNA('moon pearl'),
  'cyber ai': globalAdaptiveCoatLayerEngine.getPresetCoatDNA('cyber ai'),
  'luxury fashion': globalAdaptiveCoatLayerEngine.getPresetCoatDNA('luxury fashion')
};

// ==========================================
// REACT COAT LAYER RENDERERS & CONTEXT
// ==========================================

export interface CoatLayerContextValue {
  isCoatLayerActive: boolean;
  coatDNA?: CoatLayerDNA;
  sequenceId?: string;
  themeDNA?: ThemePhenomenonDNA;
}

export const CoatLayerContext = React.createContext<CoatLayerContextValue>({
  isCoatLayerActive: false
});

export function useCoatLayerContext(): CoatLayerContextValue {
  return React.useContext(CoatLayerContext);
}

export interface ThemeCoatRendererProps {
  children: React.ReactNode;
  coatDNA?: CoatLayerDNA;
  themeDNA?: ThemePhenomenonDNA;
  sequenceId?: string;
  className?: string;
  style?: React.CSSProperties;
  enableInteractiveHover?: boolean;
}

export const ThemeCoatRenderer: React.FC<ThemeCoatRendererProps> = ({
  children,
  coatDNA,
  themeDNA,
  sequenceId,
  className = '',
  style = {},
  enableInteractiveHover = true
}) => {
  const parentCoatContext = React.useContext(CoatLayerContext);

  // OBJECTIVE 1 & 3: Global single initialization guard.
  // If a parent coat layer is already active, prevent duplicate rendering and pass through children cleanly.
  if (parentCoatContext.isCoatLayerActive) {
    return <>{children}</>;
  }

  const dna = coatDNA || parentCoatContext.coatDNA || PRESET_COAT_DNA_SYSTEMS['cyber ai'];
  const activeSequenceId = sequenceId || parentCoatContext.sequenceId;
  const activeThemeDNA = themeDNA || parentCoatContext.themeDNA;

  const { themeCoatProps, cssVariables } = dna;
  const [isHovered, setIsHovered] = useState(false);

  const contextValue = useMemo<CoatLayerContextValue>(() => ({
    isCoatLayerActive: true,
    coatDNA: dna,
    sequenceId: activeSequenceId,
    themeDNA: activeThemeDNA
  }), [dna, activeSequenceId, activeThemeDNA]);

  return (
    <CoatLayerContext.Provider value={contextValue}>
      <motion.div
        onHoverStart={() => enableInteractiveHover && setIsHovered(true)}
        onHoverEnd={() => enableInteractiveHover && setIsHovered(false)}
        className={`relative w-full h-full min-h-full flex-1 flex flex-col bg-[#05050a] overflow-hidden transition-all duration-500 ${className}`}
        style={{
          ...cssVariables,
          ...(activeSequenceId ? { '--look-coat-sequence-id': `"${activeSequenceId}"` } : {}),
          ...style
        }}
      >
        {/* 1. Atmospheric Depth Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-0"
          style={{
            background: themeCoatProps.atmosphereOverlayGradient,
            mixBlendMode: themeCoatProps.blendMode as React.CSSProperties['mixBlendMode'],
            opacity: isHovered ? 0.95 : 0.8
          }}
        />

        {/* 2. Micro-Grain Texture Veil */}
        <div
          className="absolute inset-0 pointer-events-none bg-repeat z-0"
          style={{
            opacity: themeCoatProps.grainOpacity * (isHovered ? 1.4 : 1.0),
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* 3. Luxury Sheen Sweep Light */}
        <motion.div
          variants={defaultCoatMotionVariants.sheenSweep}
          initial="initial"
          animate={isHovered ? 'hover' : 'initial'}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `linear-gradient(${themeCoatProps.sheenAngleDeg}deg, transparent 0%, rgba(255, 255, 255, ${themeCoatProps.sheenIntensity * 0.25}) 50%, transparent 100%)`
          }}
        />

        {/* Main Content Area */}
        <div className="relative z-10 w-full h-full min-h-full flex-1 flex flex-col overflow-hidden">{children}</div>
      </motion.div>
    </CoatLayerContext.Provider>
  );
};

export interface ShellCoatRendererProps {
  children: React.ReactNode;
  coatDNA?: CoatLayerDNA;
  componentType?: 'button' | 'card' | 'panel' | 'accent' | 'badge';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ShellCoatRenderer: React.FC<ShellCoatRendererProps> = ({
  children,
  coatDNA,
  componentType = 'card',
  className = '',
  style = {},
  onClick
}) => {
  const dna = coatDNA || PRESET_COAT_DNA_SYSTEMS['cyber ai'];
  const { shellCoatProps, cssVariables, activePulseScale } = dna;
  const [isHovered, setIsHovered] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });

    setTimeout(() => {
      setClickPosition(prev => ({ ...prev, active: false }));
    }, 400);

    if (onClick) onClick(e);
  };

  const dynamicGlow = useMemo(() => {
    const baseGlow = shellCoatProps.glowRadiusPx;
    const multiplier = isHovered ? dna.hoverIntensityMultiplier : 1.0;
    return `0 0 ${Math.round(baseGlow * multiplier)}px ${shellCoatProps.edgeReflectionColor}`;
  }, [isHovered, shellCoatProps, dna.hoverIntensityMultiplier]);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`relative overflow-hidden backdrop-blur-xl transition-all duration-300 cursor-pointer ${className}`}
      style={{
        border: `1px solid ${isHovered ? shellCoatProps.edgeReflectionColor : 'rgba(255, 255, 255, 0.12)'}`,
        boxShadow: `${dynamicGlow}, inset 0 0 12px rgba(255, 255, 255, 0.05)`,
        backdropFilter: `blur(${shellCoatProps.glassmorphismBlurPx}px)`,
        ...cssVariables,
        ...style
      }}
    >
      {/* Edge Reflection Highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none transition-opacity duration-300"
        style={{
          background: shellCoatProps.spectralShiftGradient,
          opacity: isHovered ? 0.9 : 0.4
        }}
      />

      {/* Kinetic Foundation Response Pulse */}
      {clickPosition.active && (
        <motion.span
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: activePulseScale * 2.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none blur-sm z-20"
          style={{
            left: clickPosition.x - 50,
            top: clickPosition.y - 50,
            width: 100,
            height: 100,
            backgroundColor: shellCoatProps.edgeReflectionColor,
            boxShadow: `0 0 25px ${shellCoatProps.edgeReflectionColor}`
          }}
        />
      )}

      {/* Inner Component Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
