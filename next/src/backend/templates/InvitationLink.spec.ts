import { InvitationLink } from "./InvitationLink";
import { Roles, Languages } from "@@types";

describe("InvitationLink", () => {
  describe("en", () => {
    describe("Roles.Student", () => {
      it("renders an email that suits students", () => {
        const result = InvitationLink(
          "https://mylink.de",
          Roles.STUDENT,
          Languages.ENGLISH
        );
        expect(result.html).toContain("your missed lessons");
        expect(result.html).not.toContain("to administer");
        expect(result.html).not.toContain("to manage your students");
      });
    });

    describe("Roles.Manager", () => {
      it("renders an email that suits students", () => {
        const result = InvitationLink(
          "https://mylink.de",
          Roles.MANAGER,
          Languages.ENGLISH
        );
        expect(result.html).toContain("to manage your students");
        expect(result.html).not.toContain("your missed lessons");
      });
    });
  });

  describe("de", () => {
    describe("Roles.Student", () => {
      it("renders an email that suits students", () => {
        const result = InvitationLink(
          "https://mylink.de",
          Roles.STUDENT,
          Languages.GERMAN
        );
        expect(result.html).toContain("ihre Fehlstunden");
      });
    });

    describe("Roles.Manager", () => {
      it("renders an email that suits students", () => {
        const result = InvitationLink(
          "https://mylink.de",
          Roles.MANAGER,
          Languages.GERMAN
        );
        expect(result.html).toContain("ihrer Stufe zu verwalten");
      });
    });
  });
});
