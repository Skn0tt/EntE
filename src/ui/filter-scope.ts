import {
  isSameYear,
  isSameWeek,
  isSameMonth,
  isSameDay,
  subWeeks,
} from "date-fns";
import { Weekday } from "./reporting/reporting";

export type FilterScope =
  | "everything"
  | "this_year"
  | "this_month"
  | "last_two_weeks"
  | "this_week"
  | "today"
  | "not_reviewed";

export type FilterScopeValidator = (v: {
  id: string;
  date: Date | number;
  isInReviewedRecords: boolean;
}) => boolean;

const filterScopeToValidator: Record<FilterScope, FilterScopeValidator> = {
  everything: () => true,
  today: ({ date }) => isSameDay(date, Date.now()),
  this_month: ({ date }) => isSameMonth(date, Date.now()),
  last_two_weeks: ({ date }) =>
    isSameWeek(date, Date.now(), { weekStartsOn: Weekday.MONDAY }) ||
    isSameWeek(date, subWeeks(Date.now(), 1), { weekStartsOn: Weekday.MONDAY }),
  this_week: ({ date }) =>
    isSameWeek(date, Date.now(), { weekStartsOn: Weekday.MONDAY }),
  this_year: ({ date }) => isSameYear(date, Date.now()),
  not_reviewed: ({ isInReviewedRecords }) => !isInReviewedRecords,
};

export const getFilterScopeValidator = (
  filterScope: FilterScope
): FilterScopeValidator => filterScopeToValidator[filterScope];

export const isInFilterScope = (
  filterScope: FilterScope,
  v: { id: string; date: Date | number; isInReviewedRecords: boolean }
) => getFilterScopeValidator(filterScope)(v);
