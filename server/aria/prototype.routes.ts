/**
 * ARIA Prototype API Routes
 * Product: LOOK VISION v2.4
 * Endpoint: POST /api/aria/prototype
 */

import { Router } from 'express';
import { ARIAPrototypeAPIController } from './prototype.controller';

const prototypeRouter = Router();

prototypeRouter.post('/', ARIAPrototypeAPIController.handlePrototypeRequest);

export default prototypeRouter;
