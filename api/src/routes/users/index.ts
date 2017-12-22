import { Router } from 'express';

const usersRouter = Router();

/**
 * Get all users
 */
usersRouter.get('/', (request, response) => {

});

/**
 * Create new user
 */
usersRouter.post('/', (request, response) => {

});

/**
 * Get specific user
 */
usersRouter.get('/:userId', (request, response) => {
  const userId = request.params.userId;
})

/**
 * Update specific user
 */
usersRouter.put('/:userId', (request, response) => {
  const userId = request.params.userId;
})

export default usersRouter;