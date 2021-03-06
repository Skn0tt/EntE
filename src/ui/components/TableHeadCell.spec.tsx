/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { shallow } from "enzyme";
import { TableHeadCell } from "./TableHeadCell";

describe("TableHeadCell", () => {
  const onClick = jest.fn();

  const comp = shallow(
    <TableHeadCell onClick={onClick} sortUp active tooltip="I bims" />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("calls onClick when clicking", () => {
    comp.find(".tableSortLabel").simulate("click");
    expect(onClick).toBeCalled();
  });
});
