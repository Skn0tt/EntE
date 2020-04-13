import {
  EntryReasonCategory,
  EntryReasonDto,
  ExamenPayload,
  FieldTripPayload,
  IllnessPayload,
} from "./entry-reason.dto";
import { EntryReasonDtoValidator } from "./entry-reason-dto.validator";

describe("EntryReasonValidator", () => {
  describe(EntryReasonCategory.ILLNESS, () => {
    describe("when given empty object payload", () => {
      it("returns true", () => {
        expect(
          EntryReasonDtoValidator().validate({
            category: EntryReasonCategory.ILLNESS,
            payload: {} as IllnessPayload,
          })
        ).toBe(true);
      });
    });
  });
  describe(EntryReasonCategory.OTHER_EDUCATIONAL, () => {
    describe("when given valid DTO", () => {
      const dto = (): EntryReasonDto => ({
        category: EntryReasonCategory.OTHER_EDUCATIONAL,
        payload: { description: "test" },
      });

      it("returns true", () => {
        expect(EntryReasonDtoValidator().validate(dto())).toBe(true);
      });
    });

    describe("when given not given needed fields", () => {
      const dto = (): EntryReasonDto => ({
        category: EntryReasonCategory.OTHER_EDUCATIONAL,
        payload: { from: 1, to: 2 } as any,
      });

      it("returns false", () => {
        expect(EntryReasonDtoValidator().validate(dto())).toBe(false);
      });
    });
  });

  describe("when given times", () => {
    describe("in the correct order", () => {
      it("returns true", () => {
        expect(
          EntryReasonDtoValidator().validate({
            category: EntryReasonCategory.EXAMEN,
            payload: {
              from: 4,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
            } as ExamenPayload,
          })
        ).toBe(true);
      });
    });
    describe("twisted", () => {
      it("returns false", () => {
        expect(
          EntryReasonDtoValidator().validate({
            category: EntryReasonCategory.EXAMEN,
            payload: {
              from: 5,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
            } as ExamenPayload,
          })
        ).toBe(false);
      });
    });

    describe("in multiday-mode", () => {
      describe("twisted", () => {
        it("returns true", () => {
          expect(
            EntryReasonDtoValidator(true).validate({
              category: EntryReasonCategory.EXAMEN,
              payload: {
                from: 5,
                to: 4,
                teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
              } as ExamenPayload,
            })
          ).toBe(true);
        });
      });
    });
  });

  describe("when 'teacherId'", () => {
    describe("is missing", () => {
      it("returns false", () => {
        expect(
          EntryReasonDtoValidator(undefined, true).validate({
            category: EntryReasonCategory.EXAMEN,
            payload: {
              from: 4,
              to: 4,
            } as ExamenPayload,
          })
        ).toBe(false);
      });
    });
    describe("is provided", () => {
      it("returns true", () => {
        expect(
          EntryReasonDtoValidator(undefined, true).validate({
            category: EntryReasonCategory.EXAMEN,
            payload: {
              from: 4,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
            } as ExamenPayload,
          })
        ).toBe(true);
      });
    });
    describe("is non-uuid", () => {
      it("returns false", () => {
        expect(
          EntryReasonDtoValidator().validate({
            category: EntryReasonCategory.EXAMEN,
            payload: {
              from: 5,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec",
            } as ExamenPayload,
          })
        ).toBe(false);
      });
    });
  });

  describe("when entry is", () => {
    describe("single-day", () => {
      describe("and given startDate & endDate", () => {
        it("returns false", () => {
          expect(
            EntryReasonDtoValidator(false).validate({
              category: EntryReasonCategory.FIELD_TRIP,
              payload: {
                from: 1,
                to: 2,
                teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
                startDate: "2000-01-01",
                endDate: "2000-01-02",
              } as FieldTripPayload,
            })
          ).toBe(false);
        });
      });
      describe("and not given startDate & endDate", () => {
        it("returns true", () => {
          expect(
            EntryReasonDtoValidator(false).validate({
              category: EntryReasonCategory.FIELD_TRIP,
              payload: {
                from: 1,
                to: 2,
                teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
              } as FieldTripPayload,
            })
          ).toBe(true);
        });
      });
    });
    describe("range", () => {
      describe("and given a category that cannot be in multi-day", () => {
        it("returns false", () => {
          expect(
            EntryReasonDtoValidator(true).validate({
              category: EntryReasonCategory.EXAMEN,
              payload: {
                from: 1,
                to: 2,
                teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
              } as ExamenPayload,
            })
          ).toBe(true);
        });
      });

      describe("and given startDate & endDate", () => {
        it("returns true", () => {
          expect(
            EntryReasonDtoValidator(true).validate({
              category: EntryReasonCategory.FIELD_TRIP,
              payload: {
                from: 1,
                to: 2,
                teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
                startDate: "2000-01-01",
                endDate: "2000-01-02",
              } as FieldTripPayload,
            })
          ).toBe(true);
        });
      });
      describe("and not given startDate & endDate", () => {
        it("returns false", () => {
          expect(
            EntryReasonDtoValidator(true).validate({
              category: EntryReasonCategory.FIELD_TRIP,
              payload: {
                from: 1,
                to: 2,
                teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
              } as FieldTripPayload,
            })
          ).toBe(false);
        });
      });
    });
  });
});
