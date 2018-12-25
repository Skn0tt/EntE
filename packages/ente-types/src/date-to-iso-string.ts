import { format } from "date-fns";

export const dateToIsoString = (d: Date | number | string) =>
  format(d, "yyyy-MM-dd");
