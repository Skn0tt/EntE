/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { WeeklySummary } from "./WeeklySummary";
import { expect } from "chai";
import { Languages, dateToIsoString } from "@@types";

describe("WeeklySummary", () => {
  describe("de", () => {
    it("outputs the right info", () => {
      const items = [
        {
          date: dateToIsoString(new Date()),
          displayname: "simon",
          hour_from: 1,
          hour_to: 2,
          signed: false,
          class: "2020",
          educational: false,
        },
        {
          date: dateToIsoString(Date.now() + 24 * 60 * 60 * 1000),
          class: "2020",
          signed: true,
          hour_to: 1,
          hour_from: 2,
          displayname: "simone",
          educational: false,
        },
      ];

      const { html, subject } = WeeklySummary(
        items,
        "https://demo.ente.app",
        Languages.GERMAN
      );

      for (const i of items) {
        expect(html).to.contain(i.displayname);
        expect(html).to.contain(i.hour_from);
        expect(html).to.contain(i.hour_to);
      }
    });
  });

  describe("en", () => {
    it("outputs the right info", () => {
      const items = [
        {
          date: dateToIsoString(new Date()),
          displayname: "simon",
          class: "2020",
          hour_from: 1,
          hour_to: 2,
          signed: false,
          educational: false,
        },
        {
          date: dateToIsoString(Date.now() + 24 * 60 * 60 * 1000),
          signed: true,
          hour_to: 1,
          hour_from: 2,
          displayname: "simone",
          class: "2020",
          educational: false,
        },
      ];

      const { html, subject } = WeeklySummary(
        items,
        "https://demo.ente.app",
        Languages.ENGLISH
      );

      for (const i of items) {
        expect(html).to.contain(i.displayname);
        expect(html).to.contain(i.hour_from);
        expect(html).to.contain(i.hour_to);
      }
    });
  });
});
