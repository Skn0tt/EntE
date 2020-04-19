import { makeDtoValidator } from "../validators/make-validator";
import {
  EntryReasonDto,
  EntryReasonCategory,
  FieldTripPayload,
  CompetitionPayload,
  ExamenPayload,
} from "./entry-reason.dto";
import { Maybe } from "monet";

export const EntryReasonDtoValidator = (
  _isMultiday?: boolean,
  enableTeacherIdCheck: boolean = false
) =>
  makeDtoValidator(EntryReasonDto, (dto, errors) => {
    const { category, payload } = dto;

    const isMultiday = Maybe.fromUndefined(_isMultiday);

    const hasTime = [
      EntryReasonCategory.COMPETITION,
      EntryReasonCategory.EXAMEN,
      EntryReasonCategory.FIELD_TRIP,
    ].includes(category);
    if (hasTime && !isMultiday.contains(true)) {
      const { from, to } = payload as
        | FieldTripPayload
        | CompetitionPayload
        | ExamenPayload;

      const areInCorrectOrder = from <= to;
      if (!areInCorrectOrder) {
        errors.push("'from' needs to be less or equal than 'to'");
      }
    }

    if (enableTeacherIdCheck) {
      const shouldHaveTeacherId = [
        EntryReasonCategory.EXAMEN,
        EntryReasonCategory.FIELD_TRIP,
      ].includes(category);
      if (shouldHaveTeacherId) {
        const { teacherId } = payload as ExamenPayload | FieldTripPayload;
        const hasTeacherId = !!teacherId;

        if (!hasTeacherId) {
          errors.push("'teacherId' needs to be set");
        }
      }
    }

    isMultiday.forEach((isMultiday) => {
      const canHaveDates = [EntryReasonCategory.FIELD_TRIP].includes(category);
      if (canHaveDates) {
        const { startDate, endDate } = payload as FieldTripPayload;
        const hasStartDateAndEndDate = !!startDate && !!endDate;
        if (isMultiday && !hasStartDateAndEndDate) {
          errors.push("reason needs to have 'startDate' and 'endDate' set.");
        }
        if (!isMultiday && hasStartDateAndEndDate) {
          errors.push("reason must not 'startDate' and 'endDate' set.");
        }
      }
    });
  });
