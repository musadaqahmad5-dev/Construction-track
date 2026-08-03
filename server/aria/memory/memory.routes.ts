/**
 * ARIA v2.5 Memory Express Routes
 * Product: LOOK VISION v2.4
 */

import { Router } from 'express';
import { MemoryController } from './memory.controller';

const memoryRouter = Router();

/**
 * POST /api/aria/memory/update
 */
memoryRouter.post('/update', MemoryController.updateMemory);

/**
 * GET /api/aria/memory/context
 */
memoryRouter.get('/context', MemoryController.getContext);

/**
 * DELETE /api/aria/memory/item/:id
 */
memoryRouter.delete('/item/:id', MemoryController.deleteItem);

export default memoryRouter;
