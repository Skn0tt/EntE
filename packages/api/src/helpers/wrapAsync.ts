import { RequestHandler } from "express";

const wrapAsync = (fn: RequestHandler): RequestHandler => (req, res, next) =>
  fn(req, res, next).catch(next);

export default wrapAsync;
