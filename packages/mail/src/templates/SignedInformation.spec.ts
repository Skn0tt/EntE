import template from "./SignedInformation";
import { expect } from "chai";

describe("SignedInformation", () => {
  const link = "https://simonknott.de";

  it("outputs the right info", () => {
    const { html, subject } = template(link);

    expect(html).to.contain(link);
  });
});
