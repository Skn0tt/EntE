import { Router } from 'express';

const loginRouter = Router();

/**
 * Login
 */
loginRouter.get('/', (request, response) => response.json({
  role: request.user.role,
  children: request.user.children,
}));

export default loginRouter;
