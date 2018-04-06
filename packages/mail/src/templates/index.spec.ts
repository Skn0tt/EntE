import { expect } from "chai";
import * as index from "./index";

describe("ente-mail", () => {
  it("exports", () => {
    expect(index).to.be.an("object");
    for (const key in index) {
      expect(index[key]).to.be.a("function");
    }
  });
});
