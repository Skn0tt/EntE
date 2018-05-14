/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { compare } from "./permissions";

describe("compare", () => {
  it("returns true", () => {
    expect(
      compare(
        {
          entries_create: true,
          entries_patch: true
        },
        {
          entries_create: true
        }
      )
    ).toBe(true);
  });
  it("returns false", () => {
    expect(
      compare(
        {
          entries_create: true,
          entries_patch: true
        },
        {
          entries_create: true,
          entries_sign: true
        }
      )
    ).toBe(false);
  });
});
