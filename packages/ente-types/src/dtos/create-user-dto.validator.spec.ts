import { CreateUserDtoValidator } from "./create-user-dto.validator";
import { Roles } from "../roles";
import { expect } from "chai";

describe("CreateUserDtoValidator", () => {
  describe("when giving valid infos", () => {
    it("no password", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.STUDENT,
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          birthday: "2000-01-01",
          isAdmin: false,
          class: "2019"
        })
      ).to.be.true;
    });
    it("returns true", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          birthday: "2000-01-01",
          isAdmin: false,
          class: "2019"
        })
      ).to.be.true;
    });
    it("regular student", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          birthday: "2000-01-01",
          isAdmin: false,
          class: "2019"
        })
      ).to.be.true;
    });
    it("with children", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdmin: false,
          birthday: undefined
        })
      ).to.be.true;
    });

    it("umlauts in username", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdmin: false,
          birthday: undefined
        })
      ).to.be.true;
    });

    it("umlauts in displayname", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Männ",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdmin: false,
          birthday: undefined
        })
      ).to.be.true;
    });

    it("Special Chars in displayname", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr-Mann",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdmin: false,
          birthday: undefined
        })
      ).to.be.true;
    });

    it("Special Chars in displayname", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr. Mann",
          email: "herr@mann.de",
          username: "herrmänn",
          isAdmin: false,
          birthday: undefined
        })
      ).to.be.true;
    });
  });

  describe("when passing a class to a", () => {
    describe("student", () => {
      it("returns true", () => {
        expect(
          CreateUserDtoValidator.validate({
            children: [],
            role: Roles.STUDENT,
            displayname: "Herr Mann",
            email: "herr@mann.de",
            username: "herrmann",
            birthday: "2000-01-01",
            isAdmin: false,
            class: "2019"
          })
        ).to.be.true;
      });
    });
    describe("manager", () => {
      it("returns true", () => {
        expect(
          CreateUserDtoValidator.validate({
            children: [],
            role: Roles.MANAGER,
            displayname: "Herr Mann",
            email: "herr@mann.de",
            username: "herrmann",
            isAdmin: false,
            class: "2019"
          })
        ).to.be.true;
      });
    });
    describe("parent", () => {
      it("returns false", () => {
        expect(
          CreateUserDtoValidator.validate({
            children: [],
            role: Roles.PARENT,
            displayname: "Herr Mann",
            email: "herr@mann.de",
            username: "herrmann",
            isAdmin: false,
            class: "2019"
          })
        ).to.be.false;
      });
    });
    describe("teacher", () => {
      it("returns false", () => {
        expect(
          CreateUserDtoValidator.validate({
            children: [],
            role: Roles.TEACHER,
            displayname: "Herr Mann",
            email: "herr@mann.de",
            username: "herrmann",
            isAdmin: false,
            class: "2019"
          })
        ).to.be.false;
      });
    });
  });

  describe("when passing a birthday to a non-student", () => {
    it("returns false", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.TEACHER,
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdmin: false,
          birthday: "2000-01-01"
        })
      ).to.be.false;
    });
  });

  describe("when passing children to a non-parent", () => {
    it("returns false", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["mychild"],
          role: Roles.TEACHER,
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdmin: false,
          birthday: "2000-01-01"
        })
      ).to.be.false;
    });
  });

  describe("when giving invalid infos", () => {
    it("invalid password", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.STUDENT,
          password: "zukurz",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          birthday: undefined,
          isAdmin: false,
          class: "2019"
        })
      ).to.be.false;
    });
    it("invalid uuid/username", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["2e239ff6-9f40-48e6-9cec!"],
          role: Roles.PARENT,
          password: "m!e1passwofrt",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdmin: false,
          birthday: undefined
        })
      ).to.be.false;
    });
    it("student with children", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: ["2e239ff6-9f40-48e6-9cec-cae9f983ee50"],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          birthday: "2000-01-01",
          isAdmin: false,
          class: "2019"
        })
      ).to.be.false;
    });
    it("student without year", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herrmann",
          isAdmin: false,
          birthday: "2000-01-01"
        })
      ).to.be.false;
    });
    it("returns false", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herrmann.de",
          username: "herrmann",
          isAdmin: false,
          birthday: "2000-01-01",
          class: "2019"
        })
      ).to.be.false;
    });
    it("invalid username", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.STUDENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herr mann",
          isAdmin: false,
          birthday: "2000-01-01",
          class: "2019"
        })
      ).to.be.false;
    });
    it("parent cannot have birthday", () => {
      expect(
        CreateUserDtoValidator.validate({
          children: [],
          role: Roles.PARENT,
          password: "m!e1passwort",
          displayname: "Herr Mann",
          email: "herr@mann.de",
          username: "herr mann",
          isAdmin: false,
          birthday: "2000-01-01"
        })
      ).to.be.false;
    });
  });
});
