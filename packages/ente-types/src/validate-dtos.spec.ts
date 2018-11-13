import {
  isValidCreateEntryDto,
  isValidCreateSlotDto,
  isValidCreateUserDto
} from "./validate-dtos";
import { expect } from "chai";
import { Roles } from "./roles";

const now = new Date();

describe("isValidCreateEntryDto", () => {
  describe("when passing valid entries", () => {
    it("returns true", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          forSchool: true,
          slots: [
            {
              date: new Date(now),
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });

    it("when passing slots", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          slots: [
            {
              date: new Date(now),
              from: 3,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ],
          forSchool: false
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          dateEnd: new Date(+now + 2 * 24 * 60 * 60 * 1000),
          forSchool: true,
          slots: [
            {
              date: new Date(now),
              from: 3,
              to: 4,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          dateEnd: new Date(+now + 2 * 24 * 60 * 60 * 1000),
          forSchool: false,
          slots: [
            {
              date: new Date(now),
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });

    it("returns true", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          forSchool: true,
          slots: [
            {
              date: new Date(now),
              from: 1,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.true;
    });
  });

  describe("when passing invalid entries returns false", () => {
    it("Slot invalid teacher id", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          forSchool: false,
          slots: [
            {
              date: new Date(now),
              from: 2,
              to: 5,
              teacherId: "2e239ff6-9f40-48e6-9cec"
            }
          ]
        })
      ).to.be.false;
    });

    it("Slot invalid hours", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          forSchool: false,
          slots: [
            {
              date: new Date(now),
              from: 5,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.false;
    });

    it("Dates not far enough apart", () => {
      expect(
        isValidCreateEntryDto({
          date: new Date(now),
          dateEnd: new Date(+now + 0.5 * 24 * 60 * 60 * 1000),
          forSchool: false,
          slots: [
            {
              date: new Date(now),
              from: 5,
              to: 2,
              teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50"
            }
          ]
        })
      ).to.be.false;
    });
  });
});

describe("isValidCreateSlotDto", () => {
  it("returns true on valid slot", () => {
    expect(
      isValidCreateSlotDto({
        from: 1,
        to: 2,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: now
      })
    ).to.be.true;
  });

  it("returns false on invalid mongoid", () => {
    expect(
      isValidCreateSlotDto({
        from: 1,
        to: 2,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f98",
        date: now
      })
    ).to.be.false;
  });

  it("returns false on twisted hours", () => {
    expect(
      isValidCreateSlotDto({
        from: 2,
        to: 1,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: now
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidCreateSlotDto({
        from: -1,
        to: 10,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: now
      })
    ).to.be.false;
  });

  it("returns false on invalid hours", () => {
    expect(
      isValidCreateSlotDto({
        from: 13,
        to: 0,
        teacherId: "2e239ff6-9f40-48e6-9cec-cae9f983ee50",
        date: now
      })
    ).to.be.false;
  });
});

describe("isValidUser", () => {
  describe("when giving valid infos", () => {
    it("no password", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.STUDENT,
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: false,
          graduationYear: 2019
        })
      ).to.be.true;
    });
    it("returns true", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: false,
          graduationYear: 2019
        })
      ).to.be.true;
    });
    it("regular student", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: true,
          graduationYear: 2019
        })
      ).to.be.true;
    });
    it("with children", () => {
      expect(
        isValidCreateUserDto({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: false
        })
      ).to.be.true;
    });

    it("umlauts in username", () => {
      expect(
        isValidCreateUserDto({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdult: false
        })
      ).to.be.true;
    });

    it("umlauts in displayname", () => {
      expect(
        isValidCreateUserDto({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Männ",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdult: false
        })
      ).to.be.true;
    });

    it("Special Chars in displayname", () => {
      expect(
        isValidCreateUserDto({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr-Mann",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdult: false
        })
      ).to.be.true;
    });

    it("Special Chars in displayname", () => {
      expect(
        isValidCreateUserDto({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr. Mann",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdult: false
        })
      ).to.be.true;
    });
  });

  describe("when giving invalid infos", () => {
    it("invalid password", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.STUDENT,
          password: "zukurz",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: false,
          graduationYear: 2019
        })
      ).to.be.false;
    });
    it("invalid uuid/username", () => {
      expect(
        isValidCreateUserDto({
          children: ["2e239ff6-9f40-48e6-9cec!"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: false
        })
      ).to.be.false;
    });
    it("student with children", () => {
      expect(
        isValidCreateUserDto({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: false,
          graduationYear: 2019
        })
      ).to.be.false;
    });
    it("student without year", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdult: false
        })
      ).to.be.false;
    });
    it("returns false", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herrmann.de",
          username: "herrmann",
          isAdult: false,
          graduationYear: 2019
        })
      ).to.be.false;
    });
    it("invalid username", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herr mann",
          isAdult: false,
          graduationYear: 2019
        })
      ).to.be.false;
    });
    it("parent cannot be adult", () => {
      expect(
        isValidCreateUserDto({
          children: [],
          role: Roles.PARENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herr mann",
          isAdult: true
        })
      ).to.be.false;
    });
  });
});
