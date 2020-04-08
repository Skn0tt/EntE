import { Reporting } from "./reporting";
import { SlotN } from "../redux";
import { expect } from "chai";

describe("Reporting", () => {
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
