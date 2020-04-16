/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { shallow } from "enzyme";
import { LoginStatus } from "./LoginStatus";

describe("LoginStatus", () => {
  const comp = shallow(<LoginStatus />);

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});
