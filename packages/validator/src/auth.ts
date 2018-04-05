import { SyncValidator } from "./";

const isBetween = (min: number, max: number): SyncValidator<number> => n =>
  n > min && n < max;

const isLength = (min: number, max: number): SyncValidator<string> => v =>
  isBetween(min, max)(v.length);

const matches = <T>(validators: SyncValidator<T>[]): SyncValidator<T> => t =>
  validators.every(v => v(t));

export const isValidPassword: SyncValidator<string> = matches([
  isLength(8, 100)
]);
