import { Router } from 'express';

const entriesRouter = Router();

/**
 * Get all entries for user
 */
entriesRouter.get('/', (request, response) => {
  
});

/**
 * Create new entry
 */
entriesRouter.post('/', (request, response) => {

});

/**
 * Get specific entry
 */
entriesRouter.get('/:entryId', (request, response) => {
  const entryId = request.params.entryId;
});

export default entriesRouter;
