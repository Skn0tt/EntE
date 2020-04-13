import { fillRange } from "./fillRange";

describe("fillRange", () => {
  describe("when given 1 and 2", () => {
    it("returns [1, 2]", () => {
      expect(fillRange(1, 2)).toEqual([1, 2]);
    });
  });

  describe("when given 2 and 2", () => {
    it("returns [2]", () => {
      expect(fillRange(2, 2)).toEqual([2]);
    });
  });

  describe("when given 2 and 1", () => {
    it("returns []", () => {
      expect(fillRange(2, 1)).toEqual([]);
    });
  });
});
