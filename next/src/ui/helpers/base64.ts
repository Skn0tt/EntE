const decode = (input: string) => Buffer.from(input, "base64").toString("utf8");

export const Base64 = {
  decode,
};
