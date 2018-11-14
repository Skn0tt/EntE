import { isSentryDsn } from "./isSentryDsn";

describe("isSentryDsn", () => {
  const valid = [
    "https://23bnjkadsk@simonknott.de/321",
    "https://23bnjkadsk@sentry.io/321"
  ];
  valid.forEach(v => {
    test(v, () => {
      expect(isSentryDsn(v)).toBe(true);
    });
  });

  const invalid = [
    "<nil>",
    "",
    "invalid",
    "https://23bnjkadsk:890asdjkl@simonknott.de/321"
  ];
  invalid.forEach(v => {
    test(v, () => {
      expect(isSentryDsn(v)).toBe(false);
    });
  });
});
