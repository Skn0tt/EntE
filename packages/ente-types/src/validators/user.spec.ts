/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { expect } from "chai";
import {
  isValidRole,
  isValidEmail,
  isValidDisplayname,
  isValidUsername,
  isValidCreateUser,
  isValidUuid
} from "./user";
import { rolesArr, Roles } from "ente-types";

describe("isValidRole", () => {
  describe("when passed a role returns true", () => {
    rolesArr.forEach(r => {
      it(r, () => {
        expect(isValidRole(r)).to.be.true;
      });
    });
  });

  describe("when passed some other value returns false", () => {
    ["test", "falscherwert"].forEach(r => {
      it(r, () => {
        expect(isValidRole(r)).to.be.false;
      });
    });
  });
});

describe("isValidEmail", () => {
  describe("when passed a valid email returns true", () => {
    ["mymail@mail.de", "mail@mail.com", "MAIL@gmail.com"].forEach(r => {
      it(r, () => {
        expect(isValidEmail(r)).to.be.true;
      });
    });
  });

  describe("when passed some other value returns false", () => {
    ["test", "falscherwert", "mail@127.0.0.1"].forEach(r => {
      it(r, () => {
        expect(isValidEmail(r)).to.be.false;
      });
    });
  });
});

describe("isValidDisplayname", () => {
  describe("when passed a valid displayname returns true", () => {
    [
      "Hans im Glück",
      "Hans Zimmer",
      "Herr Schulleiter",
      "Herr Baron",
      "Hermann Hesse"
    ].forEach(r => {
      it(r, () => {
        expect(isValidDisplayname(r)).to.be.true;
      });
    });
  });

  describe("when passed some other value returns false", () => {
    ["zukurz", "Hermann", "!(/&/(?!=?%&/("].forEach(r => {
      it(r, () => {
        expect(isValidDisplayname(r)).to.be.false;
      });
    });
  });
});

describe("isValidUsername", () => {
  describe("when passed a valid username returns true", () => {
    ["skn0tt", "simonknott", "test", "humbug", "benutzername"].forEach(r => {
      it(r, () => {
        expect(isValidUsername(r)).to.be.true;
      });
    });
  });

  describe("when passed an invalid username returns false", () => {
    [
      "benutzer name",
      "simon Knott",
      "knott simon",
      "h&umbuzg",
      "!(/&/(?!=?%&/("
    ].forEach(r => {
      it(r, () => {
        expect(isValidUsername(r)).to.be.false;
      });
    });
  });
});

describe("isValidUuid", () => {
  it("returns true when passing valid id", () => {
    expect(isValidUuid("2e239ff6-9f40-48e6-9cec-cae9f983ee50")).to.be.true;
  });
  it("returns false when passing invalid id", () => {
    expect(isValidUuid("2e239ff6-9f40-48e6-9cec-cae9f983ee")).to.be.false;
  });
});

describe("isValidUser", () => {
  describe("when giving valid infos", () => {
    it("no password", () => {
      expect(
        isValidCreateUser({
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
        isValidCreateUser({
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
        isValidCreateUser({
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
        isValidCreateUser({
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
  });

  describe("when giving invalid infos", () => {
    it("invalid password", () => {
      expect(
        isValidCreateUser({
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
    it("invalid mongoid", () => {
      expect(
        isValidCreateUser({
          children: ["2e239ff6-9f40-48e6-9cec"],
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
        isValidCreateUser({
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
        isValidCreateUser({
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
        isValidCreateUser({
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
        isValidCreateUser({
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
        isValidCreateUser({
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
