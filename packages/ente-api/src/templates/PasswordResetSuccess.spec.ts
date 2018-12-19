/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { expect } from "chai";
import { PasswordResetSuccess } from "./PasswordResetSuccess";
import { Languages } from "ente-types";

describe("PasswordResetSuccess", () => {
  const user = "skn0tt";

  describe("de", () => {
    it("outputs the right info", () => {
      const { html, subject } = PasswordResetSuccess(user, Languages.GERMAN);

      expect(html).to.contain(user);
    });
  });

  describe("en", () => {
    it("outputs the right info", () => {
      const { html, subject } = PasswordResetSuccess(user, Languages.ENGLISH);

      expect(html).to.contain(user);
    });
  });
});
