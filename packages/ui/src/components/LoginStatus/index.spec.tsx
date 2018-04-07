import * as React from "react";
import { LoginStatus } from "./index";
import { shallow } from "enzyme";
import * as ReactRouterEnzymeContext from "react-router-enzyme-context";

describe("LoginStatus", () => {
  const logout = jest.fn();
  const displayname = "Greg";

  const comp = shallow(
    <LoginStatus classes={{}} displayname={displayname} logout={logout} />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("logs out on clicking logout button", () => {
    comp.find(".logout").simulate("click");

    expect(logout).toBeCalled();
  });
});
