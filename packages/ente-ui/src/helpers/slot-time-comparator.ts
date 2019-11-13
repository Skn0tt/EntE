import { SlotN } from "../redux";
import { compareAsc, parseISO } from "date-fns";

export function slotTimeComparator(a: SlotN, b: SlotN): number {
  const dateComparison = compareAsc(
    parseISO(a.get("date")),
    parseISO(b.get("date"))
  );

  if (dateComparison !== 0) {
    return dateComparison;
  }

  const fromA = a.get("from");
  const fromB = b.get("from");
  return fromA - fromB;
}
