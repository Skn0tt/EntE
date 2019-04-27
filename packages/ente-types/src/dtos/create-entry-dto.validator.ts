import { CreateEntryDto } from ".";
import { makeDtoValidator } from "../validators/make-validator";
import { isBefore, parseISO } from "date-fns";
import { daysBeforeNow } from "../validators/entry";
import { CreateSlotDtoValidator } from "./create-slot-dto.validator";
import { EntryReasonDtoValidator } from "./entry-reason-dto.validator";
import { isBetweenDates } from "../validators/is-between-dates";

export const makeDeadlineValidator = (deadlineInDays: number) => (
  date: Date | number
) => {
  return !isBefore(date, daysBeforeNow(deadlineInDays));
};

export const CreateEntryDtoValidator = (deadlineInDays: number) => {
  const isBeforeDeadline = makeDeadlineValidator(deadlineInDays);

  return makeDtoValidator(CreateEntryDto, (dto, errors) => {
    const slotsAreNotEmpty = dto.slots.length !== 0;
    if (!slotsAreNotEmpty) {
      errors.push("`slots` must not be empty");
    }

    const slotsValidations = dto.slots.map(
      CreateSlotDtoValidator.validateWithErrors
    );
    slotsValidations.forEach(validation =>
      validation.forEachFail(failures => errors.push(...failures))
    );

    const isRange = !!dto.dateEnd;
    if (isRange) {
      const dateEndIsBeforeDeadline = isBeforeDeadline(parseISO(dto.dateEnd!));
      if (!dateEndIsBeforeDeadline) {
        errors.push("`dateEnd` must be before deadline");
      }

      const dateIsBeforeDateEnd = isBefore(
        parseISO(dto.date),
        parseISO(dto.dateEnd!)
      );
      if (!dateIsBeforeDateEnd) {
        errors.push("`date` must be before `dateEnd`");
      }

      const isValidDate = isBetweenDates(dto.date, dto.dateEnd!);
      const slotDatesAreInRange = dto.slots.every(slot =>
        isValidDate(slot.date!)
      );
      if (!slotDatesAreInRange) {
        errors.push("dates of slots must be between `date` and `dateEnd`");
      }
    }

    if (!isRange) {
      const dateIs14DaysOrLessAgo = isBeforeDeadline(parseISO(dto.date));
      if (!dateIs14DaysOrLessAgo) {
        errors.push("`date` must be at most 14 days ago");
      }

      const slotsHaveNoDates = dto.slots.every(slot => !slot.date);
      if (!slotsHaveNoDates) {
        errors.push(`single-day entries must not have dates in their slots`);
      }
    }

    const reasonValidation = EntryReasonDtoValidator(
      isRange,
      true
    ).validateWithErrors(dto.reason);
    reasonValidation.forEachFail(fails => errors.push(...fails));
  });
};
