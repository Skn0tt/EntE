/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  isBetween,
  containsNumbers,
  containsSpecialChars,
  not,
  containsSpaces,
  containsSpecialCharsAll
} from "./shared";
import { expect } from "chai";

describe("isBetween", () => {
  describe("when given 5 and 8", () => {
    const between = isBetween(5, 8);

    it("returns false on 4", () => {
      expect(between(4)).to.be.false;
    });

    it("returns true on 5", () => {
      expect(between(5)).to.be.true;
    });

    it("returns true on 7", () => {
      expect(between(7)).to.be.true;
    });

    it("returns false on 8", () => {
      expect(between(8)).to.be.false;
    });
  });

  describe("when given 6 and 3", () => {
    const between = isBetween(6, 3);

    it("always returns false", () => {
      for (const x of [1, 4, 6, 7, 9]) {
        expect(between(x)).to.be.false;
      }
    });
  });
});

describe("containsNumbers", () => {
  describe("when given a string containing numbers returns true", () => {
    ["5", "h4ll0", "t3st", "8908"].forEach(v => {
      it(v, () => {
        expect(containsNumbers(v)).to.be.true;
      });
    });
  });

  describe("when given a string not containing numbers returns false", () => {
    ["fünf", "test", "hallo"].forEach(v => {
      it(v, () => {
        expect(containsNumbers(v)).to.be.false;
      });
    });
  });
});

describe("containsSpecialCharsAll", () => {
  describe("when given a string containing special chars returns true", () => {
    ["!", "h!ll0", "t%st", "%&/"].forEach(v => {
      it(v, () => {
        expect(containsSpecialCharsAll(v)).to.be.true;
      });
    });
  });

  describe("when given a string not containing special chars returns false", () => {
    ["fünf", "test", "hallo", "l  rzeichen"].forEach(v => {
      it(v, () => {
        expect(containsSpecialCharsAll(v)).to.be.false;
      });
    });
  });
});

describe("containsSpaces", () => {
  describe("when given a string containing spaces returns true", () => {
    [" ", "h ll0", "t st", "herr mann", "l  rzeichen"].forEach(v => {
      it(v, () => {
        expect(containsSpaces(v)).to.be.true;
      });
    });
  });

  describe("when given a string not containing spaces returns false", () => {
    ["", "test", "hallo"].forEach(v => {
      it(v, () => {
        expect(containsSpaces(v)).to.be.false;
      });
    });
  });
});

describe("not", () => {
  it("takes a function and returns it's negated result", () => {
    expect(not(b => true)(1)).to.be.false;
    expect(not(b => false)(1)).to.be.true;
  });
});
