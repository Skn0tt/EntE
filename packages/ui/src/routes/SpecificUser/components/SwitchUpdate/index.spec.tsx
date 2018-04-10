import * as React from "react";
import { shallow } from "enzyme";
import { SwitchUpdate } from "./";
import * as sinon from "sinon";

describe("SwitchUpdate", () => {
  const onChange = sinon.spy();
  const comp = shallow(
    <SwitchUpdate title="Switch" onChange={onChange} value={false} />
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
