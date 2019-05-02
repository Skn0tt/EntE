import { makeTranslationHook } from "./makeTranslationHook";
import { Weekday } from "../reporting/reporting";

export const useWeekdayTranslations = makeTranslationHook({
  en: {
    full: {
      [Weekday.MONDAY]: "Monday",
      [Weekday.TUESDAY]: "Tuesday",
      [Weekday.WEDNESDAY]: "Wednesday",
      [Weekday.THURSDAY]: "Thursday",
      [Weekday.FRIDAY]: "Friday",
      [Weekday.SATURDAY]: "Saturday",
      [Weekday.SUNDAY]: "Sunday"
    } as Record<string, string>,
    twoCharacter: {
      [Weekday.MONDAY]: "Mo",
      [Weekday.TUESDAY]: "Tu",
      [Weekday.WEDNESDAY]: "We",
      [Weekday.THURSDAY]: "Thu",
      [Weekday.FRIDAY]: "Fri",
      [Weekday.SATURDAY]: "Sat",
      [Weekday.SUNDAY]: "Sun"
    } as Record<string, string>
  },
  de: {
    full: {
      [Weekday.MONDAY]: "Montag",
      [Weekday.TUESDAY]: "Dienstag",
      [Weekday.WEDNESDAY]: "Mittwoch",
      [Weekday.THURSDAY]: "Donnerstag",
      [Weekday.FRIDAY]: "Freitag",
      [Weekday.SATURDAY]: "Samstag",
      [Weekday.SUNDAY]: "Sonntag"
    } as Record<string, string>,
    twoCharacter: {
      [Weekday.MONDAY]: "Mo",
      [Weekday.TUESDAY]: "Di",
      [Weekday.WEDNESDAY]: "Mi",
      [Weekday.THURSDAY]: "Do",
      [Weekday.FRIDAY]: "Fr",
      [Weekday.SATURDAY]: "Sa",
      [Weekday.SUNDAY]: "So"
    } as Record<string, string>
  }
});
