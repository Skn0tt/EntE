import { Weekday, Reporting } from "../reporting/reporting";
import { SlotN } from "../redux";

export type CourseFilter = {
  name: string;
  slots: CourseFilterSlot[];
};

export interface CourseFilterSlot {
  day: Weekday;
  hour: number;
}

export const doCourseSlotAndSlotOverlap = (slot: SlotN) => (
  courseSlot: CourseFilterSlot
): boolean => {
  const weekday = Reporting.weekdayOfDate(slot.get("date"));
  if (courseSlot.day !== weekday) {
    return false;
  }

  const from = slot.get("from");
  const to = slot.get("to");
  const hour = courseSlot.hour;

  return from <= hour && hour <= to;
};

export const isSlotDuringCourse = (course: CourseFilter) => (slot: SlotN) => {
  return course.slots.some(doCourseSlotAndSlotOverlap(slot));
};
