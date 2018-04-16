const AUGUST = 8 - 1;
const DAY = 24 * 60 * 60 * 1000;

const currentMonth = () => new Date().getMonth();
const currentYear = () => new Date().getFullYear();

export const lastAugustFirst = (): Date => {
  const year = currentMonth() < AUGUST ? currentYear() - 1 : currentYear();

  return new Date(year, AUGUST, 1);
};

const toFuture = (t: number): Date => new Date(Date.now() + t);

export const twoWeeksInPast = () => toFuture(-14 * DAY);

export const oneDayInFuture = () => toFuture(1 * DAY);
