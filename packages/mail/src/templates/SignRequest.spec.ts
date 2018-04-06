import template from "./SignRequest";
import { expect } from "chai";

describe("SignRequest", () => {
  const link = "https://simonknott.de";

  it("outputs the right info", () => {
    const { html, subject } = template(link);

    expect(html).to.contain(link);
  });
});
