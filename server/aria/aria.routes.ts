/**
 * ARIA v2.5 Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { ARIAController } from './aria.controller';
import memoryRouter from './memory/memory.routes';
import styleDNARouter from './styleDNA/styleDNA.routes';
import decisionRouter from './decision/decision.routes';
import creativeRouter from './creative/creative.routes';
import visionRouter from './vision/vision.routes';
import agentsRouter from './agents/agents.routes';
import digitalTwinRouter from './digitalTwin/digitalTwin.routes';
import simulationRouter from './simulation/simulation.routes';
import civilizationRouter from './civilization/civilization.routes';

const ariaRouter = Router();

/**
 * POST /api/aria/query
 * Core endpoint for dispatching ARIA AI requests
 */
ariaRouter.post('/query', ARIAController.handleQuery);

/**
 * /api/aria/memory routes
 */
ariaRouter.use('/memory', memoryRouter);

/**
 * /api/aria/style-dna routes
 */
ariaRouter.use('/style-dna', styleDNARouter);

/**
 * /api/aria/decision routes
 */
ariaRouter.use('/decision', decisionRouter);

/**
 * /api/aria/creative routes
 */
ariaRouter.use('/creative', creativeRouter);

/**
 * /api/aria/vision routes
 */
ariaRouter.use('/vision', visionRouter);

/**
 * /api/aria/agents routes
 */
ariaRouter.use('/agents', agentsRouter);

/**
 * /api/aria/digital-twin routes
 */
ariaRouter.use('/digital-twin', digitalTwinRouter);

/**
 * /api/aria/simulation routes
 */
ariaRouter.use('/simulation', simulationRouter);

/**
 * /api/aria/civilization routes
 */
ariaRouter.use('/civilization', civilizationRouter);

export default ariaRouter;
