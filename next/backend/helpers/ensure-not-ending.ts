export const ensureNotEnding = (ending: string) => (value: string) =>
  value.endsWith(ending) ? value.slice(0, value.length - ending.length) : value;
