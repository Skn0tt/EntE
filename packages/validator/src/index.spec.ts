/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as index from "./index";
import { expect } from "chai";

describe("validator", () => {
  it("exports", () => {
    expect(index).to.be.an("object");
  });
});
