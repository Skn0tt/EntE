import { isBefore, isAfter, parseISO } from "date-fns";

export const isBetweenDates = (start: string, end: string) => (
  v: string
): boolean => {
  if (isBefore(parseISO(v), parseISO(start))) {
    return false;
  }

  if (isAfter(parseISO(v), parseISO(end))) {
    return false;
  }

  return true;
};
