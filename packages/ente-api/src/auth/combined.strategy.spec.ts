import { CombinedStrategy } from "./combined.strategy";

describe("CombinedStrategy", () => {
  describe("extractCredentials", () => {
    it("returns credentials", () => {
      const creds = CombinedStrategy.extractCredentials("admin:root");
      expect(creds.isSome()).toBe(true);

      const { password, username } = creds.some();
      expect(password).toEqual("root");
      expect(username).toEqual("admin");
    });

    it("works with colon in password", () => {
      const creds = CombinedStrategy.extractCredentials("admin:ro:ot");
      expect(creds.isSome()).toBe(true);

      const { password, username } = creds.some();
      expect(password).toEqual("ro:ot");
      expect(username).toEqual("admin");
    });

    it("returns none when there is no password", () => {
      const creds = CombinedStrategy.extractCredentials("admin");
      expect(creds.isNone()).toBe(true);
    });
  });
});
