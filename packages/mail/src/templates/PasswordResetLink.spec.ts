/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

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
