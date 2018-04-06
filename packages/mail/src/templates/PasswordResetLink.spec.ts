import template from "./PasswordResetLink";
import { expect } from "chai";

describe("PasswordResetLink", () => {
  const link = "http://simonknott.de";
  const user = "skn0tt";

  it("outputs the right info", () => {
    const { html, subject } = template(link, user);

    expect(html).to.contain(link);
    expect(html).to.contain(user);
  });
});
