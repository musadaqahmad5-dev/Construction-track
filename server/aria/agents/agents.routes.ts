/**
 * ARIA v2.5 Agents Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { AgentsController } from './agents.controller';

const agentsRouter = Router();

/**
 * GET /api/aria/agents
 */
agentsRouter.get('/', AgentsController.getAgents);

/**
 * POST /api/aria/agents/execute
 */
agentsRouter.post('/execute', AgentsController.execute);

/**
 * GET /api/aria/agents/history
 */
agentsRouter.get('/history', AgentsController.getHistory);

export default agentsRouter;
