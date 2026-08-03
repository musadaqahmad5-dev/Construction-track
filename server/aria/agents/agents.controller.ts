/**
 * ARIA v2.5 Agents Express Controller
 * Product: LOOK VISION v2.4
 */

import { Request, Response } from 'express';
import { agentsService } from './agents.service';

export class AgentsController {
  /**
   * GET /api/aria/agents
   */
  public static async getAgents(req: Request, res: Response): Promise<void> {
    try {
      const agents = agentsService.getAgents();
      res.json({
        success: true,
        data: agents
      });
    } catch (err: any) {
      console.error('[AgentsController Error] getAgents failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Agents fetch error',
        message: err.message || 'Internal server error fetching agents'
      });
    }
  }

  /**
   * POST /api/aria/agents/execute
   */
  public static async execute(req: Request, res: Response): Promise<void> {
    const requestId = (req as any).requestId || `req_ag_${Date.now()}`;

    try {
      if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Request body must be a JSON object'
        });
        return;
      }

      const { userId, agentRole, prompt, contextParams } = req.body;
      const activeUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId : 'guest_user';

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Validation failed: Prompt string is required'
        });
        return;
      }

      const execution = await agentsService.executeAgent(activeUserId, {
        agentRole,
        prompt,
        contextParams
      });

      res.json({
        success: true,
        data: execution
      });
    } catch (err: any) {
      console.error(`[AgentsController Error] Request ${requestId} execute failed:`, err);
      res.status(500).json({
        success: false,
        error: 'ARIA Agent execution error',
        message: err.message || 'Internal server error executing agent'
      });
    }
  }

  /**
   * GET /api/aria/agents/history
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const qUser = req.query.userId;
      const userId = typeof qUser === 'string' ? qUser : Array.isArray(qUser) ? String(qUser[0]) : 'guest_user';

      const history = await agentsService.getHistory(userId);

      res.json({
        success: true,
        data: history
      });
    } catch (err: any) {
      console.error('[AgentsController Error] getHistory failed:', err);
      res.status(500).json({
        success: false,
        error: 'ARIA Agent history error',
        message: err.message || 'Internal server error fetching agent execution history'
      });
    }
  }
}
