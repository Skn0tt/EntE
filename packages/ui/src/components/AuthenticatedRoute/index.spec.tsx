import * as React from "react";
import { AuthenticatedRoute } from "./index";
import { shallow } from "enzyme";
import * as renderer from "react-test-renderer";

describe("AuthenticatedRoute", () => {
  const text = "hallo";
  const comp = shallow(
    <AuthenticatedRoute isLoggedIn={true}>{text}</AuthenticatedRoute>
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  describe("when isLoggedIn", () => {
    it("returns it's children", () => {
      expect(comp.text()).toBe(text);
    });
  });

  describe("when is not LoggedIn", () => {
    const notLoggedIn = shallow(
      <AuthenticatedRoute isLoggedIn={false}>{text}</AuthenticatedRoute>
    );

    it("returns a redirect", () => {
      expect(notLoggedIn.find("Redirect").exists()).toBe(true);
    });
  });
});
