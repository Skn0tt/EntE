import { compare } from "./permissions";

describe("compare", () => {
  it("returns true", () => {
    expect(
      compare(
        {
          entries_create: true,
          entries_patch: true
        },
        {
          entries_create: true
        }
      )
    ).toBe(true);
  });
  it("returns false", () => {
    expect(
      compare(
        {
          entries_create: true,
          entries_patch: true
        },
        {
          entries_create: true,
          entries_sign: true
        }
      )
    ).toBe(false);
  });
});
