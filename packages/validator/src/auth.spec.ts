import { isValidPassword } from "./auth";
import { expect } from "chai";

describe("isValidPassword", () => {
  describe("when given a valid password", () => {
    [
      "1Bims!EinSPa$$wort",
      "Me!nMegaStarkesP4sswort",
      "lang$spassw0rt",
      "lang$sPassw0rt mit leerzeichen"
    ].forEach(p => {
      it(p, () => {
        expect(isValidPassword(p)).to.be.true;
      });
    });
  });

  describe("when given an invalid password", () => {
    ["kurzesPasswort", "1234", "AsslanIstMeinLieblingsHund", "kurz"].forEach(
      p => {
        it(p, () => {
          expect(isValidPassword(p)).to.be.false;
        });
      }
    );
  });
});
