import { Router } from "express";
import { dispatchWeeklySummary } from "../../helpers/mail";
import wrapAsync from "../../helpers/wrapAsync";

const devRouter = Router();

devRouter.put(
  "/dispatchWeeklySummary",
  wrapAsync(async (request, response, next) => {
    await dispatchWeeklySummary();
    response.status(200).end("Done");
  })
);

export default devRouter;
