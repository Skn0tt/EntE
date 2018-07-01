/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import template from "./WeeklySummary";
import { expect } from "chai";
import { isUndefined } from "util";

describe("WeeklySummary", () => {
  const items = [
    {
      date: new Date(),
      displayname: "simon",
      hour_from: 1,
      hour_to: 2,
      signed: false
    },
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      signed: true,
      hour_to: 1,
      hour_from: 2,
      displayname: "simone"
    }
  ];

  it("outputs the right info", () => {
    const items = [
      {
        date: new Date(),
        displayname: "simon",
        hour_from: 1,
        hour_to: 2,
        signed: false
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        signed: true,
        hour_to: 1,
        hour_from: 2,
        displayname: "simone"
      }
    ];

    const { html, subject } = template(items);

    for (const i of items) {
      expect(html).to.contain(i.displayname);
      expect(html).to.contain(i.hour_from);
      expect(html).to.contain(i.hour_to);
      expect(html).to.contain(i.date.toDateString());
    }
  });
});
