/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { expect } from "chai";
import * as index from "./index";

describe("ente-mail", () => {
  it("exports", () => {
    expect(index).to.be.an("object");
    for (const key in index) {
      expect((index as any)[key]).to.be.a("function");
    }
  });
});
