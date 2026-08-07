/**
 * ARIA v2.9 Adaptive Intelligence & Agent Learning Types
 * Product: LOOK VISION v2.4
 */

import { AgentRole } from '../AgentTypes';

export interface AgentPerformanceProfile {
  agentId: string;
  agentRole: AgentRole;
  totalExecutions: number;
  successfulExecutions: number;
  averageConfidence: number; // 0.0 to 1.0
  averageLatencyMs: number; // ms
  userAcceptanceRate: number; // 0.0 to 1.0
  reliabilityScore: number; // 0 to 100
  confidenceAccuracy: number; // 0.0 to 1.0
  collaborationValueScore: number; // 0.0 to 1.0
  lastEvaluated: string;
}

export type SignalSource = 'USER_FEEDBACK' | 'COLLABORATION_RESULT' | 'EXECUTION_LATENCY' | 'CONFIDENCE_VERIFICATION';
export type SignalType = 'ACCEPTED' | 'REJECTED' | 'MODIFIED' | 'LATENCY_PENALTY' | 'CONFIDENCE_ACCURACY' | 'COLLABORATION_HIGH_IMPACT';

export interface AgentLearningSignal {
  signalId: string;
  agentRole: AgentRole;
  source: SignalSource;
  signalType: SignalType;
  value: number; // -1.0 to 1.0 or normalized score delta
  timestamp: string;
  userId?: string;
  context?: Record<string, unknown>;
}

export interface AdaptiveSelectionResult {
  selectedAgents: AgentRole[];
  agentRelevanceScores: Partial<Record<AgentRole, number>>;
  agentReliabilityScores: Partial<Record<AgentRole, number>>;
  primaryAgents: AgentRole[];
  secondaryAgents: AgentRole[];
  reasoning: string[];
  explanation: string;
}

export interface AdaptivePerformanceCache {
  profiles: Partial<Record<AgentRole, AgentPerformanceProfile>>;
  lastSaved: string;
}
