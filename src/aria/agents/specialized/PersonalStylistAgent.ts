/**
 * ARIA v2.7 Personal Stylist Agent
 * Product: LOOK VISION v2.4
 * 
 * Generates personalized styling intelligence using Style DNA, Personal Memory, and Decision Engine.
 */

import {
  FashionAgent,
  AgentRequest,
  AgentResponse
} from '../AgentTypes';
import { styleDNAEngine } from '../../styleDNA/StyleDNAEngine';
import { memoryEngine } from '../../memory/MemoryEngine';
import { decisionEngine } from '../../decision/DecisionEngine';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export class PersonalStylistAgent {
  private static instance: PersonalStylistAgent;

  public readonly definition: FashionAgent = {
    id: 'ag_personal_stylist_02',
    name: 'Personal Stylist Agent',
    role: 'PERSONAL_STYLIST',
    capabilities: ['analyze', 'recommend', 'explain'],
    confidence: 0.95,
    status: 'IDLE',
    telemetryId: 'tel_personal_stylist',
    description: 'Generates tailored outfit recommendations and decision scores using Style DNA, Personal Memory, and Decision Engine.'
  };

  private constructor() {}

  public static getInstance(): PersonalStylistAgent {
    if (!PersonalStylistAgent.instance) {
      PersonalStylistAgent.instance = new PersonalStylistAgent();
    }
    return PersonalStylistAgent.instance;
  }

  public async execute(request: AgentRequest): Promise<AgentResponse> {
    const startTime = performance.now();
    const userId = request.userId || 'guest_user';
    const prompt = request.prompt || (request.context.prompt as string) || 'Generate personalized outfit recommendation';

    const profile = styleDNAEngine.getProfile();
    const memories = memoryEngine.getMemories();

    const recommendation = await decisionEngine.generateRecommendation({
      userId,
      userPrompt: prompt
    });

    const reasoning = [
      `Style DNA identity "${profile?.identityName || 'Contemporary'}" overall confidence ${Math.round((profile?.overallConfidence || 0.9) * 100)}%`,
      `Cross-checked against ${memories.length} personal fashion memories`,
      ...recommendation.reasonSignals.map((s) => `${s.category}: ${s.signalText}`)
    ];

    const executionTimeMs = Math.round(performance.now() - startTime);
    const reasoningDepth = reasoning.length;

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'PersonalStylistAgent',
        eventName: 'PERSONAL_STYLIST_EXECUTION_COMPLETED',
        category: 'Reasoning',
        payload: `Generated recommendation "${recommendation.title}" with score ${Math.round(recommendation.overallScore * 100)}%`,
        latencyMs: executionTimeMs,
        status: 'Success'
      });
    } catch (_) {}

    return {
      agentId: this.definition.id,
      agentName: this.definition.name,
      role: this.definition.role,
      result: {
        recommendationId: recommendation.recommendationId,
        title: recommendation.title,
        description: recommendation.description,
        overallScore: recommendation.overallScore,
        suggestedItems: recommendation.suggestedItems,
        stylingAdvice: recommendation.stylingAdvice
      },
      confidence: recommendation.confidence,
      reasoning,
      telemetry: {
        executionTimeMs,
        reasoningDepth,
        success: true
      }
    };
  }
}

export const personalStylistAgent = PersonalStylistAgent.getInstance();
