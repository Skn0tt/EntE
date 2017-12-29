import { Router } from 'express';

const loginRouter = Router();

/**
 * Login
 */
loginRouter.get('/', (request, response, next) => {
  try {
    return response.json({
      role: request.user.role,
      children: request.user.children,
    });
  } catch (error) {
    return next(error);
  }
});

export default loginRouter;
