import { useState, useEffect, useCallback } from 'react';

export interface VisualThemeSkin {
  id: string;
  className: string;
  primaryAccent: string;
  secondaryAccent: string;
  cardStyles: string;
  textMaturityHighlight: string;
  ambientGlow: string;
}

export const ALLOWED_THEME_SKINS: Record<string, VisualThemeSkin> = {
  CYBER_HERITAGE: {
    id: 'CYBER_HERITAGE',
    className: 'theme-cyber',
    primaryAccent: '#00f2fe',
    secondaryAccent: '#4facfe',
    cardStyles: 'border-teal-500/10 hover:border-teal-400/30 bg-[#070c0e]/90 duration-300 font-mono tracking-tight',
    textMaturityHighlight: 'text-teal-400 drop-shadow-[0_0_8px_rgba(0,242,254,0.4)]',
    ambientGlow: 'shadow-teal-500/5 hover:shadow-teal-400/15'
  },
  MINIMALIST_LUXURY: {
    id: 'MINIMALIST_LUXURY',
    className: 'theme-luxury',
    primaryAccent: '#f5f5f0',
    secondaryAccent: '#a1a1aa',
    cardStyles: 'border-white/5 hover:border-zinc-400/20 bg-[#07070c] tracking-widest duration-300 uppercase',
    textMaturityHighlight: 'text-zinc-200 tracking-widest font-light',
    ambientGlow: 'shadow-none'
  },
  HAUTE_COUTURE: {
    id: 'HAUTE_COUTURE',
    className: 'theme-couture',
    primaryAccent: '#4f46e5',
    secondaryAccent: '#be123c',
    cardStyles: 'border-purple-500/10 hover:border-pink-500/20 bg-gradient-to-b from-[#07070c] to-[#0d0714] font-serif duration-300',
    textMaturityHighlight: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-serif italic',
    ambientGlow: 'shadow-purple-500/5 hover:shadow-pink-500/10'
  },
  STREETWEAR_TECHNICAL: {
    id: 'STREETWEAR_TECHNICAL',
    className: 'theme-street',
    primaryAccent: '#ea580c',
    secondaryAccent: '#2e4a3f',
    cardStyles: 'border-zinc-800 hover:border-orange-500/30 bg-[#0a0a0f] font-sans font-bold tracking-tighter duration-200',
    textMaturityHighlight: 'text-orange-500 font-black tracking-tighter',
    ambientGlow: 'shadow-orange-500/5'
  }
};

export type AmbientThemeMode =
  | 'CLASSIC_NOIR'
  | 'MIDNIGHT_VIOLET'
  | 'OBSIDIAN_EMERALD'
  | 'CYBER_MONOCHROME';

export interface GlassCardConfig {
  background: string;
  backdropFilter: string;
  border: string;
  boxShadow: string;
}

export interface ThemeTokens {
  baseBackground: string;
  secondaryPanel: string;
  borderAccent: string;
  glowAccent: string;
  backgroundGradient: string;
  glassCard: GlassCardConfig;
  glowBoxShadow: string;
  accentColor: string;
  textColorPrimary: string;
  textColorSecondary: string;
}

export const LOOK_VISION_THEMES: Record<AmbientThemeMode, ThemeTokens> = {
  CLASSIC_NOIR: {
    baseBackground: '#05050a',
    secondaryPanel: '#07070c',
    borderAccent: 'rgba(255,255,255,0.05)',
    glowAccent: 'rgba(99,102,241,0.1)',
    backgroundGradient: 'radial-gradient(ellipse at top, #0a0a16 0%, #05050a 100%)',
    glassCard: {
      background: 'rgba(7, 7, 12, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
    },
    glowBoxShadow: '0 0 20px rgba(99, 102, 241, 0.15)',
    accentColor: '#6366f1',
    textColorPrimary: '#f4f4f5',
    textColorSecondary: '#a1a1aa'
  },
  MIDNIGHT_VIOLET: {
    baseBackground: '#060214',
    secondaryPanel: '#0d0724',
    borderAccent: 'rgba(139,92,246,0.1)',
    glowAccent: 'rgba(139,92,246,0.2)',
    backgroundGradient: 'radial-gradient(ellipse at top, #150938 0%, #060214 100%)',
    glassCard: {
      background: 'rgba(13, 7, 36, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(139, 92, 246, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.15)'
    },
    glowBoxShadow: '0 0 25px rgba(139, 92, 246, 0.25)',
    accentColor: '#8b5cf6',
    textColorPrimary: '#f5f3ff',
    textColorSecondary: '#c4b5fd'
  },
  OBSIDIAN_EMERALD: {
    baseBackground: '#020906',
    secondaryPanel: '#05140e',
    borderAccent: 'rgba(16,185,129,0.08)',
    glowAccent: 'rgba(16,185,129,0.15)',
    backgroundGradient: 'radial-gradient(ellipse at top, #08241a 0%, #020906 100%)',
    glassCard: {
      background: 'rgba(5, 20, 14, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(16, 185, 129, 0.08)',
      boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.12)'
    },
    glowBoxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
    accentColor: '#10b981',
    textColorPrimary: '#ecfdf5',
    textColorSecondary: '#6ee7b7'
  },
  CYBER_MONOCHROME: {
    baseBackground: '#080808',
    secondaryPanel: '#121212',
    borderAccent: 'rgba(255,255,255,0.12)',
    glowAccent: 'rgba(255,255,255,0.2)',
    backgroundGradient: 'radial-gradient(ellipse at top, #1a1a1a 0%, #080808 100%)',
    glassCard: {
      background: 'rgba(18, 18, 18, 0.8)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.08)'
    },
    glowBoxShadow: '0 0 20px rgba(255, 255, 255, 0.25)',
    accentColor: '#ffffff',
    textColorPrimary: '#ffffff',
    textColorSecondary: '#d4d4d8'
  }
};

const STORAGE_KEY = 'look_vision_ambient_theme';

const ALL_THEME_CLASSES = [
  'theme-classic-noir',
  'theme-midnight-violet',
  'theme-obsidian-emerald',
  'theme-cyber-monochrome'
];

export function useAmbientTheme(initialTheme: AmbientThemeMode = 'CLASSIC_NOIR') {
  const [theme, setThemeState] = useState<AmbientThemeMode>(() => {
    if (typeof window === 'undefined') return initialTheme;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in LOOK_VISION_THEMES) {
        return stored as AmbientThemeMode;
      }
    } catch {
      return initialTheme;
    }
    return initialTheme;
  });

  const applyThemeToDOM = useCallback((mode: AmbientThemeMode) => {
    if (typeof window === 'undefined') return;

    const tokens = LOOK_VISION_THEMES[mode];
    const root = document.documentElement;

    root.classList.remove(...ALL_THEME_CLASSES);
    root.classList.add(`theme-${mode.toLowerCase().replace('_', '-')}`);

    root.style.setProperty('--lv-base-background', tokens.baseBackground);
    root.style.setProperty('--lv-secondary-panel', tokens.secondaryPanel);
    root.style.setProperty('--lv-border-accent', tokens.borderAccent);
    root.style.setProperty('--lv-glow-accent', tokens.glowAccent);
    root.style.setProperty('--lv-background-gradient', tokens.backgroundGradient);
    root.style.setProperty('--lv-glass-card-bg', tokens.glassCard.background);
    root.style.setProperty('--lv-glass-card-backdrop', tokens.glassCard.backdropFilter);
    root.style.setProperty('--lv-glass-card-border', tokens.glassCard.border);
    root.style.setProperty('--lv-glass-card-shadow', tokens.glassCard.boxShadow);
    root.style.setProperty('--lv-glow-box-shadow', tokens.glowBoxShadow);
    root.style.setProperty('--lv-accent-color', tokens.accentColor);
    root.style.setProperty('--lv-text-primary', tokens.textColorPrimary);
    root.style.setProperty('--lv-text-secondary', tokens.textColorSecondary);
  }, []);

  const setTheme = useCallback((newMode: AmbientThemeMode) => {
    setThemeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme, applyThemeToDOM]);

  return {
    theme,
    setTheme,
    tokens: LOOK_VISION_THEMES[theme],
    themes: LOOK_VISION_THEMES
  };
}
