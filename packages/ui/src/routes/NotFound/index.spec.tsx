import * as React from "react";
import { NotFound } from "./index";
import { shallow } from "enzyme";

describe("NotFound", () => {
  const comp = shallow(<NotFound classes={{}} />);

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});
