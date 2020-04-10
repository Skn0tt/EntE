export const isSentryDsn = (s: string) =>
  /https:\/\/\w+@(\w+\.)+\w+\/\d+/.test(s);
