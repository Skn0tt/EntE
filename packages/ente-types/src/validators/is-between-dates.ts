import { isBefore, isAfter } from "date-fns";

export const isBetweenDates = (start: string, end: string) => (
  v: string
): boolean => {
  if (isBefore(v, start)) {
    return false;
  }

  if (isAfter(v, end)) {
    return false;
  }

  return true;
};
