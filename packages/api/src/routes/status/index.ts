/**
 * Express
 */
import { Router, Request, Response } from "express";

/**
 * Status Router
 * '/status'
 *
 * Unauthenticated
 */
const statusRouter = Router();

/**
 * Status
 */
statusRouter.get("/", (_, res) => res.status(200).send("OK"));

export default statusRouter;
