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
          graduationYear: 2019
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
          graduationYear: 2019
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
          graduationYear: 2019
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
          birthday: undefined
        })
      ).to.be.true;
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
          graduationYear: 2019
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
          graduationYear: 2019
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
          birthday: "2000-01-01",
          graduationYear: 2019
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
          birthday: "2000-01-01",
          graduationYear: 2019
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
          birthday: "2000-01-01"
        })
      ).to.be.false;
    });
  });
});
