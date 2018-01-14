import { Router } from 'express';
import { dispatchWeeklySummary } from '../../routines/mail';


const devRouter = Router();

devRouter.put('/dispatchWeeklySummary', async (request, response, next) => {
  await dispatchWeeklySummary();
  response.status(200).end('Done');
});

export default devRouter;