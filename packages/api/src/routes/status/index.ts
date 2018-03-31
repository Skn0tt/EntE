import { Router, Request, Response } from 'express';

const statusRouter = Router();

/**
 * Login
 */
statusRouter.get('/', async (request: Request, response: Response, next) => {
  try {
    return response.status(200).send('OK');
  } catch (error) {
    return next(error);
  }
});

export default statusRouter;
