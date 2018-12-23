/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { CreateUser, lang } from "./CreateUser";
import { shallow } from "enzyme";
import { Roles, Languages } from "ente-types";
import { UserN } from "../../redux";

describe("Users", () => {
  const students: UserN[] = [
    new UserN({
      username: "simon",
      displayname: "Simon",
      email: "email@emai.com",
      isAdult: false,
      role: Roles.STUDENT,
      id: "mystupidid"
    })
  ];
  const getUser = jest.fn();
  const createUser = jest.fn();
  const onClose = jest.fn();
  const comp = shallow(
    <CreateUser
      getUser={getUser}
      fullScreen
      translation={lang.de}
      createUsers={createUser}
      onClose={onClose}
      show
      students={students}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("doesn't render when show=false", () => {
    const comp = shallow(
      <CreateUser
        getUser={getUser}
        fullScreen
        translation={lang.de}
        createUsers={createUser}
        onClose={onClose}
        show={false}
        students={students}
      />
    );
    expect(comp).toMatchSnapshot();
  });

  it("closes on clicking close", () => {
    comp.find(".close").simulate("click");
    expect(onClose).toHaveBeenCalled();
  });
});
