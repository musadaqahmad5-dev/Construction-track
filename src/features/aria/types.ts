import { StylistIntent, StylistRecommendation, StylistAction } from '../../ai/stylist';
import { WardrobeItem } from '../../types';

export interface ARIASystemStatus {
  id: string;
  name: string;
  category: 'Stylist' | 'Reasoning' | 'StyleDNA' | 'Memory' | 'Theme' | 'Gemini';
  status: 'online' | 'degraded' | 'syncing';
  latencyMs: number;
  description: string;
  version: string;
  lastSync: string;
}

export interface ARIAReasoningStep {
  id: string;
  stageName: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  durationMs?: number;
  confidenceScore?: number;
  insights?: string[];
}

export interface ARIAStyleDNATrait {
  id: string;
  label: string;
  value: string;
  category: 'Palette' | 'Silhouette' | 'Formality' | 'Vibe' | 'BrandAffinity' | 'Seasonality';
  confidenceScore: number; // 0.0 - 1.0
  source: 'User Stated' | 'Inferred from History' | 'Vision Analysis' | 'Behavioral Matrix';
  isEditable: boolean;
}

export interface ARIAWardrobeSynergy {
  item: WardrobeItem;
  synergyScore: number; // 0 - 100
  versatilityIndex: number; // 0 - 100
  topCompanions: WardrobeItem[];
  ariaRecommendationNote: string;
  gapAnalysisTag?: string;
}

export interface ARIAConversationSnapshot {
  id: string;
  timestamp: string;
  prompt: string;
  responseSummary: string;
  intent: StylistIntent;
  recommendationsCount: number;
  reasoningSteps: ARIAReasoningStep[];
}

export interface ARIAThemeConfiguration {
  id: string;
  name: string;
  category: 'Cyberpunk' | 'Luxe Dark' | 'Minimalist' | 'High Contrast' | 'Organic Earth';
  primaryColor: string;
  glowColor: string;
  backgroundGradient: string;
  atmosphereRefractionPx: number;
  noiseGrainFactor: number;
  sheenIntensity: number;
  recommendedArchetypes: string[];
}

export interface ARIAWorkspaceAdaptationSettings {
  layoutDensity: 'Compact' | 'Balanced' | 'Spacious';
  fontScaling: 'Standard' | 'Elevated' | 'Large';
  telemetryStreamEnabled: boolean;
  autoAdaptToAmbientLight: boolean;
  activeThemeId: string;
}

