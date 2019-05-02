import { Weekday, weekdayOfDate } from "../reporting/reporting";
import { SlotN } from "../redux";

export type CourseFilter = CourseFilterSlot[];

export interface CourseFilterSlot {
  day: Weekday;
  hour: number;
}

export const doCourseSlotAndSlotOverlap = (slot: SlotN) => (
  courseSlot: CourseFilterSlot
): boolean => {
  const weekday = weekdayOfDate(slot.get("date"));
  if (courseSlot.day !== weekday) {
    return false;
  }

  const from = slot.get("from");
  const to = slot.get("to");
  const hour = courseSlot.hour;

  return from <= hour && hour <= to;
};

export const isSlotDuringCourse = (course: CourseFilter) => (slot: SlotN) => {
  return course.some(doCourseSlotAndSlotOverlap(slot));
};
