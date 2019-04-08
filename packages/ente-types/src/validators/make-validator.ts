import { Fail, Success, Validation } from "monet";
import { makeAnnotationValidator, Class } from "./make-annotation-validator";
import { DtoValidator, FailResult } from "./dto-validator";

const DEBUG_MODE = true;

export function makeDtoValidator<T>(
  _class: Class<T>,
  f: (v: T, errors: FailResult) => void
): DtoValidator<T> {
  const AnnotationValidator = makeAnnotationValidator(_class);

  const withErrors = (v: T): Validation<FailResult, T> => {
    const annotationResult = AnnotationValidator.validateWithErrors(
      v
    ) as Validation<FailResult, T>;
    return annotationResult.flatMap(correctValue => {
      const errors: string[] = [];
      f(correctValue, errors);
      return errors.length === 0 ? Success(correctValue) : Fail(errors);
    });
  };

  const withoutErrors = (v: T) => {
    const result = withErrors(v);

    if (DEBUG_MODE) {
      return result.cata(
        fail => {
          console.log(JSON.stringify(fail));
          return false;
        },
        () => true
      );
    }

    return result.isSuccess();
  };

  return {
    validate: withoutErrors as (v: T) => boolean,
    validateWithErrors: withErrors
  };
}
