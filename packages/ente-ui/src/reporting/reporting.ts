import { SlotN, EntryN } from "../redux/";
import * as _ from "lodash";
import { getDay, differenceInCalendarDays } from "date-fns";
import { fillRange } from "../helpers/fillRange";

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

interface EntrySummary {
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

export const summarize = (entries: EntryN[]): EntrySummary => {
  const excusedEntries = entries.filter(isExcused);

  const cumulateLength = (entries: EntryN[]) => {
    return _.sumBy(entries, entry => {
      return getLengthOfEntry(entry);
    });
  };

  const absentDaysTotal = cumulateLength(entries);
  const absentDaysExcused = cumulateLength(excusedEntries);
  const absentDaysUnexcused = absentDaysTotal - absentDaysExcused;

  const cumulateSlots = (entries: EntryN[]) => {
    return _.sumBy(entries, entry => {
      return entry.get("slotIds").length;
    });
  };

  const absentSlotsTotal = cumulateSlots(entries);
  const absentSlotsExcused = cumulateSlots(excusedEntries);
  const absentSlotsUnexcused = absentSlotsTotal - absentSlotsExcused;

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
    slotsPerDay: absentSlotsTotal / absentDaysTotal
  };
};

export const slotsByTeacher = (slots: SlotN[]): Record<string, SlotN[]> => {
  const result = _.groupBy(slots, (slot: SlotN) => slot.get("teacherId"));
  return result;
};

export const weekdayOfSlot = (slot: SlotN): Weekday => {
  const timestamp = slot.get("date");
  const weekday = getDay(timestamp);
  return weekday;
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
  slotsByTeacher
};
