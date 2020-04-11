import { CreateSlotDtoValidator } from "./create-slot-dto.validator";
import { dateToIsoString } from "../date-to-iso-string";
import { expect } from "chai";

const now = Date.now();

describe("CreateSlotDtoValidator", () => {
  it("returns true on valid slot", () => {
    expect(
      CreateSlotDtoValidator.validate({
        from: 1,
        to: 2,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: dateToIsoString(now),
      })
    ).to.be.true;
  });

  it("returns false on invalid mongoid", () => {
    expect(
      CreateSlotDtoValidator.validate({
        from: 1,
        to: 2,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f98",
        date: dateToIsoString(now),
      })
    ).to.be.false;
  });

  it("returns false on twisted hours", () => {
    expect(
      CreateSlotDtoValidator.validate({
        from: 2,
        to: 1,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: dateToIsoString(now),
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      CreateSlotDtoValidator.validate({
        from: -1,
        to: 10,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: dateToIsoString(now),
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      CreateSlotDtoValidator.validate({
        from: 13,
        to: 0,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: dateToIsoString(now),
      })
    ).to.be.false;
  });
});
