import { Reporting, Weekday } from "./reporting";
import { SlotN, EntryN } from "../redux";
import { expect } from "chai";

describe("Reporting", () => {
  describe("getLengthOfSlot", () => {
    it("returns correct time", () => {
      expect(
        Reporting.getLengthOfSlot(
          new SlotN({
            from: 1,
            to: 3
          })
        )
      ).to.equal(3);
    });
  });

  describe("hoursOfSlot", () => {
    it("returns correct hours", () => {
      const result = Reporting.hoursOfSlot(
        new SlotN({
          from: 1,
          to: 3
        })
      );
      expect(result).to.eql([1, 2, 3]);
    });
  });

  describe("weekdayOfDate", () => {
    describe("passing a monday", () => {
      it("returns Weekday.Monday", () => {
        expect(Reporting.weekdayOfDate("2019-01-21")).to.equal(Weekday.MONDAY);
      });
    });
    describe("passing a tuesday", () => {
      it("returns Weekday.Tuesday", () => {
        expect(Reporting.weekdayOfDate("2019-01-22")).to.equal(Weekday.TUESDAY);
      });
    });
    describe("passing a friday", () => {
      it("returns Weekday.Friday", () => {
        expect(Reporting.weekdayOfDate("2019-01-25")).to.equal(Weekday.FRIDAY);
      });
    });
    describe("passing a Sunday", () => {
      it("returns Weekday.Sunday", () => {
        expect(Reporting.weekdayOfDate("2019-01-27")).to.equal(Weekday.SUNDAY);
      });
    });
  });

  describe("weekdayOfSlot", () => {
    describe("when given a monday", () => {
      it("returns Weekday.Monday", () => {
        const weekday = Reporting.weekdayOfSlot(
          new SlotN({
            date: "2019-01-21"
          })
        );
        expect(weekday).to.equal(Weekday.MONDAY);
      });
    });
    describe("when given a sunday", () => {
      it("returns Weekday.Sunday", () => {
        const weekday = Reporting.weekdayOfSlot(
          new SlotN({
            date: "2019-01-20"
          })
        );
        expect(weekday).to.equal(Weekday.SUNDAY);
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
      const result = Reporting.hoursByWeekdayAndTime(input);
      expect(result).to.eql({
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
          Reporting.getLengthOfEntry(
            new EntryN({
              date: "2000-01-01"
            })
          )
        ).to.equal(1);
      });
    });

    describe("when given a multi-day entry", () => {
      it("returns its length", () => {
        expect(
          Reporting.getLengthOfEntry(
            new EntryN({
              date: "2000-01-01",
              dateEnd: "2000-01-03"
            })
          )
        ).to.equal(3);
      });
    });

    describe("when given a multi-day entry over a leap-day", () => {
      it("returns its correct length", () => {
        expect(
          Reporting.getLengthOfEntry(
            new EntryN({
              date: "2004-02-28",
              dateEnd: "2004-03-01"
            })
          )
        ).to.equal(3);
      });
    });
  });

  describe("countHours", () => {
    describe("when given three slots", () => {
      it("returns their total length", () => {
        expect(
          Reporting.countHours([
            new SlotN({
              from: 1,
              to: 2
            }),
            new SlotN({
              from: 3,
              to: 3
            }),
            new SlotN({
              from: 5,
              to: 6
            })
          ])
        ).to.equal(5);
      });
    });
  });

  describe("partitionSlots", () => {
    describe("when given three different types of slots", () => {
      it("partitions them correctly", () => {
        const { prefiled, created, signed } = Reporting.partitionSlots([
          new SlotN({
            isPrefiled: true
          }),
          new SlotN({
            signed: true
          }),
          new SlotN({
            signed: false
          })
        ]);

        expect(prefiled).to.be.length(1);
        expect(created).to.be.length(1);
        expect(signed).to.be.length(1);
      });
    });
  });

  describe("getSlotsOfStudent", () => {
    it("filters correctly", () => {
      const result = Reporting.getSlotsOfStudent("johndoe", [
        new SlotN({
          studentId: "tomtallis"
        }),
        new SlotN({
          studentId: "johndoe"
        })
      ]);
      expect(result).to.be.length(1);
      expect(result[0].get("studentId")).to.equal("johndoe");
    });
  });

  describe("countDays", () => {
    describe("when given two slots on same day", () => {
      it("returns 1", () => {
        expect(
          Reporting.countDays([
            new SlotN({
              date: "2020-01-01"
            }),
            new SlotN({
              date: "2020-01-01"
            })
          ])
        ).to.equal(1);
      });
    });
    describe("when given two slots on different days", () => {
      it("returns 2", () => {
        expect(
          Reporting.countDays([
            new SlotN({
              date: "2020-01-01"
            }),
            new SlotN({
              date: "2020-01-02"
            })
          ])
        ).to.equal(2);
      });
    });
  });
});
