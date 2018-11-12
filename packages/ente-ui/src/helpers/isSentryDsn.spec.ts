import { isSentryDsn } from "./isSentryDsn";

describe("isSentryDsn", () => {
  const valid = [
    "https://23bnjkadsk:djaskl@simonknott.de/321",
    "https://23bnjkadsk:djaskl@sentry.io/321"
  ];
  valid.forEach(v => {
    test(v, () => {
      expect(isSentryDsn(v)).toBe(true);
    });
  });

  const invalid = ["<nil>", "", "invalid"];
  invalid.forEach(v => {
    test(v, () => {
      expect(isSentryDsn(v)).toBe(false);
    });
  });
});
