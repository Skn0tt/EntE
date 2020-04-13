import { Validation, Success, Fail } from "monet";
import { ValidationError, validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import { DtoValidator } from "./dto-validator";

export type Class<T> = { new (...args: any[]): T };

export const makeAnnotationValidator = <T>(
  _class: Class<T>
): DtoValidator<T> => {
  const withErrors = (value: T): Validation<ValidationError[], T> => {
    const c = value instanceof _class ? value : plainToClass(_class, value);

    const errors = validateSync(c);

    return errors.length === 0
      ? Success<ValidationError[], T>(c)
      : Fail<ValidationError[], T>(errors);
  };

  const withOutErros = (value: T) => {
    const result = withErrors(value);
    return result.isSuccess();
  };

  return {
    validate: withOutErros,
    validateWithErrors: withErrors,
  };
};
