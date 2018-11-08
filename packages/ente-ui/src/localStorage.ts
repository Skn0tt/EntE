import { Maybe } from "monet";

const { localStorage } = window;

export const get = (key: string) =>
  Maybe.fromNull(!!localStorage ? localStorage.getItem(key) : null);

export const set = (key: string, value: string) =>
  localStorage && localStorage.setItem(key, value);
