/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import LoadingIndicator from "./index";
import { shallow } from "enzyme";

describe("LoadingIndicator", () => {
  const comp = shallow(<LoadingIndicator classes={{}} />);

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});
