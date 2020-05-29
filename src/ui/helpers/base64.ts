export module Base64 {
  export function decode(input: string) {
    return Buffer.from(input, "base64").toString("utf8");
  }

  export function encode(input: string) {
    return Buffer.from(input).toString("base64");
  }
}
