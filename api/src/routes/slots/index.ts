import { Router } from 'express';

const slotsRouter = Router();

/**
 * Get all slots for user
 */
slotsRouter.get('/', (request, response) => {

});

/**
 * Get specific slot
 */
slotsRouter.get('/:slotId', (request, response) => {
  const slotId = request.params.slotId;
});

/**
 * Sign specific slot
 */
slotsRouter.put('/:slotId/sign', (request, response) => {
  const slotId = request.params.slotId;
});

export default slotsRouter;