import { Maybe } from "monet";

export const get = (key: string) => Maybe.fromNull(localStorage.getItem(key));

export const set = (key: string, value: string) =>
  localStorage.setItem(key, value);
