import { SlotN } from "../redux";
import * as _ from "lodash";
import { getLengthOfSlot } from "../reporting/reporting";

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
      signed
    };
  }

  export function getSlotsOfStudent(student: string, slots: SlotN[]) {
    return slots.filter(s => s.get("studentId") === student);
  }

  export function countDays(slots: SlotN[]) {
    const dates = slots.map(s => s.get("date"));
    const uniqueDates = _.uniq(dates);
    return uniqueDates.length;
  }

  export function countHours(slots: SlotN[]) {
    return _.sumBy(slots, getLengthOfSlot);
  }

  export function calcHourRate(slots: SlotN[]) {
    return countHours(slots) / countDays(slots) || 0;
  }
}
