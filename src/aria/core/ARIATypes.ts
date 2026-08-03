/**
 * ARIA v2.5 Core Foundation Types
 * Product: LOOK VISION v2.4
 */

export type ARIAConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';

export interface ConfidenceFactor {
  name: string;
  weight: number; // 0.0 to 1.0
  score: number;  // 0.0 to 1.0
  description: string;
}

export interface ARIAConfidenceScore {
  overallScore: number; // 0.0 to 1.0 (or 0 - 100%)
  confidenceLevel: ARIAConfidenceLevel;
  factors: ConfidenceFactor[];
  thresholdMet: boolean;
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

export interface ARIAMetadata {
  tokensUsed?: number;
  latencyMs: number;
  model: string;
  timestamp: string;
  requestId: string;
  moduleHandled?: string;
  agentVersion: string;
}

export interface ARIAStructuredResponse<T = unknown> {
  id: string;
  timestamp: string;
  query: string;
  intent: string;
  response: T;
  displayText: string;
  confidence: ARIAConfidenceScore;
  reasoningChain: ARIAReasoningStep[];
  metadata: ARIAMetadata;
  actions?: Array<{
    id: string;
    label: string;
    actionType: string;
    payload?: Record<string, unknown>;
  }>;
}

export interface ARIAModuleCapability {
  id: string;
  name: string;
  description: string;
}

export interface ARIAModule {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: ARIAModuleCapability[];
  isLoaded: boolean;
  load: () => Promise<boolean>;
  execute: (input: unknown, context: ARIAContextState) => Promise<unknown>;
}

export interface ARIAContextState {
  userId?: string;
  sessionId: string;
  currentWorkspace: string;
  activeSubTab?: string;
  viewportMode: 'AUTO' | 'MOBILE' | 'DESKTOP' | 'TABLET';
  theme: 'Moon Pearl Glow' | 'Cyberpunk' | 'Minimalist Slate';
  activeFeatures: string[];
  environment: {
    platform: string;
    isOnline: boolean;
    locale: string;
  };
  lastUpdated: string;
}

export interface ARIAConfig {
  version: string;
  primaryModel: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
  confidenceThreshold: number; // minimum score required for high-certainty execution
  autoAdaptLayout: boolean;
  enableTelemetry: boolean;
  activeModules: string[];
  maxReasoningSteps: number;
  cacheTtlMs: number;
}

export interface ARIASystemStatus {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'syncing' | 'maintenance';
  latencyMs: number;
  activeModulesCount: number;
  version: string;
  lastCheck: string;
  details?: string;
}

export interface ARIAQueryRequest {
  query: string;
  intent?: string;
  targetModule?: string;
  contextOverrides?: Partial<ARIAContextState>;
  options?: {
    temperature?: number;
    maxTokens?: number;
    requireConfidenceScore?: boolean;
    skipCache?: boolean;
  };
}
