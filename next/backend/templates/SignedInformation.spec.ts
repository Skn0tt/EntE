/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import { SignedInformation } from "./SignedInformation";
import { expect } from "chai";
import { Languages } from "@@types";

describe("SignedInformation", () => {
  const link = "https://simonknott.de";

  describe("de", () => {
    it("outputs the right info", () => {
      const { html, subject } = SignedInformation(link, Languages.GERMAN);

      expect(html).to.contain(link);
    });
  });

  describe("en", () => {
    it("outputs the right info", () => {
      const { html, subject } = SignedInformation(link, Languages.ENGLISH);

      expect(html).to.contain(link);
    });
  });
});
