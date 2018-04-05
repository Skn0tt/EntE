import * as index from "./index";
import { expect } from "chai";

describe("validator", () => {
  it("exports", () => {
    expect(index).to.be.an("object");
  });
});
