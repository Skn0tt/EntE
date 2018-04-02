import { RequestHandler } from "express";
import { validationResult } from "express-validator/check";

const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  next();
};

export default validate;
