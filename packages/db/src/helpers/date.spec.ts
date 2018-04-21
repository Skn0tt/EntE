import * as mockdate from "mockdate";
import { lastAugustFirst } from "./date";

describe("lastAugustFirst", () => {
  describe("when after August", () => {
    // Date: Oct 1st, 2017
    beforeEach(() => mockdate.set("10/1/2017"));
    afterEach(mockdate.reset);

    it("returns august of this year", () => {
      const res = lastAugustFirst();
      expect(res.getFullYear()).toBe(2017);
      expect(res.getMonth()).toBe(7);
      expect(res.getDate()).toBe(1);
    });
  });
  describe("on August 1st", () => {
    // Date: Aug 1st, 2017
    beforeEach(() => mockdate.set("08/1/2017"));
    afterEach(mockdate.reset);

    it("returns august of this year", () => {
      const res = lastAugustFirst();
      expect(res.getFullYear()).toBe(2017);
      expect(res.getMonth()).toBe(7);
      expect(res.getDate()).toBe(1);
    });
  });
  describe("when before August", () => {
    // Date: May 2nd, 2017
    beforeEach(() => mockdate.set("05/02/2017"));
    afterEach(mockdate.reset);

    it("returns august of last year", () => {
      const res = lastAugustFirst();
      expect(res.getFullYear()).toBe(2016);
      expect(res.getMonth()).toBe(7);
      expect(res.getDate()).toBe(1);
    });
  });
});
