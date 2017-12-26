import { Router } from 'express';

const loginRouter = Router();

/**
 * Login
 */
loginRouter.get('/', async (request, response) => request.user.role);

export default loginRouter;
