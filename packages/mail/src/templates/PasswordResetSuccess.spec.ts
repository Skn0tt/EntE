import template from "./PasswordResetSuccess";
import { expect } from "chai";

describe("PasswordResetSuccess", () => {
  const user = "skn0tt";

  it("outputs the right info", () => {
    const { html, subject } = template(user);

    expect(html).to.contain(user);
  });
});
