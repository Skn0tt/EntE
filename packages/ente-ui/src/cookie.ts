import { Maybe, Some, None } from "monet";

export const get = (key: string): Maybe<string> => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + key + "=");

  if (parts.length === 2) {
    const result = parts
      .pop()
      .split(";")
      .shift();
    return Some(result);
  }
  return None();
};
