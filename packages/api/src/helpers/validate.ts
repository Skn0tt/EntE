import { RequestHandler, Request } from "express";
import { validationResult } from "express-validator/check";
import { Validator } from "ente-validator";
import wrapAsync from "./wrapAsync";

export const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  next();
};

type Validate<T> = {
  check: Validator<T>;
  status?: number;
  msg?: string;
};

export const check = <T>(
  extract: (req: Request) => T,
  validators: Validate<T>[]
): RequestHandler =>
  wrapAsync(async (req, res, next) => {
    const input = extract(req);

    const promises = validators.map(async ({ check, status, msg }) => {
      const fulfills = await Promise.resolve(check(input));

      if (!fulfills) {
        return res.status(status).end(msg);
      }
    });

    await Promise.all(promises);

    return next();
  });

export default validate;
