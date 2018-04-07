import * as React from "react";
import { CreateUser } from "./index";
import { shallow } from "enzyme";
import { User } from "ente-redux";
import { Roles } from "ente-types";

describe("Users", () => {
  const students: User[] = [
    new User({
      username: "simon",
      displayname: "Simon",
      email: "email@emai.com",
      isAdult: false,
      role: Roles.STUDENT,
      _id: "mystupidid"
    })
  ];
  const getUser = jest.fn();
  const createUser = jest.fn();
  const onClose = jest.fn();
  const comp = shallow(
    <CreateUser
      getUser={getUser}
      fullScreen
      createUser={createUser}
      classes={{}}
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
        createUser={createUser}
        classes={{}}
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
