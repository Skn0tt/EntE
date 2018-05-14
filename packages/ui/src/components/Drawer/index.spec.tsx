/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import Drawer, { toggleDrawer } from "./index";
import { mount, shallow } from "enzyme";
import { getMockRouterProps } from "../../../testHelpers/mockRouter";
import * as ReactRouterEnzymeContext from "react-router-enzyme-context";

describe("Drawer", () => {
  it("renders correctly", () => {
    const comp = shallow(
      <Drawer {...getMockRouterProps<{}>({})}>Hallo</Drawer>
    );
    expect(comp).toMatchSnapshot();
  });
});

describe("toggleDrawer", () => {
  it("toggles state", () => {
    expect(toggleDrawer({ mobileOpen: true })).toEqual({ mobileOpen: false });
    expect(toggleDrawer({ mobileOpen: false })).toEqual({ mobileOpen: true });
  });
});
