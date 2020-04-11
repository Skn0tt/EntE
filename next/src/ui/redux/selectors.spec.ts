import { transferReviewedRecords, getEntry } from "./selectors";
import { AppState, EntryN } from "./types";
import { Set, Map } from "immutable";

describe("transferReviewedRecords", () => {
  describe("given valid id", () => {
    it("tranfers it to isInReviewedRecords prop", () => {
      const newState = transferReviewedRecords(
        AppState({
          reviewedRecords: Set(["abcde", "cdefg"]),
          entriesMap: Map({
            abcde: EntryN({}),
          }),
        })
      );

      const entry = getEntry("abcde")(newState).some();
      expect(entry.get("isInReviewedRecords")).toBe(true);
    });
  });
  describe("given invalid id", () => {
    it("does not change a thing", () => {
      const oldState = AppState({
        reviewedRecords: Set(["abcde", "cdefg"]),
        entriesMap: Map({
          unknown_id: EntryN({}),
        }),
      });
      const newState = transferReviewedRecords(oldState);

      expect(oldState.toJS()).toEqual(newState.toJS());

      expect(oldState.equals(newState)).toBe(true);
    });
  });
});
