import { CreatePrefiledSlotDto } from "./create-prefiled-slot.dto";
import { makeDtoValidator } from "../validators/make-validator";

export const CreatePrefiledSlotDtoValidator = makeDtoValidator(
  CreatePrefiledSlotDto,
  (dto, errors) => {
    if (dto.hour_from > dto.hour_to) {
      errors.push(`hour_from must not be bigger than hour_to`);
    }
  }
);
