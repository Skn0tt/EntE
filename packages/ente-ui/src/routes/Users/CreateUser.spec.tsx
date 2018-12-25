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
import { Roles } from "ente-types";
import { UserN } from "../../redux";
import * as mockdate from "mockdate";

describe("CreateUser", () => {
  beforeAll(() => {
    mockdate.set(946681200000);
  });

  afterAll(() => {
    mockdate.reset();
  });

  const students: UserN[] = [
    new UserN({
      username: "simon",
      displayname: "Simon",
      email: "email@emai.com",
      birthday: "2100-01-01",
      role: Roles.STUDENT,
      id: "mystupidid"
    })
  ];

  it("renders correctly", () => {
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

    expect(comp).toMatchSnapshot();
  });

  it("doesn't render when show=false", () => {
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
        show={false}
        students={students}
      />
    );
    expect(comp).toMatchSnapshot();
  });

  it("closes on clicking close", () => {
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
        show={false}
        students={students}
      />
    );

    comp.find(".close").simulate("click");
    expect(onClose).toHaveBeenCalled();
  });
});
