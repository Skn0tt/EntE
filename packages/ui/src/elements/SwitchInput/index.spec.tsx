import * as React from "react";
import { shallow } from "enzyme";
import { SwitchInput } from "./";
import * as sinon from "sinon";

describe("SwitchInput", () => {
  const onChange = sinon.spy();
  const comp = shallow(
    <SwitchInput title="Switch" onChange={onChange} value={false} />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  describe("when clicking switch", () => {
    comp
      .find(".updateSwitch")
      .simulate("change", { target: { checked: true } });

    it("calls `onChange`", () => {
      expect(onChange.calledWithExactly(true)).toBe(true);
    });
  });
});
