import { expect } from "chai";
import { isValidSlot } from "./slot";

describe("isValidSlot", () => {
  it("returns true on valid slot", () => {
    expect(
      isValidSlot({
        hour_from: 1,
        hour_to: 2,
        teacher: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.true;
  });

  it("returns false on invalid mongoid", () => {
    expect(
      isValidSlot({
        hour_from: 1,
        hour_to: 2,
        teacher: "2e239ff6-9f40-48e6-9cec-cae9f98"
      })
    ).to.be.false;
  });

  it("returns false on twisted hours", () => {
    expect(
      isValidSlot({
        hour_from: 2,
        hour_to: 1,
        teacher: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidSlot({
        hour_from: -1,
        hour_to: 10,
        teacher: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidSlot({
        hour_from: 13,
        hour_to: 0,
        teacher: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
      })
    ).to.be.false;
  });
});
