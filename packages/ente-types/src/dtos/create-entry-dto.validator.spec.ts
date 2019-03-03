import {
  is14DaysOrLessAgo,
  CreateEntryDtoValidator
} from "./create-entry-dto.validator";
import { dateToIsoString } from "../date-to-iso-string";
import { expect } from "chai";
import { subDays, addDays, addHours } from "date-fns";
import { EntryReasonCategory } from "./entry-reason.dto";

describe("is14DaysOrLessAgo", () => {
  it("exact 14 days ago", () => {
    const date = daysBeforeNow(14);
    const result = is14DaysOrLessAgo(dateToIsoString(date));
    expect(result).to.be.true;
  });

  it("less than 14 days ago", () => {
    const date = daysBeforeNow(13);
    const result = is14DaysOrLessAgo(dateToIsoString(date));
    expect(result).to.be.true;
  });

  it("more than 14 days ago", () => {
    const date = daysBeforeNow(15);
    const result = is14DaysOrLessAgo(dateToIsoString(date));
    expect(result).to.be.false;
  });
});

const now = Date.now();

const daysBeforeNow = (d: number) => dateToIsoString(subDays(Date.now(), d));

describe("CreateEntryDtoValidator", () => {
  describe("too long ago", () => {
    describe("when given a multi-day entry", () => {
      describe("with dateEnd too long ago", () => {
        const result = CreateEntryDtoValidator.validate({
          date: daysBeforeNow(30),
          dateEnd: daysBeforeNow(20),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 1,
              to: 2,
              date: daysBeforeNow(25),
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        });

        it("returns false", () => {
          expect(result).to.be.false;
        });
      });

      describe("with correct dateEnd", () => {
        const result = CreateEntryDtoValidator.validate({
          date: daysBeforeNow(30),
          dateEnd: daysBeforeNow(10),
          reason: {
            category: EntryReasonCategory.ILLNESS,
            payload: {}
          },
          slots: [
            {
              from: 1,
              to: 2,
              date: daysBeforeNow(20),
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
      describe("with date too long ago", () => {
        const result = CreateEntryDtoValidator.validate({
          date: daysBeforeNow(30),
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

        it("returns false", () => {
          expect(result).to.be.false;
        });
      });

      describe("with correct date", () => {
        const result = CreateEntryDtoValidator.validate({
          date: daysBeforeNow(10),
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
        CreateEntryDtoValidator.validate({
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
        CreateEntryDtoValidator.validate({
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
        CreateEntryDtoValidator.validate({
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
        CreateEntryDtoValidator.validate({
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
        CreateEntryDtoValidator.validate({
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
        CreateEntryDtoValidator.validate({
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
        CreateEntryDtoValidator.validate({
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
        CreateEntryDtoValidator.validate({
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
  });
});
