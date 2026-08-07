/**
 * ARIA v2.8 Agent Collaboration & Collective Reasoning Types
 * Product: LOOK VISION v2.4
 */

import { AgentRole } from '../AgentTypes';

export interface AgentCollaborationRequest {
  requestId: string;
  participatingAgents?: AgentRole[];
  objective: string;
  context: Record<string, unknown>;
  userId?: string;
  minConfidenceThreshold?: number;
}

export interface AgentContribution {
  agentId: string;
  agentName?: string;
  agentRole: AgentRole;
  recommendation: string | Record<string, unknown>;
  confidence: number; // 0.0 to 1.0
  reasoning: string[];
  supportingEvidence: string[];
  executionTimeMs?: number;
  timestamp?: string;
}

export interface AgentConflict {
  conflictId: string;
  sourceAgentRole: AgentRole;
  targetAgentRole: AgentRole;
  topic: string; // e.g. "Silhouette Fit", "Color Tone", "Formality Level"
  sourceClaim: string;
  targetClaim: string;
  resolutionStrategy: 'STYLE_DNA_PRIORITY' | 'CONFIDENCE_RANKING' | 'USER_HISTORY_WEIGHT' | 'HYBRID_SYNTHESIS';
  winningAgentRole: AgentRole;
  explanation: string;
  resolutionWeight: number; // 0.0 to 1.0
}

export interface ConfidenceBreakdown {
  averageConfidence: number; // 0.0 - 1.0
  weightedConfidence: number; // 0.0 - 1.0
  reliabilityFactor: number; // 0.0 - 1.0 based on agent execution metrics
  relevanceScore: number; // 0.0 - 1.0 alignment with objective
  evidenceQualityScore: number; // 0.0 - 1.0 depth of evidence
  conflictPenalty: number; // deduction (e.g. 0.0 - 0.2)
  finalCollectiveConfidence: number; // 0 - 100 percentage
}

export interface CollectiveDecision {
  collaborationId: string;
  requestId: string;
  objective: string;
  finalRecommendation: string;
  confidenceScore: number; // 0 - 100
  confidenceBreakdown: ConfidenceBreakdown;
  reasoningSummary: string;
  detailedReasoning: string[];
  contributingAgents: AgentRole[];
  contributions: AgentContribution[];
  conflictsResolved: AgentConflict[];
  userId: string;
  createdAt: string;
  latencyMs: number;
}

export interface CollaborationCacheEntry {
  collaborationId: string;
  record: CollectiveDecision;
  savedAt: string;
}

export interface CollaborationStatus {
  isExecuting: boolean;
  activeCollaborationsCount: number;
  totalCollaborationsRecorded: number;
  lastExecutedAt?: string;
  lastError?: string;
}
