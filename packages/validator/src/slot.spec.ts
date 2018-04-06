import { expect } from "chai";
import { isValidSlot } from "./slot";

describe("isValidSlot", () => {
  it("returns true on valid slot", () => {
    expect(
      isValidSlot({
        hour_from: 1,
        hour_to: 2,
        teacher: "5ac54ae00000000000000000"
      })
    ).to.be.true;
  });

  it("returns false on invalid mongoid", () => {
    expect(
      isValidSlot({
        hour_from: 1,
        hour_to: 2,
        teacher: "5ac54ae00000000000000"
      })
    ).to.be.false;
  });

  it("returns false on twisted hours", () => {
    expect(
      isValidSlot({
        hour_from: 2,
        hour_to: 1,
        teacher: "5ac54ae00000000000000000"
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidSlot({
        hour_from: -1,
        hour_to: 10,
        teacher: "5ac54ae00000000000000000"
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidSlot({
        hour_from: 13,
        hour_to: 0,
        teacher: "5ac54ae00000000000000000"
      })
    ).to.be.false;
  });
});
