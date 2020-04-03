import { CreateEntryDtoValidator } from "./create-entry-dto.validator";
import { dateToIsoString } from "../date-to-iso-string";
import { expect } from "chai";
import { subDays, addDays, addHours } from "date-fns";
import { EntryReasonCategory } from "./entry-reason.dto";

const now = Date.now();

const daysBeforeNow = (d: number) => subDays(Date.now(), d);

describe("CreateEntryDtoValidator", () => {
  const validator = CreateEntryDtoValidator;
  describe("too long ago", () => {
    describe("when given a multi-day entry", () => {
      describe("with dateEnd over deadline", () => {
        const result = validator.validate({
          date: dateToIsoString(daysBeforeNow(30)),
          dateEnd: dateToIsoString(daysBeforeNow(20)),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 1,
              to: 2,
              date: dateToIsoString(daysBeforeNow(25)),
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        });

        it("returns true, because deadlines are weak now", () => {
          expect(result).to.be.true;
        });
      });

      describe("with correct dateEnd", () => {
        const result = validator.validate({
          date: dateToIsoString(daysBeforeNow(30)),
          dateEnd: dateToIsoString(daysBeforeNow(10)),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 1,
              to: 2,
              date: dateToIsoString(daysBeforeNow(20)),
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        });

        it("returns true", () => {
          expect(result).to.be.true;
        });
      });
    });

    describe("when given a single-day entry", () => {
      describe("with date over deadline", () => {
        const result = validator.validate({
          date: dateToIsoString(daysBeforeNow(30)),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        });

        it("returns true", () => {
          expect(result).to.be.true;
        });
      });

      describe("with correct date", () => {
        const result = validator.validate({
          date: dateToIsoString(daysBeforeNow(10)),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        });
        it("returns true", () => {
          expect(result).to.be.true;
        });
      });
    });
  });

  describe("when passing valid entries", () => {
    it("returns true", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          reason: {
            category: EntryReasonCategory.OTHER_EDUCATIONAL,
            payload: { description: "test" }
          },
          slots: [
            {
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });

    it("when passing slots", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 3,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          dateEnd: dateToIsoString(addDays(now, 2)),
          reason: {
            category: EntryReasonCategory.OTHER_EDUCATIONAL,
            payload: { description: "test" }
          },
          slots: [
            {
              date: dateToIsoString(now),
              from: 3,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          dateEnd: dateToIsoString(addDays(now, 2)),
          reason: {
            category: EntryReasonCategory.OTHER_EDUCATIONAL,
            payload: { description: "my_random_reason" }
          },
          slots: [
            {
              date: dateToIsoString(now),
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          reason: {
            category: EntryReasonCategory.OTHER_EDUCATIONAL,
            payload: { description: "test" }
          },
          slots: [
            {
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });
  });

  describe("when passing invalid entries returns false", () => {
    it("Slot invalid teacher id", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 2,
              to: 5,
              teacherId: "2e239ff6-9f40-48e6-9cec"
            }
          ]
        })
      ).to.be.false;
    });

    it("Slot invalid hours", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 5,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.false;
    });

    it("Dates not far enough apart", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          dateEnd: dateToIsoString(addHours(now, 12)),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 5,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.false;
    });

    it("does not receive a reason", () => {
      expect(
        validator.validate({
          date: dateToIsoString(now),
          reason: undefined as any,
          slots: [
            {
              from: 3,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.false;
    });
  });
});
