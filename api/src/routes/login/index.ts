import { Router } from 'express';

const loginRouter = Router();

/**
 * Login
 */
loginRouter.get('/', (request, response) => response.json(request.user.role));

export default loginRouter;
