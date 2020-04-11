/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { NotFound } from "./NotFound";
import { shallow } from "enzyme";

describe("NotFound", () => {
  const comp = shallow(<NotFound />);

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});
