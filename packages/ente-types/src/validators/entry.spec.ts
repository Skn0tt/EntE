/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { expect } from "chai";
import { isOlderThanTwoWeeksBeforeNow, isValidEntry, areApart } from "./entry";

const now = Date.now();

describe("isTwooWeeksBeforeNow", () => {
  it("returns true when passing date four weeks ago", () => {
    expect(
      isOlderThanTwoWeeksBeforeNow(new Date(now - 4 * 7 * 24 * 60 * 60 * 1000))
    ).to.be.true;
  });

  it("returns false when passing date one week ago", () => {
    expect(
      isOlderThanTwoWeeksBeforeNow(new Date(now - 1 * 7 * 24 * 60 * 60 * 1000))
    ).to.be.false;
  });

  it("returns false when passing date one week in the future", () => {
    expect(
      isOlderThanTwoWeeksBeforeNow(new Date(now + 1 * 7 * 24 * 60 * 60 * 1000))
    ).to.be.false;
  });
});

describe("areApart", () => {
  const test = areApart(1 * 24 * 60 * 60 * 1000);

  describe("when given right way around", () => {
    it("returns true on days one day apart", () => {
      expect(test(new Date(now), new Date(now + 1 * 24 * 60 * 60 * 1000))).to.be
        .true;
    });
    it("returns true on days half a day apart", () => {
      expect(test(new Date(now), new Date(now + 0.5 * 24 * 60 * 60 * 1000))).to
        .be.false;
    });
  });

  describe("when given wrong way around", () => {
    it("returns false", () => {
      expect(test(new Date(now + 1 * 24 * 60 * 60 * 1000), new Date(now))).to.be
        .false;
    });
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
        isValidEntry({
          date: new Date(now),
          slots: [
            {
              from: 3,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ],
          forSchool: false
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
              from: 2,
              to: 5,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.false;
    });

    it("Slot invalid uuid", () => {
      expect(
        isValidEntry({
          date: new Date(now),
          forSchool: false,
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
        isValidEntry({
          date: new Date(now),
          forSchool: false,
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
        isValidEntry({
          date: new Date(now),
          dateEnd: new Date(now + 0.5 * 24 * 60 * 60 * 1000),
          forSchool: false,
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
