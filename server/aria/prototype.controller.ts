/**
 * ARIA Prototype API Controller
 * Product: LOOK VISION v2.4
 * ARIA Autonomous Fashion Intelligence Runtime v3.2
 */

import { Request, Response } from 'express';
import { ARIAOrchestrator } from '../../src/aria/orchestrator/ARIAOrchestrator';
import { ARIAResponseFormatter } from '../../src/features/ariaPrototype/ARIAResponseFormatter';

export class ARIAPrototypeAPIController {
  public static async handlePrototypeRequest(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_proto_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a valid JSON object'
        });
        return;
      }

      const { userPrompt, userId, imageUrl, imageBase64, imageName, intent, context } = req.body;

      if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
        res.status(422).json({
          success: false,
          error: 'Validation failed',
          details: ['The "userPrompt" field is required and must be a non-empty string.']
        });
        return;
      }

      const orchestrator = ARIAOrchestrator.getInstance();
      const rawResponse = await orchestrator.executeRequest({
        requestId,
        userId: typeof userId === 'string' ? userId : 'guest_user',
        userPrompt: userPrompt.trim(),
        intent,
        imageUrl,
        imageBase64,
        imageName,
        context: typeof context === 'object' && context !== null ? context : undefined,
        createdAt: new Date().toISOString()
      });

      const formattedResult = ARIAResponseFormatter.formatResponse(rawResponse);

      res.status(200).json({
        success: true,
        data: formattedResult,
        telemetry: {
          requestId,
          latencyMs: rawResponse.executionTimeMs,
          confidenceScore: rawResponse.confidenceReport.finalConfidence,
          activeEngines: rawResponse.reasoningTraces.map((t) => t.engineName)
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        success: false,
        error: 'Internal ARIA Prototype Engine Error',
        details: [msg]
      });
    }
  }
}
