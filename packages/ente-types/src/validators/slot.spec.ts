/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { expect } from "chai";
import { isValidSlot } from "./slot";

describe("isValidSlot", () => {
  it("returns true on valid slot", () => {
    expect(
      isValidSlot({
        from: 1,
        to: 2,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.true;
  });

  it("returns false on invalid mongoid", () => {
    expect(
      isValidSlot({
        from: 1,
        to: 2,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f98"
      })
    ).to.be.false;
  });

  it("returns false on twisted hours", () => {
    expect(
      isValidSlot({
        from: 2,
        to: 1,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidSlot({
        from: -1,
        to: 10,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidSlot({
        from: 13,
        to: 0,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.false;
  });
});
