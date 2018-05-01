import { RequestHandler, Request } from "express";
import { validationResult } from "express-validator/check";
import { Validator } from "ente-validator";
import wrapAsync from "./wrapAsync";

export const validate: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  return next();
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

    for (const v of validators) {
      const satisfies = await Promise.resolve(v.check(input));

      if (!satisfies) {
        return res.status(v.status || 422).end(v.msg);
      }
    }

    return next();
  });

export default validate;
