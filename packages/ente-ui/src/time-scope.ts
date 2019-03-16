import {
  isSameYear,
  isSameWeek,
  isSameMonth,
  isSameDay,
  Options
} from "date-fns";
import { subWeeks } from "date-fns/esm";
import { Weekday } from "./reporting/reporting";

export type TimeScope =
  | "everything"
  | "this_year"
  | "this_month"
  | "last_two_weeks"
  | "this_week"
  | "today";

export type TimeScopeValidator = (d: Date | number) => boolean;

const options: Options = {
  weekStartsOn: Weekday.MONDAY
};

const timeScopeToValidator: Record<TimeScope, TimeScopeValidator> = {
  everything: () => true,
  today: d => isSameDay(d, Date.now(), options),
  this_month: d => isSameMonth(d, Date.now(), options),
  last_two_weeks: d =>
    isSameWeek(d, Date.now(), options) ||
    isSameWeek(d, subWeeks(Date.now(), 1), options),
  this_week: d => isSameWeek(d, Date.now(), options),
  this_year: d => isSameYear(d, Date.now(), options)
};

export const getTimeScopeValidator = (
  timeScope: TimeScope
): TimeScopeValidator => timeScopeToValidator[timeScope];

export const isInTimeScope = (timeScope: TimeScope, date: Date | number) =>
  getTimeScopeValidator(timeScope)(date);
