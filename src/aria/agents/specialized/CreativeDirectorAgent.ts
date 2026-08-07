/**
 * ARIA v3.1 Creative Director Agent
 * Product: LOOK VISION v2.4
 * 
 * Specialized creative agent capable of fashion concept generation, design reasoning,
 * aesthetic synthesis, and collection planning.
 */

import {
  FashionAgent,
  AgentRequest,
  AgentResponse
} from '../AgentTypes';
import { creativeDirectorEngine } from '../../generation/CreativeDirectorEngine';
import { conceptGenerationEngine } from '../../generation/ConceptGenerationEngine';
import { styleDNAEngine } from '../../styleDNA/StyleDNAEngine';
import { EnterpriseObservabilityEngine } from '../../../engine/observabilityEngine';

export class CreativeDirectorAgent {
  private static instance: CreativeDirectorAgent;

  public readonly definition: FashionAgent = {
    id: 'ag_creative_director_03',
    name: 'Creative Director Agent',
    role: 'CREATIVE_DIRECTOR',
    capabilities: ['analyze', 'recommend', 'explain'],
    confidence: 0.94,
    status: 'IDLE',
    telemetryId: 'tel_creative_director',
    description: 'Synthesizes bespoke fashion concepts, seasonal creative directions, and luxury fashion narratives using Generative Intelligence.'
  };

  private constructor() {}

  public static getInstance(): CreativeDirectorAgent {
    if (!CreativeDirectorAgent.instance) {
      CreativeDirectorAgent.instance = new CreativeDirectorAgent();
    }
    return CreativeDirectorAgent.instance;
  }

  public async execute(request: AgentRequest): Promise<AgentResponse> {
    const startTime = performance.now();
    const userId = request.userId || 'guest_user';
    const prompt = request.prompt || (request.context.prompt as string) || 'Synthesize creative seasonal fashion concept';

    const profile = styleDNAEngine.getProfile();

    // Generate bespoke fashion concept and creative direction
    const concept = await conceptGenerationEngine.generateConcept({
      userId,
      userPrompt: prompt,
      occasion: 'Editorial & Special Event',
      season: 'Autumn/Winter 2026'
    });

    const direction = await creativeDirectorEngine.generateCreativeDirection(userId, 'Autumn/Winter 2026', prompt);

    const reasoning = [
      `Evaluated user aesthetic language: "${profile?.identityName || 'Contemporary Minimalist'}"`,
      `Synthesized creative theme: "${direction.seasonalTheme}"`,
      `Framed design narrative around ${direction.designNarrative.luxuryPositioning}`,
      `Referenced ${concept.referencedKnowledgeNodes.length} nodes in Civilization Memory Graph`
    ];

    const executionTimeMs = Math.round(performance.now() - startTime);

    try {
      EnterpriseObservabilityEngine.logTrace({
        engine: 'CreativeDirectorAgent',
        eventName: 'CREATIVE_DIRECTOR_EXECUTION_COMPLETED',
        category: 'Reasoning',
        payload: `Synthesized creative direction "${direction.designNarrative.title}" with confidence ${concept.confidence.finalCreativeConfidence}%`,
        latencyMs: executionTimeMs,
        status: 'Success'
      });
    } catch (_) {}

    return {
      agentId: this.definition.id,
      agentName: this.definition.name,
      role: this.definition.role,
      result: {
        conceptId: concept.conceptId,
        directionId: direction.directionId,
        title: concept.title,
        aestheticTheme: concept.aestheticTheme,
        narrative: direction.designNarrative,
        outfitItems: concept.outfitItems,
        colorStory: direction.keyColorStory,
        stylingDirections: concept.stylingDirections
      },
      confidence: concept.confidence.finalCreativeConfidence / 100,
      reasoning,
      telemetry: {
        executionTimeMs,
        reasoningDepth: reasoning.length,
        success: true
      }
    };
  }
}

export const creativeDirectorAgent = CreativeDirectorAgent.getInstance();
