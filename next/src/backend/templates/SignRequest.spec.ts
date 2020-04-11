/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import { expect } from "chai";
import { SignRequest } from "./SignRequest";
import { Languages } from "@@types";

describe("SignRequest", () => {
  const link = "https://simonknott.de";

  describe("de", () => {
    it("outputs the right info", () => {
      const { html, subject } = SignRequest(link, Languages.GERMAN);

      expect(html).to.contain(link);
    });
  });

  describe("de", () => {
    it("outputs the right info", () => {
      const { html, subject } = SignRequest(link, Languages.ENGLISH);

      expect(html).to.contain(link);
    });
  });
});
