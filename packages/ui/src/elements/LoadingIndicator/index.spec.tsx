import * as React from "react";
import LoadingIndicator from "./index";
import { shallow } from "enzyme";

describe("LoadingIndicator", () => {
  const comp = shallow(<LoadingIndicator classes={{}} />);

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});
