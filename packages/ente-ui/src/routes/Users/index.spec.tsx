/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Users } from "./index";
import { shallow } from "enzyme";
import { User } from "ente-redux";
import { getMockRouterProps } from "../../../testHelpers/mockRouter";
import { Roles } from "ente-types";

describe("Users", () => {
  const users: User[] = [
    new User({
      username: "simon",
      displayname: "Simon",
      email: "email@emai.com",
      isAdult: false,
      role: Roles.STUDENT,
      _id: "mystupidid"
    })
  ];
  const getUsers = jest.fn();
  const comp = shallow(
    <Users
      {...getMockRouterProps({})}
      classes={{}}
      users={users}
      getUsers={getUsers}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("requests all users", () => {
    expect(getUsers).toBeCalled();
  });
});
