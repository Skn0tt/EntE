type Validator<T> = (v: T) => boolean;

const isBetween = (min: number, max: number): Validator<number> => n =>
  n > min && n < max;

const isLength = (min: number, max: number): Validator<string> => v =>
  isBetween(min, max)(v.length);

const matches = <T>(validators: Validator<T>[]): Validator<T> => t =>
  validators.every(v => v(t));

export const isValidPassword: Validator<string> = matches([isLength(8, 100)]);

const DAY = 24 * 60 * 60 * 1000;

export const isTwoWeeksBeforeNow = (d: Date): boolean =>
  +d > +new Date(+new Date() - 14 * DAY);
