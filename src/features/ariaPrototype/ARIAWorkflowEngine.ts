/**
 * ARIA Workflow Engine
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 * 
 * Orchestrates the explicit 8-step fashion reasoning workflow:
 * User Input -> Intent Detection -> Knowledge Retrieval -> Agent Selection -> Multi-Agent Reasoning -> Visual Analysis -> Generative Layer -> Decision Engine -> Final Recommendation.
 */

import { ARIAUserRequest, ARIAReasoningTimeline, ARIARecommendationResult } from './ARIAPrototypeTypes';
import { ARIAOrchestrator } from '../../aria/orchestrator/ARIAOrchestrator';
import { ARIAResponseFormatter } from './ARIAResponseFormatter';
import { EnterpriseObservabilityEngine } from '../../engine/observabilityEngine';

export class ARIAWorkflowEngine {
  private static instance: ARIAWorkflowEngine;

  private constructor() {}

  public static getInstance(): ARIAWorkflowEngine {
    if (!ARIAWorkflowEngine.instance) {
      ARIAWorkflowEngine.instance = new ARIAWorkflowEngine();
    }
    return ARIAWorkflowEngine.instance;
  }

  /**
   * Executes the full ARIA workflow end-to-end
   */
  public async executeWorkflow(request: ARIAUserRequest): Promise<ARIARecommendationResult> {
    const startTime = performance.now();

    // Log trace initiation in Enterprise Observability
    EnterpriseObservabilityEngine.logTrace({
      engine: 'ARIAWorkflowEngine',
      eventName: 'Workflow Initiated',
      category: 'Workflow',
      payload: `Workflow initiated for user: ${request.userId}, Session: ${request.sessionId}, Prompt: "${request.userPrompt.substring(0, 50)}..."`,
      latencyMs: 0,
      status: 'Success'
    });

    // Execute via Orchestrator
    const orchestrator = ARIAOrchestrator.getInstance();
    const response = await orchestrator.executeRequest({
      requestId: request.requestId,
      userId: request.userId,
      userPrompt: request.userPrompt,
      intent: request.intent,
      imageUrl: request.imageUrl,
      imageBase64: request.imageBase64,
      imageName: request.imageName,
      context: request.context,
      createdAt: request.createdAt || new Date().toISOString()
    });

    // Format output with Response Formatter
    const formattedResult = ARIAResponseFormatter.formatResponse(response);

    const totalLatency = Math.round(performance.now() - startTime);

    // Telemetry trace completion
    EnterpriseObservabilityEngine.logTrace({
      engine: 'ARIAWorkflowEngine',
      eventName: 'Workflow Completed',
      category: 'Workflow',
      payload: `Workflow completed in ${totalLatency}ms with confidence ${formattedResult.confidenceReport.finalConfidence}%. Active engines: ${formattedResult.reasoningTimeline.activeEngines.join(', ')}`,
      latencyMs: totalLatency,
      status: 'Success'
    });

    return formattedResult;
  }
}
