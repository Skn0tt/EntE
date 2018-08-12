import { Maybe } from "monet";
import * as cookie from "js-cookie";

export const get = (key: string): Maybe<string> => {
  const c = cookie.get(key);
  return !!c ? Maybe.Some(c) : Maybe.Nothing();
};
