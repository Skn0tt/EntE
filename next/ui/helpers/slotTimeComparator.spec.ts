import { SlotN } from "../redux";
import { slotTimeComparator } from "./slot-time-comparator";

describe("slotTimeComparator", () => {
  const a = SlotN({
    date: "2019-01-01",
    from: 1,
    to: 2
  });
  const b = SlotN({
    date: "2019-01-01",
    from: 3,
    to: 4
  });
  const c = SlotN({
    date: "2019-01-02",
    from: 1,
    to: 2
  });

  it("sorts naturally", () => {
    expect([b, a, c].sort(slotTimeComparator)).toEqual([a, b, c]);
  });

  describe("when given the same slot", () => {
    it("returns 0", () => {
      expect(slotTimeComparator(a, a)).toBe(0);
    });
  });
});
