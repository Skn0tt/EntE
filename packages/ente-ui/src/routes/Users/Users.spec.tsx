/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Users } from "./Users";
import { shallow } from "enzyme";
import { getMockRouterProps } from "../../../testHelpers/mockRouter";
import { Roles } from "ente-types";
import { UserN } from "../../redux";

describe("Users", () => {
  const users: UserN[] = [
    new UserN({
      username: "simon",
      displayname: "Simon",
      email: "email@emai.com",
      birthday: "2100-01-01",
      role: Roles.STUDENT,
      id: "mystupidid"
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
