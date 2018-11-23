import { Base64, CharacterSets } from "./base64";

describe("base64", () => {
  describe("decode", () => {
    describe("latin1", () => {
      const inputs = [
        ["aGFsbG8=", "hallo"],
        ["aPZyc3QubeRsZXI=", "hörst.mäler"],
        ["aPZyc3QubeRsZXI6cORzc3f2cmQ=", "hörst.mäler:pässwörd"]
      ];

      inputs.forEach(([value, result]) => {
        test(value, () => {
          expect(Base64.decode(value, CharacterSets.LATIN_1)).toEqual(result);
        });
      });
    });
  });
});
