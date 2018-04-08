import * as React from "react";
import { SpecificUser } from "./index";
import { shallow } from "enzyme";
import { User } from "ente-redux";
import { getMockRouterProps } from "../../../testHelpers/mockRouter";
import { Roles } from "ente-types";
import * as sinon from "sinon";

describe("SpecificUser", () => {
  const userId = "fdas90ß9sß0";
  const user = new User({
    _id: userId,
    children: [],
    displayname: "Horst Hansen",
    email: "hort@hansen.de",
    isAdult: false,
    role: Roles.STUDENT,
    username: "hhansen"
  });
  const getUser = sinon.stub().returns(user);
  const requestUser = sinon.spy();

  const comp = shallow(
    <SpecificUser
      {...getMockRouterProps({ userId })}
      getUser={getUser}
      fullScreen
      classes={{}}
      loading={false}
      requestUser={requestUser}
      students={[]}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("requests the user", () => {
    expect(getUser.calledWith(userId)).toBe(true);
  });

  describe("when `getUser` doesn't return a user", () => {
    const getUser = sinon.stub().returns(undefined);
    const requestUser = sinon.spy();
    const comp = shallow(
      <SpecificUser
        {...getMockRouterProps({ userId })}
        getUser={getUser}
        fullScreen
        classes={{}}
        loading={false}
        requestUser={requestUser}
        students={[]}
      />
    );

    it("requests the user", () => {
      expect(requestUser.called).toBe(true);
    });
  });
});
