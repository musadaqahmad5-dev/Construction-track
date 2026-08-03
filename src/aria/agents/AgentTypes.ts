/**
 * ARIA v2.5 Multi-Agent Intelligence Types
 * Product: LOOK VISION v2.4
 */

export type AgentRole =
  | 'FASHION_ANALYST'
  | 'PERSONAL_STYLIST'
  | 'CREATIVE_DIRECTOR'
  | 'VISUAL_ANALYSIS'
  | 'TREND_INTELLIGENCE';

export type AgentStatusType = 'IDLE' | 'EXECUTING' | 'SUCCESS' | 'FAILED' | 'PAUSED';

export interface AgentCapabilities {
  canAnalyzeDNA: boolean;
  canMakeDecisions: boolean;
  canSynthesizeCreative: boolean;
  canAnalyzeVision: boolean;
  canAnalyzeTrends: boolean;
}

export interface AgentPerformanceMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageLatencyMs: number;
  averageConfidence: number; // 0.0 to 1.0
  userSatisfactionScore: number; // 0.0 to 1.0
}

export interface AgentProfile {
  agentId: string;
  agentName: string;
  role: AgentRole;
  description: string;
  capabilities: AgentCapabilities;
  status: AgentStatusType;
  confidence: number;
  metrics: AgentPerformanceMetrics;
  lastExecutedAt?: string;
}

export interface AgentExecutionRecord {
  executionId: string;
  agentId: string;
  agentRole: AgentRole;
  userId: string;
  prompt: string;
  status: AgentStatusType;
  confidence: number;
  outputSummary: string;
  dataPayload: Record<string, unknown>;
  latencyMs: number;
  executedAt: string;
  supportingEvidence: string[];
}

export interface AgentExecutionRequest {
  agentRole?: AgentRole;
  prompt: string;
  userId?: string;
  contextParams?: Record<string, unknown>;
}

export interface AgentOrchestratorStatus {
  isInitialized: boolean;
  isExecuting: boolean;
  activeAgentsCount: number;
  totalExecutionsRecorded: number;
  storageMode: 'firestore' | 'offline_local';
  lastExecutedAt?: string;
  lastError?: string;
}
