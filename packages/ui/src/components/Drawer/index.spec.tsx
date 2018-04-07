import * as React from "react";
import Drawer, { toggleDrawer } from "./index";
import { mount } from "enzyme";
import { getMockRouterProps } from "../../../test_helpers/mockRouter";
import * as ReactRouterEnzymeContext from "react-router-enzyme-context";

describe("Drawer", () => {
  const comp = mount(
    <Drawer {...getMockRouterProps<{}>({})}>Hallo</Drawer>,
    new ReactRouterEnzymeContext().get()
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});

describe("toggleDrawer", () => {
  it("toggles state", () => {
    expect(toggleDrawer({ mobileOpen: true })).toEqual({ mobileOpen: false });
    expect(toggleDrawer({ mobileOpen: false })).toEqual({ mobileOpen: true });
  });
});
