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
import { Some } from "monet";

describe("LoginStatus", () => {
  const logout = jest.fn();
  const displayname = "Greg";

  const comp = shallow(
    <LoginStatus displayname={Some(displayname)} logout={logout} />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("logs out on clicking logout button", () => {
    comp.find("#logout").simulate("click");

    expect(logout).toBeCalled();
  });
});
