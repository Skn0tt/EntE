import { CreateEntryDto, EntryReasonCategory } from ".";
import { makeDtoValidator } from "../validators/make-validator";
import { isBefore } from "date-fns";
import { daysBeforeNow } from "../validators/entry";
import { CreateSlotDtoValidator } from "./create-slot-dto.validator";
import { dateToIsoString } from "../date-to-iso-string";
import { EntryReasonDtoValidator } from "./entry-reason-dto.validator";
import { isBetweenDates } from "../validators/is-between-dates";

export const is14DaysOrLessAgo = (date: string) => {
  return !isBefore(date, dateToIsoString(daysBeforeNow(14)));
};

export const CreateEntryDtoValidator = makeDtoValidator(
  CreateEntryDto,
  (dto, errors) => {
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

    const isForSchool = dto.forSchool;
    if (isForSchool) {
      const reasonIsSet = !!dto.reason;
      if (!reasonIsSet) {
        errors.push("If `forSchool` is true, `reason` must be set");
      } else {
        const reasonValidation = EntryReasonDtoValidator.validateWithErrors(
          dto.reason!
        );
        reasonValidation.forEachFail(fails => errors.push(...fails));
      }
    }

    if (!isForSchool) {
      const isReasonUnset = !dto.reason;
      if (!isReasonUnset) {
        errors.push(
          "entries that are not `forSchool` must not have a `reason`"
        );
      }
    }

    const isRange = !!dto.dateEnd;
    if (isRange) {
      const dateEndIs14DaysOrLessAgo = is14DaysOrLessAgo(dto.dateEnd!);
      if (!dateEndIs14DaysOrLessAgo) {
        errors.push("`dateEnd` must be at most 14 days ago");
      }

      const dateIsBeforeDateEnd = isBefore(dto.date, dto.dateEnd!);
      if (!dateIsBeforeDateEnd) {
        errors.push("`date` must be before `dateEnd`");
      }

      if (isForSchool) {
        const reasonCategoryIsAllowed = [EntryReasonCategory.OTHER].includes(
          dto.reason!.category
        );
        if (!reasonCategoryIsAllowed) {
          errors.push("ranged entries only allow reason category `other`");
        }
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
      const dateIs14DaysOrLessAgo = is14DaysOrLessAgo(dto.date);
      if (!dateIs14DaysOrLessAgo) {
        errors.push("`date` must be at most 14 days ago");
      }

      const slotsHaveNoDates = dto.slots.every(slot => !slot.date);
      if (!slotsHaveNoDates) {
        errors.push(`single-day entries must not have dates in their slots`);
      }
    }
  }
);
