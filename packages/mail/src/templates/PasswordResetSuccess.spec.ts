/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import template from "./PasswordResetSuccess";
import { expect } from "chai";

describe("PasswordResetSuccess", () => {
  const user = "skn0tt";

  it("outputs the right info", () => {
    const { html, subject } = template(user);

    expect(html).to.contain(user);
  });
});
