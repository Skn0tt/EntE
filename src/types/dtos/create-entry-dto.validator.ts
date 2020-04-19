import { CreateEntryDto } from ".";
import { makeDtoValidator } from "../validators/make-validator";
import { isBefore, parseISO } from "date-fns";
import { CreateSlotDtoValidator } from "./create-slot-dto.validator";
import { EntryReasonDtoValidator } from "./entry-reason-dto.validator";
import { isBetweenDates } from "../validators/is-between-dates";

export const CreateEntryDtoValidator = makeDtoValidator(
  CreateEntryDto,
  (dto, errors) => {
    const amountOfSlots = dto.slots.length + dto.prefiledSlots.length;
    if (amountOfSlots <= 0) {
      errors.push("Please provide slots or prefiledSlots");
    }

    const slotsValidations = dto.slots.map(
      CreateSlotDtoValidator.validateWithErrors
    );
    slotsValidations.forEach((validation) =>
      validation.forEachFail((failures) => errors.push(...failures))
    );

    const isRange = !!dto.dateEnd;
    if (isRange) {
      const dateIsBeforeDateEnd = isBefore(
        parseISO(dto.date),
        parseISO(dto.dateEnd!)
      );
      if (!dateIsBeforeDateEnd) {
        errors.push("`date` must be before `dateEnd`");
      }

      const isValidDate = isBetweenDates(dto.date, dto.dateEnd!);
      const slotDatesAreInRange = dto.slots.every((slot) =>
        isValidDate(slot.date!)
      );
      if (!slotDatesAreInRange) {
        errors.push("dates of slots must be between `date` and `dateEnd`");
      }
    } else {
      const slotsHaveNoDates = dto.slots.every((slot) => !slot.date);
      if (!slotsHaveNoDates) {
        errors.push(`single-day entries must not have dates in their slots`);
      }
    }

    const reasonValidation = EntryReasonDtoValidator(
      isRange,
      true
    ).validateWithErrors(dto.reason);
    reasonValidation.forEachFail((fails) => errors.push(...fails));
  }
);
