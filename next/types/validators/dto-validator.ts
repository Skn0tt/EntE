import { Validation } from "monet";
import { ValidationError } from "class-validator";

export type FailResult = (ValidationError | string)[];

export interface DtoValidator<T> {
  validate: (v: T) => boolean;
  validateWithErrors: (v: T) => Validation<FailResult, T>;
}
