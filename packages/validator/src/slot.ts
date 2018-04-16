import { ISlotCreate } from "ente-types";
import { SyncValidator, isValidUuid } from "ente-validator";
import { matches, isBetween } from "./shared";

const isInHourRange = isBetween(1, 13);

export const isValidSlot: SyncValidator<ISlotCreate> = matches([
  s => isValidUuid(s.teacher),
  s => isInHourRange(s.hour_from),
  s => isInHourRange(s.hour_to),
  s => s.hour_from <= s.hour_to
]);
