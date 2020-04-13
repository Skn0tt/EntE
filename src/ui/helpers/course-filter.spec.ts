import { CourseFilterSlot, doCourseSlotAndSlotOverlap } from "./course-filter";
import { Weekday } from "../reporting/reporting";
import { SlotN } from "../redux";

describe("doCourseSlotAndSlotOverlap", () => {
  const cSlot: CourseFilterSlot = { day: Weekday.MONDAY, hour: 2 };

  describe("when given overlapping values", () => {
    it("returns true", () => {
      expect(
        doCourseSlotAndSlotOverlap(
          SlotN({
            date: "2019-04-29",
            from: 1,
            to: 2,
          })
        )(cSlot)
      ).toBe(true);
    });
  });

  describe("when given non-overlapping values", () => {
    it("returns false", () => {
      expect(
        doCourseSlotAndSlotOverlap(
          SlotN({
            date: "2019-04-30",
            from: 1,
            to: 2,
          })
        )(cSlot)
      ).toBe(false);
    });
  });
});
