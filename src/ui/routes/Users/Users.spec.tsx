/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Users } from "./Users";
import { shallow } from "enzyme";
import { TestWrapper } from "test/TestWrapper";

describe("Users", () => {
  const comp = shallow(
    <TestWrapper>
      <Users />
    </TestWrapper>
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});
