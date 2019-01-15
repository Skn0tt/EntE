import { EntryReasonCategory, EntryReasonDto } from "./entry-reason.dto";
import { EntryReasonDtoValidator } from "./entry-reason-dto.validator";

describe("EntryReasonValidator", () => {
  describe(EntryReasonCategory.COMPETITION, () => {
    describe("when given valid DTO", () => {
      const dto = (): EntryReasonDto => ({
        category: EntryReasonCategory.OTHER,
        payload: { description: "test" }
      });

      it("returns true", () => {
        expect(EntryReasonDtoValidator.validate(dto())).toBe(true);
      });
    });

    describe("when given not given needed fields", () => {
      const dto = (): EntryReasonDto => ({
        category: EntryReasonCategory.OTHER,
        payload: { from: 0, to: 1, class: "test" }
      });

      it("returns false", () => {
        expect(EntryReasonDtoValidator.validate(dto())).toBe(false);
      });
    });
  });

  // other categories work in the same schema
});
