/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import Drawer from "./Drawer";
import { shallow } from "enzyme";
import { getMockRouterProps } from "../../testHelpers/mockRouter";

describe("Drawer", () => {
  it("renders correctly", () => {
    const comp = shallow(
      <Drawer {...getMockRouterProps<{}>({})}>Hallo</Drawer>
    );
    expect(comp).toMatchSnapshot();
  });
});
