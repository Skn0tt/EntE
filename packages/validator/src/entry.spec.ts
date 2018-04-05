import { expect } from "chai";
import { isTwoWeeksBeforeNow, isValidEntry } from "./entry";

const now = Date.now();

describe("isTwooWeeksBeforeNow", () => {
  it("returns true when passing date four weeks ago", () => {
    expect(isTwoWeeksBeforeNow(new Date(now - 4 * 7 * 24 * 60 * 60 * 1000))).to
      .be.true;
  });

  it("returns false when passing date one week ago", () => {
    expect(isTwoWeeksBeforeNow(new Date(now - 1 * 7 * 24 * 60 * 60 * 1000))).to
      .be.false;
  });

  it("returns false when passing date one week in the future", () => {
    expect(isTwoWeeksBeforeNow(new Date(now + 1 * 7 * 24 * 60 * 60 * 1000))).to
      .be.false;
  });
});

describe("isValidEntry", () => {
  describe("when passing valid entries", () => {
    it("returns true", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          forSchool: true,
          reason: "Schülerrat",
          slots: [
            {
              hour_from: 1,
              hour_to: 2,
              teacher: "5ac54ae00000000000000000"
            }
          ]
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          dateEnd: new Date(now + 2 * 24 * 60 * 60 * 1000),
          forSchool: true,
          reason: "Berlinreise",
          slots: []
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          dateEnd: new Date(now + 2 * 24 * 60 * 60 * 1000),
          forSchool: false,
          reason: "Krankheit",
          slots: []
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          forSchool: true,
          reason: "Zahnarzt",
          slots: [
            {
              hour_from: 1,
              hour_to: 2,
              teacher: "5ac54ae00000000000000000"
            }
          ]
        })
      ).to.be.true;
    });
  });

  describe("when passing invalid entries returns false", () => {
    it("missing slots", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          forSchool: false,
          slots: [],
          reason: "Hallo"
        })
      ).to.be.false;
    });

    it("Too much slots", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          dateEnd: new Date(now + 2 * 24 * 60 * 60 * 1000),
          forSchool: false,
          slots: [
            {
              hour_from: 2,
              hour_to: 5,
              teacher: "5ac54ae00000000000000000"
            }
          ]
        })
      ).to.be.false;
    });

    it("Slot invalid mongoid", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          forSchool: false,
          slots: [
            {
              hour_from: 2,
              hour_to: 5,
              teacher: "5ac54ae"
            }
          ]
        })
      ).to.be.false;
    });

    it("Slot invalid hours", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          forSchool: false,
          slots: [
            {
              hour_from: 5,
              hour_to: 2,
              teacher: "5ac54ae"
            }
          ]
        })
      ).to.be.false;
    });

    it("Dates not far enough apart", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          dateEnd: new Date(now + 0.5 * 24 * 60 * 60 * 1000),
          forSchool: false,
          slots: [
            {
              hour_from: 5,
              hour_to: 2,
              teacher: "5ac54ae"
            }
          ]
        })
      ).to.be.false;
    });
  });
});
