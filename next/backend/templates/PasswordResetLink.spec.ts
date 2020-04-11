/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import { expect } from "chai";
import { PasswordResetLink } from "./PasswordResetLink";
import { Languages } from "@@types";

describe("PasswordResetLink", () => {
  describe("en", () => {
    const link = "http://simonknott.de";
    const user = "skn0tt";

    it("outputs the right info", () => {
      const { html, subject } = PasswordResetLink(
        link,
        user,
        Languages.ENGLISH
      );

      expect(html).to.contain(link);
      expect(html).to.contain(user);
    });
  });

  describe("de", () => {
    const link = "http://simonknott.de";
    const user = "skn0tt";

    it("outputs the right info", () => {
      const { html, subject } = PasswordResetLink(link, user, Languages.GERMAN);

      expect(html).to.contain(link);
      expect(html).to.contain(user);
    });
  });
});
