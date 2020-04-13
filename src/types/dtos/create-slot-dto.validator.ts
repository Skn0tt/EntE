import { CreateSlotDto } from ".";
import { makeDtoValidator } from "../validators/make-validator";

export const CreateSlotDtoValidator = makeDtoValidator(
  CreateSlotDto,
  (dto, errors): void => {
    const fromIsNotSmallerThanTo = dto.from <= dto.to;
    if (!fromIsNotSmallerThanTo) {
      errors.push("`from` must not be bigger than `to`");
    }
  }
);
