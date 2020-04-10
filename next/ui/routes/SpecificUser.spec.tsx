/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { SpecificUser } from "./SpecificUser";
import { shallow } from "enzyme";
import { getMockRouterProps } from "../../testHelpers/mockRouter";
import { Roles } from "@@types";
import * as sinon from "sinon";
import { UserN } from "../redux";
import { Some, None } from "monet";

// Skipped: Add back when Hooks are stable
describe.skip("SpecificUser", () => {
  const userId = "fdas90ß9sß0";
  const user = new UserN({
    id: userId,
    children: [],
    displayname: "Horst Hansen",
    email: "hort@hansen.de",
    birthday: "2100-01-01",
    role: Roles.STUDENT,
    username: "hhansen"
  });
  const getUser = sinon.stub().returns(Some(user));
  const requestUser = sinon.spy();

  const comp = shallow(
    <SpecificUser
      {...getMockRouterProps({ userId })}
      availableClasses={["2012"]}
      getUser={getUser}
      fullScreen
      classes={{ menuButton: "" }}
      loading={false}
      token=""
      requestUser={requestUser}
      students={[]}
      updateUser={() => {}}
      deleteUser={() => {}}
      promote={() => {}}
      demote={() => {}}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("requests the user", () => {
    expect(getUser.calledWith(userId)).toBe(true);
  });

  describe("when `getUser` doesn't return a user", () => {
    const getUser = sinon.stub().returns(None());
    const requestUser = sinon.spy();
    const comp = shallow(
      <SpecificUser
        {...getMockRouterProps({ userId })}
        availableClasses={["2012"]}
        getUser={getUser}
        fullScreen
        classes={{ menuButton: "" }}
        token=""
        loading={false}
        requestUser={requestUser}
        students={[]}
        updateUser={() => {}}
        deleteUser={() => {}}
        demote={() => {}}
        promote={() => {}}
      />
    );

    it("requests the user", () => {
      expect(requestUser.called).toBe(true);
    });
  });
});
