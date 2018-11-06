/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  const onChange = sinon.spy();
  const comp = shallow(
    <TextInput
      value="Hello world"
      onChange={onChange}
      validator={_ => true}
      title="TextUpdate"
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  describe("when typing", () => {
    comp.find(".updateInput").simulate("change", { target: { value: "test" } });

    it("fires `onChange`", () => {
      expect(onChange.calledWith("test")).toBe(true);
    });
  });
});
