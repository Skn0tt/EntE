import { expect } from "chai";
import { CreatePrefiledSlotDtoValidator } from "./create-prefiled-slots-dto.validator";

describe("CreatePrefiledSlotsDtoValidator", () => {
  it("returns false when times are flipped", () => {
    expect(
      CreatePrefiledSlotDtoValidator.validate({
        date: "2020-04-02",
        hour_from: 10,
        hour_to: 9,
        studentIds: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
      })
    ).to.be.false;
  });

  it("returns false when studentIds is empty", () => {
    expect(
      CreatePrefiledSlotDtoValidator.validate({
        date: "2020-04-02",
        hour_from: 1,
        hour_to: 2,
        studentIds: [],
      })
    ).to.be.false;
  });
});
