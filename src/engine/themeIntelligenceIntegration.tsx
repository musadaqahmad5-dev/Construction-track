import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  ThemePhenomenonDNA,
  globalThemePhenomenonEngine,
  PRESET_THEME_OUTPUTS
} from './themePhenomenonEngine';
import {
  VisualTokenSystem,
  globalThemeDNAVisualTokenGenerator
} from './themeTokenGenerator';
import {
  CoatLayerDNA,
  globalAdaptiveCoatLayerEngine,
  ThemeCoatRenderer
} from './adaptiveCoatLayerEngine';
import {
  FoundationResponseParams,
  globalFoundationVisualResponseEngine,
  FoundationInteractionWrapper
} from './foundationResponseEngine';
import {
  UIShellSpectrumConfig,
  createUIShellConfig,
  UIShellProvider
} from './uiShellSpectrumRenderer';
import { CognitiveCoordinatorProvider } from './globalCognitiveCoordinator';
import { AutonomousOrchestratorProvider } from './globalAutonomousOrchestrator';
import {
  UserThemeProfile,
  PersonalThemeSequenceMemoryService,
  ThemeSequenceGenerator,
  UserThemeCoatSettings,
  UserFoundationSettings
} from './personalThemeSequenceMemory';

export interface ThemeIntelligenceState {
  activeThemeName: string;
  sequenceId: string;
  themeDNA: ThemePhenomenonDNA;
  visualTokens: VisualTokenSystem;
  coatDNA: CoatLayerDNA;
  foundationParams: FoundationResponseParams;
  shellConfig: UIShellSpectrumConfig;
  userProfile: UserThemeProfile | null;
  isLoading: boolean;
  error: string | null;
}

export class ThemeValidationLayer {
  public static SUPPORTED_PRESETS = [
    'nature',
    'ocean',
    'fire',
    'moon pearl',
    'cyber ai',
    'luxury fashion'
  ];

  public static validateThemeName(name: string): string {
    if (!name || typeof name !== 'string') return 'cyber ai';
    const sanitized = name.trim().toLowerCase();
    if (sanitized.length === 0) return 'cyber ai';
    return sanitized;
  }

  public static isPreset(name: string): boolean {
    return ThemeValidationLayer.SUPPORTED_PRESETS.includes(name.trim().toLowerCase());
  }
}

export class ThemeIntelligenceController {
  public static async orchestrate(
    userId: string = 'guest',
    rawThemeName: string = 'cyber ai'
  ): Promise<ThemeIntelligenceState> {
    const themeName = ThemeValidationLayer.validateThemeName(rawThemeName);

    try {
      // 1. Fetch or generate user sequence profile from memory
      const profile = await PersonalThemeSequenceMemoryService.getOrGenerateProfile(userId, themeName);

      // 2. Derive Theme DNA
      const dna = profile.themeDNA || globalThemePhenomenonEngine.getPreset(themeName) || globalThemePhenomenonEngine.generate(themeName);

      // 3. Generate Visual Tokens
      const visualTokens = globalThemeDNAVisualTokenGenerator.generateTokens(dna);

      // 4. Generate Coat DNA with automatic user settings wiring
      const coatDNA = globalAdaptiveCoatLayerEngine.generateCoatDNA(dna, profile.coatSettings);

      // 5. Generate Foundation Response Parameters
      const foundationParams = globalFoundationVisualResponseEngine.generateResponseParams(dna, 'click');

      // 6. Generate UI Shell Spectrum Config
      const shellConfig = createUIShellConfig({
        mode: 'dynamic',
        animationVelocitySec: dna.phenomenonEntity.animationVelocitySec,
        glowIntensity: dna.phenomenonEntity.glowIntensity,
        refractionBlurPx: dna.phenomenonEntity.refractionBlurPx
      });

      return {
        activeThemeName: themeName,
        sequenceId: profile.sequenceId,
        themeDNA: dna,
        visualTokens,
        coatDNA,
        foundationParams,
        shellConfig,
        userProfile: profile,
        isLoading: false,
        error: null
      };
    } catch (err: any) {
      console.error('[ThemeIntelligenceController] Orchestration error:', err);
      // Resilience fallback
      const fallbackDNA = PRESET_THEME_OUTPUTS['cyber ai'];
      const fallbackTokens = globalThemeDNAVisualTokenGenerator.generateTokens(fallbackDNA);
      const fallbackCoat = globalAdaptiveCoatLayerEngine.generateCoatDNA(fallbackDNA);
      const fallbackFoundation = globalFoundationVisualResponseEngine.generateResponseParams(fallbackDNA, 'click');
      const fallbackShell = createUIShellConfig({ mode: 'dynamic' });

      return {
        activeThemeName: 'cyber ai',
        sequenceId: 'CYBER-001',
        themeDNA: fallbackDNA,
        visualTokens: fallbackTokens,
        coatDNA: fallbackCoat,
        foundationParams: fallbackFoundation,
        shellConfig: fallbackShell,
        userProfile: null,
        isLoading: false,
        error: err?.message || 'Theme intelligence initialization fallback engaged'
      };
    }
  }
}

export interface ThemeIntelligenceContextValue extends ThemeIntelligenceState {
  switchTheme: (newThemeName: string) => Promise<void>;
  regenerateSequence: () => Promise<void>;
  updateCoatSettings: (settings: Partial<UserThemeCoatSettings>) => Promise<void>;
  updateFoundationSettings: (settings: Partial<UserFoundationSettings>) => Promise<void>;
  applyCSSVariablesToRoot: boolean;
}

export const ThemeIntelligenceContext = createContext<ThemeIntelligenceContextValue | null>(null);

export interface ThemeIntelligenceProviderProps {
  children: React.ReactNode;
  userId?: string;
  initialThemeName?: string;
  applyCSSVariablesToRoot?: boolean;
}

export const ThemeIntelligenceProvider: React.FC<ThemeIntelligenceProviderProps> = ({
  children,
  userId = 'guest',
  initialThemeName = 'cyber ai',
  applyCSSVariablesToRoot = true
}) => {
  const [state, setState] = useState<ThemeIntelligenceState>({
    activeThemeName: initialThemeName,
    sequenceId: 'INIT-000',
    themeDNA: PRESET_THEME_OUTPUTS['cyber ai'],
    visualTokens: globalThemeDNAVisualTokenGenerator.generateTokens(PRESET_THEME_OUTPUTS['cyber ai']),
    coatDNA: globalAdaptiveCoatLayerEngine.generateCoatDNA(PRESET_THEME_OUTPUTS['cyber ai']),
    foundationParams: globalFoundationVisualResponseEngine.generateResponseParams(PRESET_THEME_OUTPUTS['cyber ai'], 'click'),
    shellConfig: createUIShellConfig({ mode: 'dynamic' }),
    userProfile: null,
    isLoading: true,
    error: null
  });

  const loadTheme = useCallback(async (themeName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    const result = await ThemeIntelligenceController.orchestrate(userId, themeName);
    setState(result);
  }, [userId]);

  useEffect(() => {
    loadTheme(initialThemeName);
  }, [userId, initialThemeName, loadTheme]);

  // Apply root CSS variables for global visual theme system
  useEffect(() => {
    if (!applyCSSVariablesToRoot || typeof document === 'undefined') return;
    const root = document.documentElement;

    // Apply tokens
    Object.entries(state.visualTokens.cssVariables).forEach(([key, val]) => {
      root.style.setProperty(key, String(val));
    });

    // Apply coat variables
    Object.entries(state.coatDNA.cssVariables).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    // Apply background color to body
    if (state.themeDNA?.permanentEntity?.backgroundColor) {
      document.body.style.backgroundColor = state.themeDNA.permanentEntity.backgroundColor;
    }
  }, [state, applyCSSVariablesToRoot]);

  const switchTheme = useCallback(async (newThemeName: string) => {
    await loadTheme(newThemeName);
  }, [loadTheme]);

  const regenerateSequence = useCallback(async () => {
    if (!state.userProfile) return;
    setState(prev => ({ ...prev, isLoading: true }));
    const newSeqId = ThemeSequenceGenerator.generateSequenceId(state.activeThemeName, userId);
    const newP = ThemeSequenceGenerator.createPersonalizedProfile(state.activeThemeName, userId, newSeqId);
    await PersonalThemeSequenceMemoryService.saveUserProfile(newP);
    await loadTheme(state.activeThemeName);
  }, [state.userProfile, state.activeThemeName, userId, loadTheme]);

  const updateCoatSettings = useCallback(async (settings: Partial<UserThemeCoatSettings>) => {
    if (!state.userProfile) return;
    const updated = await PersonalThemeSequenceMemoryService.updateProfilePersonalization(
      userId,
      state.activeThemeName,
      {
        coatSettings: {
          ...state.userProfile.coatSettings,
          ...settings
        }
      }
    );
    setState(prev => ({
      ...prev,
      userProfile: updated
    }));
  }, [state.userProfile, state.activeThemeName, userId]);

  const updateFoundationSettings = useCallback(async (settings: Partial<UserFoundationSettings>) => {
    if (!state.userProfile) return;
    const updated = await PersonalThemeSequenceMemoryService.updateProfilePersonalization(
      userId,
      state.activeThemeName,
      {
        foundationSettings: {
          ...state.userProfile.foundationSettings,
          ...settings
        }
      }
    );
    setState(prev => ({
      ...prev,
      userProfile: updated
    }));
  }, [state.userProfile, state.activeThemeName, userId]);

  const contextValue = useMemo<ThemeIntelligenceContextValue>(() => ({
    ...state,
    switchTheme,
    regenerateSequence,
    updateCoatSettings,
    updateFoundationSettings,
    applyCSSVariablesToRoot
  }), [
    state,
    switchTheme,
    regenerateSequence,
    updateCoatSettings,
    updateFoundationSettings,
    applyCSSVariablesToRoot
  ]);

  return (
    <ThemeIntelligenceContext.Provider value={contextValue}>
      {children}
    </ThemeIntelligenceContext.Provider>
  );
};

export function useThemeIntelligence(): ThemeIntelligenceContextValue {
  const ctx = useContext(ThemeIntelligenceContext);
  if (!ctx) {
    const fallbackDNA = PRESET_THEME_OUTPUTS['cyber ai'];
    const fallbackTokens = globalThemeDNAVisualTokenGenerator.generateTokens(fallbackDNA);
    const fallbackCoat = globalAdaptiveCoatLayerEngine.generateCoatDNA(fallbackDNA);
    const fallbackFoundation = globalFoundationVisualResponseEngine.generateResponseParams(fallbackDNA, 'click');
    const fallbackShell = createUIShellConfig({ mode: 'dynamic' });
    return {
      activeThemeName: 'cyber ai',
      sequenceId: 'CYBER-001',
      themeDNA: fallbackDNA,
      visualTokens: fallbackTokens,
      coatDNA: fallbackCoat,
      foundationParams: fallbackFoundation,
      shellConfig: fallbackShell,
      userProfile: null,
      isLoading: false,
      error: null,
      switchTheme: async () => {},
      regenerateSequence: async () => {},
      updateCoatSettings: async () => {},
      updateFoundationSettings: async () => {},
      applyCSSVariablesToRoot: false
    };
  }
  return ctx;
}

// ==========================================
// HIGH-LEVEL LOOK VISION SHELL WRAPPER
// ==========================================

export interface ThemeIntelligenceShellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeIntelligenceShell: React.FC<ThemeIntelligenceShellProps> = ({
  children,
  className = '',
  style = {}
}) => {
  const { coatDNA, themeDNA, sequenceId } = useThemeIntelligence();

  return (
    <AutonomousOrchestratorProvider>
      <CognitiveCoordinatorProvider>
        <UIShellProvider>
          <ThemeCoatRenderer
            coatDNA={coatDNA}
            themeDNA={themeDNA}
            sequenceId={sequenceId}
            className={`min-h-screen w-full ${className}`}
            style={style}
          >
            <FoundationInteractionWrapper themeDNA={themeDNA} className="w-full h-full min-h-screen">
              {children}
            </FoundationInteractionWrapper>
          </ThemeCoatRenderer>
        </UIShellProvider>
      </CognitiveCoordinatorProvider>
    </AutonomousOrchestratorProvider>
  );
};
