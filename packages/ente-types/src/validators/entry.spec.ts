/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { expect } from "chai";
import { isOlderThanTwoWeeksBeforeNow, areApart } from "./entry";

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
