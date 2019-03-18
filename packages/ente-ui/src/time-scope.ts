import {
  isSameYear,
  isSameWeek,
  isSameMonth,
  isSameDay,
  subWeeks
} from "date-fns";
import { Weekday } from "./reporting/reporting";

export type TimeScope =
  | "everything"
  | "this_year"
  | "this_month"
  | "last_two_weeks"
  | "this_week"
  | "today";

export type TimeScopeValidator = (d: Date | number) => boolean;

const timeScopeToValidator: Record<TimeScope, TimeScopeValidator> = {
  everything: () => true,
  today: d => isSameDay(d, Date.now()),
  this_month: d => isSameMonth(d, Date.now()),
  last_two_weeks: d =>
    isSameWeek(d, Date.now(), { weekStartsOn: Weekday.MONDAY }) ||
    isSameWeek(d, subWeeks(Date.now(), 1), { weekStartsOn: Weekday.MONDAY }),
  this_week: d => isSameWeek(d, Date.now(), { weekStartsOn: Weekday.MONDAY }),
  this_year: d => isSameYear(d, Date.now())
};

export const getTimeScopeValidator = (
  timeScope: TimeScope
): TimeScopeValidator => timeScopeToValidator[timeScope];

export const isInTimeScope = (timeScope: TimeScope, date: Date | number) =>
  getTimeScopeValidator(timeScope)(date);
