/**
 * ARIA v2.7 Autonomous Fashion Intelligence Agent Types
 * Product: LOOK VISION v2.4
 */

export type AgentRole =
  | 'FASHION_ANALYST'
  | 'PERSONAL_STYLIST'
  | 'CREATIVE_DIRECTOR'
  | 'VISUAL_ANALYSIS'
  | 'TREND_INTELLIGENCE'
  | 'FASHION_HISTORIAN'
  | 'WARDROBE_OPTIMIZER';

export type AgentStatusType = 'IDLE' | 'EXECUTING' | 'SUCCESS' | 'FAILED' | 'PAUSED';

export type AgentCapability = 'analyze' | 'retrieve' | 'recommend' | 'explain' | 'optimize';

export interface AgentCapabilities {
  canAnalyzeDNA: boolean;
  canMakeDecisions: boolean;
  canSynthesizeCreative: boolean;
  canAnalyzeVision: boolean;
  canAnalyzeTrends: boolean;
  canRetrieveKnowledge?: boolean;
  canOptimizeWardrobe?: boolean;
}

export interface FashionAgent {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: AgentCapability[];
  confidence: number;
  status: AgentStatusType;
  telemetryId: string;
  description?: string;
  lastExecutedAt?: string;
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

export interface AgentRequest {
  requestId: string;
  source: string;
  context: Record<string, unknown>;
  requiredCapability: AgentCapability;
  prompt?: string;
  userId?: string;
  targetRoles?: AgentRole[];
}

export interface AgentResponse {
  agentId: string;
  agentName: string;
  role: AgentRole;
  result: Record<string, unknown>;
  confidence: number;
  reasoning: string[];
  telemetry: {
    executionTimeMs: number;
    reasoningDepth: number;
    success: boolean;
  };
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
  reasoningDepth?: number;
}

export interface AgentExecutionRequest {
  agentRole?: AgentRole;
  prompt: string;
  userId?: string;
  contextParams?: Record<string, unknown>;
  requiredCapabilities?: AgentCapability[];
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
