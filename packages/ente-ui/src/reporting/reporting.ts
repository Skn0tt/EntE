import { SlotN, EntryN } from "../redux/";
import * as _ from "lodash";
import { getDay, differenceInCalendarDays } from "date-fns";
import { fillRange } from "../helpers/fillRange";
import { Map } from "immutable";

export enum Weekday {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7
}

interface TotalAndUnexcused {
  total: number;
  unexcused: number;
  excused: number;
}

export interface EntrySummary {
  entries: TotalAndUnexcused;
  absentDays: TotalAndUnexcused;
  absentSlots: TotalAndUnexcused;
  slotsPerDay: number;
}

export const getLengthOfEntry = (entry: EntryN): number => {
  if (!entry.get("dateEnd")) {
    return 1;
  }

  const distance = differenceInCalendarDays(
    entry.get("dateEnd")!,
    entry.get("date")
  );
  return Math.abs(distance) + 1;
};

const isExcused = (entry: EntryN): boolean =>
  entry.get("signedParent") && entry.get("signedManager");

export const summarize = (
  entries: EntryN[],
  slots: Map<string, SlotN>
): EntrySummary => {
  const slotsOfEntries = _.flatMap(entries, entry =>
    entry.get("slotIds").map(id => slots.get(id)!)
  );

  const slotsByUniqueDate = _.uniqBy(slotsOfEntries, s => s.get("date"));

  const absentDaysTotal = slotsByUniqueDate.length;
  const absentDaysExcused = slotsByUniqueDate.filter(s => s.get("signed"))
    .length;
  const absentDaysUnexcused = absentDaysTotal - absentDaysExcused;

  const absentSlotsTotal = _.sumBy(slotsOfEntries, getLengthOfSlot);
  const absentSlotsExcused = _.sumBy(
    slotsOfEntries.filter(f => f.get("signed")),
    getLengthOfSlot
  );
  const absentSlotsUnexcused = absentSlotsTotal - absentSlotsExcused;

  const excusedEntries = entries.filter(isExcused);

  return {
    entries: {
      total: entries.length,
      excused: excusedEntries.length,
      unexcused: entries.length - excusedEntries.length
    },
    absentDays: {
      total: absentDaysTotal,
      excused: absentDaysExcused,
      unexcused: absentDaysUnexcused
    },
    absentSlots: {
      total: absentSlotsTotal,
      excused: absentSlotsExcused,
      unexcused: absentSlotsUnexcused
    },
    slotsPerDay: absentSlotsTotal / absentDaysTotal || 0
  };
};

export const slotsByTeacher = (slots: SlotN[]): Record<string, SlotN[]> => {
  const result = _.groupBy(slots, (slot: SlotN) => slot.get("teacherId"));
  return result;
};

export const absentHoursByTeacher = (
  slots: SlotN[]
): Record<string, number> => {
  return _.mapValues(slotsByTeacher(slots), slots =>
    _.sumBy(slots, getLengthOfSlot)
  );
};

export const weekdayOfDate = (date: string): Weekday => {
  const weekday = getDay(date);

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

  slots.forEach(slot => {
    const weekday = weekdayOfSlot(slot);
    const hours = hoursOfSlot(slot);
    hours.forEach(hour => addHours(weekday, hour, 1));
  });

  return result;
};

export const Reporting = {
  summarize,
  hoursByWeekdayAndTime,
  absentHoursByTeacher,
  slotsByTeacher
};
