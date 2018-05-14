/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import template from "./SignedInformation";
import { expect } from "chai";

describe("SignedInformation", () => {
  const link = "https://simonknott.de";

  it("outputs the right info", () => {
    const { html, subject } = template(link);

    expect(html).to.contain(link);
  });
});
