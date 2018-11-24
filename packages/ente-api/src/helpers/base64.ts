export enum CharacterSets {
  LATIN_1 = "latin1",
  UTF_8 = "utf8",
  ASCII = "ascii"
}

const decode = (b64: string, charSet = CharacterSets.LATIN_1): string => {
  return Buffer.from(b64, "base64").toString(charSet);
};

export const Base64 = {
  decode
};
