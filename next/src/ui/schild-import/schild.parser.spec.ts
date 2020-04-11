import { sanitizeName, deriveUsername } from "./schild.parser";

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
