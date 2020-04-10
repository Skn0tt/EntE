import { format, parseISO } from "date-fns";

export const dateToIsoString = (d: Date | number | string) => {
  const v = typeof d === "string" ? parseISO(d) : d;
  return format(v, "yyyy-MM-dd");
};
