import { SlotN, EntryN } from "../redux/";
import * as _ from "lodash";
import { getDay, differenceInCalendarDays, parseISO } from "date-fns";
import { fillRange } from "../helpers/fillRange";

export enum Weekday {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

export module Reporting {
  export function partitionSlots(slots: SlotN[]) {
    const prefiled: SlotN[] = [];
    const created: SlotN[] = [];
    const signed: SlotN[] = [];

    for (const slot of slots) {
      if (slot.get("isPrefiled")) {
        prefiled.push(slot);
        continue;
      }

      if (slot.get("signed") === true) {
        signed.push(slot);
      } else {
        created.push(slot);
      }
    }

    return {
      prefiled,
      created,
      signed,
    };
  }

  export function getSlotsOfStudent(student: string, slots: SlotN[]) {
    return slots.filter((s) => s.get("studentId") === student);
  }

  export function countDays(slots: SlotN[]) {
    const dates = slots.map((s) => s.get("date"));
    const uniqueDates = _.uniq(dates);
    return uniqueDates.length;
  }

  export function countHours(slots: SlotN[]) {
    return _.sumBy(slots, getLengthOfSlot);
  }

  export function calcHourRate(slots: SlotN[]) {
    return countHours(slots) / countDays(slots) || 0;
  }

  export const getLengthOfEntry = (entry: EntryN): number => {
    if (!entry.get("dateEnd")) {
      return 1;
    }

    const distance = differenceInCalendarDays(
      parseISO(entry.get("dateEnd")!),
      parseISO(entry.get("date"))
    );
    return Math.abs(distance) + 1;
  };

  export const slotsByTeacher = (slots: SlotN[]): Record<string, SlotN[]> => {
    const result = _.groupBy(slots, (slot: SlotN) => slot.get("teacherId"));
    return _.omit(result, "null");
  };

  export const absentHoursByTeacher = (
    slots: SlotN[]
  ): Record<string, number> => {
    return _.mapValues(slotsByTeacher(slots), (slots) =>
      _.sumBy(slots, getLengthOfSlot)
    );
  };

  export const weekdayOfDate = (date: string): Weekday => {
    const weekday = getDay(parseISO(date));

    const isSunday = weekday === 0;

    if (isSunday) {
      // ISO 8601: Monday is start of the week;
      return Weekday.SUNDAY;
    }

    return weekday;
  };

  export const weekdayOfSlot = (slot: SlotN): Weekday => {
    const timestamp = slot.get("date");
    return weekdayOfDate(timestamp);
  };

  export const slotsByWeekDay = (slots: SlotN[]): Record<Weekday, SlotN[]> => {
    const result = _.groupBy(slots, (slot: SlotN) => weekdayOfSlot(slot));

    return result as any;
  };

  export const hoursOfSlot = (slot: SlotN): number[] => {
    const from = slot.get("from");
    const to = slot.get("to");
    return fillRange(from, to);
  };

  export const getLengthOfSlot = (slot: SlotN): number => {
    return slot.get("to") - slot.get("from") + 1;
  };

  export const hoursByWeekdayAndTime = (
    slots: SlotN[]
  ): Record<Weekday, Record<number, number>> => {
    const result: Record<number, Record<number, number>> = {};
    const addHours = (weekday: number, time: number, hours: number) => {
      if (!result[weekday]) {
        result[weekday] = {};
      }
      const oldWeekday = result[weekday];

      const oldTime = oldWeekday[time] || 0;
      const newTime = oldTime + hours;

      oldWeekday[time] = newTime;
    };

    slots.forEach((slot) => {
      const weekday = weekdayOfSlot(slot);
      const hours = hoursOfSlot(slot);
      hours.forEach((hour) => addHours(weekday, hour, 1));
    });

    return result;
  };
}
