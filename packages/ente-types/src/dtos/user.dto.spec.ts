import { UserDto, userIsAdult } from "./user.dto";
import { Roles } from "../roles";
import { subYears, addYears } from "date-fns";
import { dateToIsoString } from "../date-to-iso-string";
import { Languages } from "../languages";

const baseUser = {
  id: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
  language: Languages.ENGLISH,
  username: "max",
  children: [],
  displayname: "Max",
  role: Roles.STUDENT,
  email: "max@mustermann.de",
  isAdmin: false
};

describe("UserDto", () => {
  describe("userIsAdult", () => {
    const now = +new Date("2018-02-01Z");
    const eighteenYearsAgo = subYears(now, 18);

    describe("given an adult user", () => {
      const adultUser: UserDto = {
        ...baseUser,
        birthday: dateToIsoString(subYears(eighteenYearsAgo, 1))
      };

      it("returns true", () => {
        expect(userIsAdult(adultUser, now)).toBe(true);
      });
    });

    describe("given a minor user", () => {
      const minorUser: UserDto = {
        ...baseUser,
        birthday: dateToIsoString(addYears(eighteenYearsAgo, 1))
      };

      it("returns false", () => {
        expect(userIsAdult(minorUser, now)).toBe(false);
      });
    });

    describe("given a partying user", () => {
      const partyingUser: UserDto = {
        ...baseUser,
        birthday: dateToIsoString(eighteenYearsAgo)
      };
      it("returns true", () => {
        expect(userIsAdult(partyingUser, now)).toBe(true);
      });
    });

    describe("given a student without a birthday", () => {
      const wrongUser: UserDto = {
        ...baseUser,
        birthday: undefined
      };
      it("throws", () => {
        expect(() => userIsAdult(wrongUser, now)).toThrow();
      });
    });

    describe("given not a student", () => {
      const notAStudent: UserDto = {
        ...baseUser,
        role: Roles.PARENT
      };
      it("returns false", () => {
        expect(userIsAdult(notAStudent, now)).toBe(false);
      });
    });
  });
});
