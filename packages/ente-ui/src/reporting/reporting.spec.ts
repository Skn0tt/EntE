import {
  hoursOfSlot,
  weekdayOfSlot,
  hoursByWeekdayAndTime,
  getLengthOfEntry,
  Weekday,
  Reporting
} from "./reporting";
import { SlotN, EntryN } from "../redux";
import { Map } from "immutable";

describe("hoursOfSlot", () => {
  it("returns correct hours", () => {
    const result = hoursOfSlot(
      new SlotN({
        from: 1,
        to: 3
      })
    );
    expect(result).toEqual([1, 2, 3]);
  });
});

describe("weekdayOfSlot", () => {
  describe("when given a monday", () => {
    it("returns Weekday.Monday", () => {
      const weekday = weekdayOfSlot(
        new SlotN({
          date: "2019-01-21"
        })
      );
      expect(weekday).toBe(Weekday.MONDAY);
    });
  });
});

describe("hoursByWeekdayAndTime", () => {
  it("returns correct result", () => {
    const input = [
      new SlotN({
        date: "2019-01-21",
        from: 2,
        to: 3
      }),
      new SlotN({
        date: "2019-01-28",
        from: 3,
        to: 4
      }),
      new SlotN({
        date: "2019-01-29",
        from: 1,
        to: 1
      })
    ];
    const result = hoursByWeekdayAndTime(input);
    expect(result).toEqual({
      [Weekday.MONDAY]: {
        2: 1,
        3: 2,
        4: 1
      },
      [Weekday.TUESDAY]: {
        1: 1
      }
    });
  });
});

describe("getLengthOfEntry", () => {
  describe("when given a single-day entry", () => {
    it("returns 1", () => {
      expect(
        getLengthOfEntry(
          new EntryN({
            date: "2000-01-01"
          })
        )
      ).toBe(1);
    });
  });

  describe("when given a multi-day entry", () => {
    it("returns its length", () => {
      expect(
        getLengthOfEntry(
          new EntryN({
            date: "2000-01-01",
            dateEnd: "2000-01-03"
          })
        )
      ).toBe(3);
    });
  });

  describe("when given a multi-day entry over a leap-day", () => {
    it("returns its correct length", () => {
      expect(
        getLengthOfEntry(
          new EntryN({
            date: "2004-02-28",
            dateEnd: "2004-03-01"
          })
        )
      ).toBe(3);
    });
  });
});

describe("summarize", () => {
  describe("when given two entries with different date", () => {
    it("counts them as two absent days", () => {
      const entries = [
        new EntryN({
          date: "2000-01-01",
          slotIds: ["a"]
        }),
        new EntryN({
          date: "2000-01-02",
          slotIds: ["b"]
        })
      ];

      const slots = Map({
        a: new SlotN({
          date: "2000-01-01",
          from: 0,
          to: 0
        }),
        b: new SlotN({
          date: "2000-01-02",
          from: 1,
          to: 1
        })
      });

      const result = Reporting.summarize(entries, slots);
      expect(result.absentDays.total).toBe(2);
      expect(result.absentSlots.total).toBe(2);
    });
  });

  describe("when given two entries with same date", () => {
    it("counts them as one absent day", () => {
      const entries = [
        new EntryN({
          date: "2000-01-01",
          slotIds: ["a"]
        }),
        new EntryN({
          date: "2000-01-01",
          slotIds: ["b"]
        })
      ];

      const slots = Map({
        a: new SlotN({
          date: "2000-01-01",
          from: 0,
          to: 0
        }),
        b: new SlotN({
          date: "2000-01-01",
          from: 1,
          to: 1
        })
      });

      const result = Reporting.summarize(entries, slots);
      expect(result.absentDays.total).toBe(1);
      expect(result.absentSlots.total).toBe(2);
    });
  });
});
