import React, { useMemo } from 'react';
import {
  ThemeIntelligenceProvider,
  useThemeIntelligence,
  ThemeIntelligenceShell
} from './themeIntelligenceIntegration';
import { ThemeCoatRenderer } from './adaptiveCoatLayerEngine';
import { FoundationInteractionWrapper } from './foundationResponseEngine';
import { UIShellProvider } from './uiShellSpectrumRenderer';
import { CognitiveCoordinatorProvider } from './globalCognitiveCoordinator';
import { AutonomousOrchestratorProvider } from './globalAutonomousOrchestrator';

export interface ThemeFeatureFlags {
  enableThemeIntelligence: boolean;
  enableCoatLayers: boolean;
  enableFoundationResponses: boolean;
  enableSequenceMemory: boolean;
  enableFirestoreSync: boolean;
  enableVisualTokenInjection: boolean;
}

export const DEFAULT_THEME_FEATURE_FLAGS: ThemeFeatureFlags = {
  enableThemeIntelligence: true,
  enableCoatLayers: true,
  enableFoundationResponses: false,
  enableSequenceMemory: true,
  enableFirestoreSync: true,
  enableVisualTokenInjection: true
};

export class ThemeIntelligenceAdapter {
  private static LEGACY_THEME_MAP: Record<string, string> = {
    cyber: 'cyber ai',
    cyberpunk: 'cyber ai',
    dark: 'cyber ai',
    light: 'nature',
    earth: 'nature',
    sea: 'ocean',
    flame: 'fire',
    luxury: 'luxury fashion',
    pearl: 'moon pearl'
  };

  public static adaptLegacyThemeName(themeName: string): string {
    if (!themeName) return 'cyber ai';
    const cleaned = themeName.trim().toLowerCase();
    return ThemeIntelligenceAdapter.LEGACY_THEME_MAP[cleaned] || cleaned;
  }
}

export interface ThemeIntelligenceBridgeProps {
  children: React.ReactNode;
  userId?: string;
  initialThemeName?: string;
  flags?: Partial<ThemeFeatureFlags>;
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeIntelligenceBridgeContent: React.FC<{
  children: React.ReactNode;
  flags: ThemeFeatureFlags;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, flags, className = '', style = {} }) => {
  const { coatDNA, themeDNA, sequenceId } = useThemeIntelligence();

  if (!flags.enableThemeIntelligence) {
    return <div className={`w-full h-full min-h-full flex-1 flex flex-col overflow-hidden bg-[#05050a] ${className}`} style={style}>{children}</div>;
  }

  let content = <>{children}</>;

  if (flags.enableFoundationResponses) {
    content = (
      <FoundationInteractionWrapper themeDNA={themeDNA} className="w-full h-full min-h-full flex-1 flex flex-col">
        {content}
      </FoundationInteractionWrapper>
    );
  }

  if (flags.enableCoatLayers) {
    content = (
      <ThemeCoatRenderer
        coatDNA={coatDNA}
        themeDNA={themeDNA}
        sequenceId={sequenceId}
        className={`w-full h-full min-h-full flex-1 flex flex-col overflow-hidden bg-[#05050a] ${className}`}
        style={style}
      >
        {content}
      </ThemeCoatRenderer>
    );
  } else {
    content = <div className={`w-full h-full min-h-full flex-1 flex flex-col overflow-hidden bg-[#05050a] ${className}`} style={style}>{content}</div>;
  }

  return (
    <AutonomousOrchestratorProvider>
      <CognitiveCoordinatorProvider>
        <UIShellProvider>
          {content}
        </UIShellProvider>
      </CognitiveCoordinatorProvider>
    </AutonomousOrchestratorProvider>
  );
};

export const ThemeIntelligenceAppBridge: React.FC<ThemeIntelligenceBridgeProps> = ({
  children,
  userId = 'guest',
  initialThemeName = 'cyber ai',
  flags: userFlags = {},
  className = '',
  style = {}
}) => {
  const mergedFlags = useMemo<ThemeFeatureFlags>(() => ({
    ...DEFAULT_THEME_FEATURE_FLAGS,
    ...userFlags
  }), [userFlags]);

  const adaptedTheme = useMemo(() => {
    return ThemeIntelligenceAdapter.adaptLegacyThemeName(initialThemeName);
  }, [initialThemeName]);

  return (
    <ThemeIntelligenceProvider
      userId={userId}
      initialThemeName={adaptedTheme}
      applyCSSVariablesToRoot={mergedFlags.enableVisualTokenInjection}
    >
      <ThemeIntelligenceBridgeContent flags={mergedFlags} className={className} style={style}>
        {children}
      </ThemeIntelligenceBridgeContent>
    </ThemeIntelligenceProvider>
  );
};
