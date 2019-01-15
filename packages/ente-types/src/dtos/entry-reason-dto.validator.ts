import { makeDtoValidator } from "../validators/make-validator";
import { EntryReasonDto } from "./entry-reason.dto";

export const EntryReasonDtoValidator = makeDtoValidator(
  EntryReasonDto,
  (dto, errors) => {}
);
