import { SyncValidator } from "./";

const DAY = 24 * 60 * 60 * 1000;

export const isTwoWeeksBeforeNow: SyncValidator<Date> = d =>
  +d > +new Date(+new Date() - 14 * DAY);
