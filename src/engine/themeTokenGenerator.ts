import {
  ThemePhenomenonDNA,
  PRESET_THEME_OUTPUTS
} from './themePhenomenonEngine';

export interface ThemeTokens {
  appBackground: string;
  appBackgroundSecondary: string;
  appBackgroundGradient: string;
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  panelBackground: string;
  panelBorder: string;
  cardBackground: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardGlow: string;
  navigationBackground: string;
  navigationBorder: string;
  workspaceAtmosphereGradient: string;
  atmosphereOverlayOpacity: number;
  patternTextureClass: string;
}

export interface UIShellTokens {
  primaryButtonBg: string;
  primaryButtonText: string;
  primaryButtonBorder: string;
  primaryButtonHoverBg: string;
  primaryButtonActiveBg: string;
  primaryButtonGlow: string;
  secondaryButtonBg: string;
  secondaryButtonText: string;
  secondaryButtonBorder: string;
  secondaryButtonHoverBg: string;
  activeTabBg: string;
  activeTabText: string;
  activeTabBorder: string;
  activeTabGlow: string;
  hoverHighlightBg: string;
  focusRingColor: string;
  focusRingGlow: string;
  accentPrimary: string;
  accentSecondary: string;
  accentGlow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface ThemeCoatTokens {
  depthIndex: number;
  elevationDepths: {
    flat: string;
    low: string;
    medium: string;
    high: string;
  };
  materialTexture: string;
  surfaceFinishClass: string;
  grainOpacity: number;
  blendMode: string;
  sheenGradient: string;
  luxurySheenLevel: number;
  atmosphereFeeling: string;
}

export interface ShellCoatTokens {
  glowColor: string;
  glowSpreadPx: number;
  glowBlurPx: number;
  glowIntensity: number;
  reflectionGradient: string;
  edgeIlluminationColor: string;
  spectrumGradient: string;
  spectralShiftDurationSec: number;
  pulseFrequencyHz: number;
  glassmorphismBlurPx: number;
  refractionBlurPx: number;
}

export interface CoatTokens {
  themeCoat: ThemeCoatTokens;
  shellCoat: ShellCoatTokens;
}

export interface InteractionTokens {
  clickRippleColor: string;
  clickScale: number;
  clickFlashGlow: string;
  clickShockwaveVelocityMs: number;
  hoverScale: number;
  hoverTranslateYPx: number;
  hoverGlowIntensity: number;
  hoverBorderHighlight: string;
  selectionBorderColor: string;
  selectionGlow: string;
  selectionBg: string;
  activeScale: number;
  activeBorderColor: string;
  activeGlow: string;
}

export interface VisualTokenSystem {
  themeId: string;
  themeName: string;
  timestamp: number;
  themeTokens: ThemeTokens;
  shellTokens: UIShellTokens;
  coatTokens: CoatTokens;
  interactionTokens: InteractionTokens;
  cssVariables: Record<string, string>;
  tailwindClassMap: {
    appContainer: string;
    cardBase: string;
    panelBase: string;
    primaryButton: string;
    secondaryButton: string;
    activeTab: string;
    accentText: string;
    glowEffect: string;
    interactionFeedback: string;
  };
}

export class ThemeDNAVisualTokenGenerator {
  public generateTokens(dna: ThemePhenomenonDNA): VisualTokenSystem {
    const { permanentEntity, phenomenonEntity, themeCoat, shellCoat, foundationEntity, clickResponse } = dna;

    const themeTokens: ThemeTokens = {
      appBackground: permanentEntity.backgroundColor,
      appBackgroundSecondary: permanentEntity.secondaryBackgroundColor,
      appBackgroundGradient: permanentEntity.backgroundGradient,
      surfacePrimary: this.hexToRgba(permanentEntity.backgroundColor, 0.95),
      surfaceSecondary: this.hexToRgba(permanentEntity.secondaryBackgroundColor, 0.85),
      surfaceElevated: this.hexToRgba(permanentEntity.secondaryBackgroundColor, 0.92),
      panelBackground: `rgba(7, 7, 12, ${themeCoat.opacity})`,
      panelBorder: phenomenonEntity.shellBorderColor,
      cardBackground: 'rgba(255, 255, 255, 0.03)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      cardHoverBorder: phenomenonEntity.shellBorderColor,
      cardGlow: phenomenonEntity.shellGlowColor,
      navigationBackground: '#07070c',
      navigationBorder: 'rgba(255, 255, 255, 0.05)',
      workspaceAtmosphereGradient: permanentEntity.backgroundGradient,
      atmosphereOverlayOpacity: themeCoat.opacity,
      patternTextureClass: permanentEntity.patternTexture
    };

    const primaryAccent = phenomenonEntity.visualSpectrum[0] || shellCoat.edgeIlluminationColor;
    const secondaryAccent = phenomenonEntity.visualSpectrum[1] || phenomenonEntity.shellBorderColor;

    const shellTokens: UIShellTokens = {
      primaryButtonBg: `linear-gradient(135deg, ${primaryAccent} 0%, ${secondaryAccent} 100%)`,
      primaryButtonText: '#ffffff',
      primaryButtonBorder: phenomenonEntity.shellBorderColor,
      primaryButtonHoverBg: `linear-gradient(135deg, ${this.lightenColor(primaryAccent, 0.15)} 0%, ${this.lightenColor(secondaryAccent, 0.15)} 100%)`,
      primaryButtonActiveBg: primaryAccent,
      primaryButtonGlow: phenomenonEntity.shellGlowColor,
      secondaryButtonBg: 'rgba(255, 255, 255, 0.05)',
      secondaryButtonText: '#f4f4f5',
      secondaryButtonBorder: 'rgba(255, 255, 255, 0.12)',
      secondaryButtonHoverBg: 'rgba(255, 255, 255, 0.08)',
      activeTabBg: this.hexToRgba(primaryAccent, 0.15),
      activeTabText: primaryAccent,
      activeTabBorder: phenomenonEntity.shellBorderColor,
      activeTabGlow: phenomenonEntity.shellGlowColor,
      hoverHighlightBg: 'rgba(255, 255, 255, 0.05)',
      focusRingColor: primaryAccent,
      focusRingGlow: phenomenonEntity.shellGlowColor,
      accentPrimary: primaryAccent,
      accentSecondary: secondaryAccent,
      accentGlow: phenomenonEntity.shellGlowColor,
      badgeBg: this.hexToRgba(primaryAccent, 0.2),
      badgeText: this.lightenColor(primaryAccent, 0.3),
      badgeBorder: phenomenonEntity.shellBorderColor
    };

    const spectrumCss = `linear-gradient(90deg, ${phenomenonEntity.visualSpectrum.join(', ')})`;

    const themeCoatTokens: ThemeCoatTokens = {
      depthIndex: permanentEntity.depthIndex,
      elevationDepths: {
        flat: 'none',
        low: '0 2px 8px rgba(0, 0, 0, 0.4)',
        medium: `0 8px 24px ${phenomenonEntity.shellGlowColor}`,
        high: `0 16px 48px ${phenomenonEntity.shellGlowColor}`
      },
      materialTexture: themeCoat.materialTexture,
      surfaceFinishClass: themeCoat.surfaceFinish,
      grainOpacity: themeCoat.noiseGrainFactor,
      blendMode: themeCoat.blendMode,
      sheenGradient: `linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, ${themeCoat.luxurySheenLevel * 0.25}) 50%, transparent 100%)`,
      luxurySheenLevel: themeCoat.luxurySheenLevel,
      atmosphereFeeling: permanentEntity.atmosphereFeeling
    };

    const shellCoatTokens: ShellCoatTokens = {
      glowColor: phenomenonEntity.shellGlowColor,
      glowSpreadPx: Math.round(phenomenonEntity.glowIntensity * 20),
      glowBlurPx: phenomenonEntity.refractionBlurPx,
      glowIntensity: phenomenonEntity.glowIntensity,
      reflectionGradient: `linear-gradient(180deg, ${this.hexToRgba(primaryAccent, 0.3)} 0%, transparent 100%)`,
      edgeIlluminationColor: shellCoat.edgeIlluminationColor,
      spectrumGradient: spectrumCss,
      spectralShiftDurationSec: 1 / Math.max(0.1, shellCoat.spectralShiftFrequency),
      pulseFrequencyHz: shellCoat.energyPulseRateHz,
      glassmorphismBlurPx: shellCoat.glassmorphicBlurRadiusPx,
      refractionBlurPx: phenomenonEntity.refractionBlurPx
    };

    const coatTokens: CoatTokens = {
      themeCoat: themeCoatTokens,
      shellCoat: shellCoatTokens
    };

    const interactionTokens: InteractionTokens = {
      clickRippleColor: foundationEntity.clickRippleColor,
      clickScale: clickResponse.scaleFactor,
      clickFlashGlow: clickResponse.glowFlashColor,
      clickShockwaveVelocityMs: foundationEntity.impactShockwaveVelocityMs,
      hoverScale: 1.015,
      hoverTranslateYPx: -2,
      hoverGlowIntensity: phenomenonEntity.glowIntensity * 1.2,
      hoverBorderHighlight: phenomenonEntity.shellBorderColor,
      selectionBorderColor: primaryAccent,
      selectionGlow: phenomenonEntity.shellGlowColor,
      selectionBg: this.hexToRgba(primaryAccent, 0.12),
      activeScale: clickResponse.scaleFactor,
      activeBorderColor: primaryAccent,
      activeGlow: phenomenonEntity.shellGlowColor
    };

    const cssVariables: Record<string, string> = {
      '--look-vt-app-bg': themeTokens.appBackground,
      '--look-vt-app-bg-secondary': themeTokens.appBackgroundSecondary,
      '--look-vt-app-gradient': themeTokens.appBackgroundGradient,
      '--look-vt-surface-primary': themeTokens.surfacePrimary,
      '--look-vt-panel-bg': themeTokens.panelBackground,
      '--look-vt-panel-border': themeTokens.panelBorder,
      '--look-vt-accent-primary': shellTokens.accentPrimary,
      '--look-vt-accent-secondary': shellTokens.accentSecondary,
      '--look-vt-glow-color': shellCoatTokens.glowColor,
      '--look-vt-glow-spread': `${shellCoatTokens.glowSpreadPx}px`,
      '--look-vt-glass-blur': `${shellCoatTokens.glassmorphismBlurPx}px`,
      '--look-vt-ripple-color': interactionTokens.clickRippleColor,
      '--look-vt-spectrum': spectrumCss
    };

    const tailwindClassMap = {
      appContainer: `bg-[${themeTokens.appBackground}] text-zinc-100 min-h-screen`,
      cardBase: `bg-white/5 border border-white/10 hover:${dna.tailwindClasses.shellBorder} transition-all duration-300 rounded-xl backdrop-blur-md`,
      panelBase: `${dna.tailwindClasses.background} border border-white/5 rounded-2xl p-6 shadow-2xl`,
      primaryButton: `${dna.tailwindClasses.background} ${dna.tailwindClasses.textAccent} border ${dna.tailwindClasses.shellBorder} hover:${dna.tailwindClasses.shellGlow} transition-all duration-300 font-medium px-4 py-2 rounded-lg`,
      secondaryButton: 'bg-white/5 text-zinc-200 border border-white/10 hover:bg-white/10 transition-all duration-200 px-4 py-2 rounded-lg',
      activeTab: `${dna.tailwindClasses.textAccent} border-b-2 ${dna.tailwindClasses.shellBorder} font-semibold`,
      accentText: dna.tailwindClasses.textAccent,
      glowEffect: dna.tailwindClasses.shellGlow,
      interactionFeedback: dna.tailwindClasses.interactiveRipple
    };

    return {
      themeId: dna.themeId,
      themeName: dna.themeName,
      timestamp: Date.now(),
      themeTokens,
      shellTokens,
      coatTokens,
      interactionTokens,
      cssVariables,
      tailwindClassMap
    };
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

  private hexToRgba(hex: string, alpha: number): string {
    const cleaned = hex.replace('#', '');
    if (cleaned.length !== 6) return `rgba(139, 92, 246, ${alpha})`;
    const num = parseInt(cleaned, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

export const globalThemeDNAVisualTokenGenerator = new ThemeDNAVisualTokenGenerator();

export function generateVisualTokensFromDNA(dna: ThemePhenomenonDNA): VisualTokenSystem {
  return globalThemeDNAVisualTokenGenerator.generateTokens(dna);
}

export const PRESET_GENERATED_VISUAL_TOKENS: Record<string, VisualTokenSystem> = {
  nature: globalThemeDNAVisualTokenGenerator.generateTokens(PRESET_THEME_OUTPUTS.nature),
  ocean: globalThemeDNAVisualTokenGenerator.generateTokens(PRESET_THEME_OUTPUTS.ocean),
  fire: globalThemeDNAVisualTokenGenerator.generateTokens(PRESET_THEME_OUTPUTS.fire),
  'moon pearl': globalThemeDNAVisualTokenGenerator.generateTokens(PRESET_THEME_OUTPUTS['moon pearl']),
  'cyber ai': globalThemeDNAVisualTokenGenerator.generateTokens(PRESET_THEME_OUTPUTS['cyber ai']),
  'luxury fashion': globalThemeDNAVisualTokenGenerator.generateTokens(PRESET_THEME_OUTPUTS['luxury fashion'])
};
