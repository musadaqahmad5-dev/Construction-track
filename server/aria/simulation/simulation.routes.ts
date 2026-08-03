/**
 * ARIA v2.5 Simulation Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { SimulationController } from './simulation.controller';

const simulationRouter = Router();

/**
 * POST /api/aria/simulation/run
 */
simulationRouter.post('/run', SimulationController.runSimulation);

/**
 * GET /api/aria/simulation/history
 */
simulationRouter.get('/history', SimulationController.getHistory);

/**
 * GET /api/aria/simulation/report/:id
 */
simulationRouter.get('/report/:id', SimulationController.getReportById);

export default simulationRouter;
