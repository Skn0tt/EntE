import { isBetweenDates } from "./is-between-dates";

describe("isBetweenDates", () => {
  describe("with distinct dates", () => {
    const tester = isBetweenDates("2000-01-01", "2000-02-01");

    describe("when passed bigger date", () => {
      it("returns false", () => {
        expect(tester("2000-02-02")).toBe(false);
      });
    });

    describe("when passed smaller date", () => {
      it("returns false", () => {
        expect(tester("1999-02-02")).toBe(false);
      });
    });

    describe("when passed valid date", () => {
      it("returns true", () => {
        expect(tester("2000-01-10")).toBe(true);
      });
    });

    describe("when passed start of interval", () => {
      it("returns true", () => {
        expect(tester("2000-01-01")).toBe(true);
      });
    });

    describe("when passed end of interval", () => {
      it("returns true", () => {
        expect(tester("2000-02-01")).toBe(true);
      });
    });
  });

  describe("with same date", () => {
    const tester = isBetweenDates("2000-01-01", "2000-01-01");

    describe("when passed bigger date", () => {
      it("returns false", () => {
        expect(tester("2000-02-02")).toBe(false);
      });
    });

    describe("when passed smaller date", () => {
      it("returns false", () => {
        expect(tester("1999-02-02")).toBe(false);
      });
    });

    describe("when passed valid date", () => {
      it("returns true", () => {
        expect(tester("2000-01-01")).toBe(true);
      });
    });
  });
});
