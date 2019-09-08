import { containsUnknownChar } from "./containsUnknownChar";

describe("containsUnknownChar", () => {
  test("'�' returns true", () => {
    expect(containsUnknownChar("�")).toBe(true);
  });
  test("'a' returns false", () => {
    expect(containsUnknownChar("a")).toBe(false);
  });
  test("'b�ch' returns true", () => {
    expect(containsUnknownChar("b�ch")).toBe(true);
  });
});
