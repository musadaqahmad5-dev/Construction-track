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
import prototypeRouter from './prototype.routes';
import onboardingRouter from './onboarding/onboarding.routes';

const ariaRouter = Router();

/**
 * POST /api/aria/theme/generate & /api/v1/aria/theme/generate
 * Dynamic light theme generation with WCAG compliance & provenance validation
 */
ariaRouter.post('/theme/generate', ARIAController.handleThemeGenerate);

/**
 * POST /api/aria/query
 * Core endpoint for dispatching ARIA AI requests
 */
ariaRouter.post('/query', ARIAController.handleQuery);

/**
 * POST /api/aria/request
 * Direct endpoint for executing ARIA Orchestrator requests
 */
ariaRouter.post('/request', ARIAController.handleRequest);

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

/**
 * /api/aria/prototype route
 */
ariaRouter.use('/prototype', prototypeRouter);

/**
 * /api/aria/onboarding & /api/v1/aria/onboarding routes
 */
ariaRouter.use('/onboarding', onboardingRouter);

export default ariaRouter;
