import {
  sanitizeName,
  deriveUsername,
  parseWithValidation
} from "./schild.parser";
import * as _ from "lodash";
import { Roles, CreateUserDto } from "ente-types";

describe("sanitizeName", () => {
  test.each`
    input                      | expected
    ${"Marie Kahle"}           | ${"marie_kahle"}
    ${"Marie Eva Lotta Kahle"} | ${"marie_eva_lotta_kahle"}
  `("sanitizeName($input) === $expected", ({ input, expected }) => {
    expect(sanitizeName(input)).toBe(expected);
  });
});

describe("deriveUsername", () => {
  test.each`
    first                      | last         | expected
    ${"Marie Kahle"}           | ${"Kolbach"} | ${"marie_kahle.kolbach"}
    ${"Marie Eva Lotta Kahle"} | ${"Kolbach"} | ${"marie_eva_lotta_kahle.kolbach"}
  `(
    "deriveUsername($first, $last) === $expected",
    ({ first, last, expected }) => {
      expect(deriveUsername(first, last)).toBe(expected);
    }
  );
});

describe("parseWithValidation", () => {
  describe("when there are no existing students", () => {
    const existingStudentUsernames: string[] = [];

    describe("given students with two parents", () => {
      const input = `
"Vorname";"Nachname";"vorauss. Abschlussdatum";"Jahrgang";"Erzieher 1: Anrede";"Erzieher 1: Vorname";"Erzieher 1: Nachname";"Erzieher 2: Anrede";"Erzieher 2: Vorname";"Erzieher 2: Nachname";"Erzieher: E-Mail";"E-Mail (privat)";"Geburtsdatum"
"Anton";"Krüger";31.07.2022;"EF";"Frau";"Anna";"Krüger";"Herr";"Thomas";"Krüger";"familie@krueger.de";"anton@krueger.de";01.01.2004
      `.trim();

      const result = parseWithValidation(input, existingStudentUsernames);

      it("returns valid students", () => {
        expect(result.isSuccess()).toBe(true);
      });

      it("returns students and one parent per student (not two, because there is only one email address", () => {
        const { "anton.krüger": anton, krüger: krüger } = _.keyBy(
          result.success(),
          u => u.username
        );

        expect(anton).toEqual({
          birthday: "2004-01-01",
          username: "anton.krüger",
          children: [],
          displayname: "Anton Krüger",
          email: "anton@krueger.de",
          graduationYear: 2022,
          role: Roles.STUDENT
        } as CreateUserDto);
        expect(krüger).toEqual({
          username: "krüger",
          children: ["anton.krüger"],
          displayname: "Anna Krüger",
          email: "familie@krueger.de",
          role: Roles.PARENT
        } as CreateUserDto);
      });
    });
  });

  test.each`
    first                      | last         | expected
    ${"Marie Kahle"}           | ${"Kolbach"} | ${"marie_kahle.kolbach"}
    ${"Marie Eva Lotta Kahle"} | ${"Kolbach"} | ${"marie_eva_lotta_kahle.kolbach"}
  `(
    "deriveUsername($first, $last) === $expected",
    ({ first, last, expected }) => {
      expect(deriveUsername(first, last)).toBe(expected);
    }
  );
});
