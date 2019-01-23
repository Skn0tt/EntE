import { languagesArr, isValidLanguage } from "./languages";

describe("isValidLanguage", () => {
  languagesArr.forEach(language => {
    it(`returns true on '${language}'`, () => {
      expect(isValidLanguage(language)).toBe(true);
    });
    it(`returns false on '${language}'+a`, () => {
      expect(isValidLanguage(language + "a")).toBe(false);
    });
  });
});
