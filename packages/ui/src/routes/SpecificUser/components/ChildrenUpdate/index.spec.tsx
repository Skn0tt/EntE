import * as React from "react";
import { ChildrenUpdate, includes } from "./index";
import { shallow } from "enzyme";
import { User } from "ente-redux";
import { Roles } from "ente-types";
import * as sinon from "sinon";

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
const user2 = new User({
  _id: "jkldsfjlk",
  children: [],
  displayname: "Hanni Ball",
  email: "hanni@ball.de",
  isAdult: false,
  role: Roles.STUDENT,
  username: "hball"
});

describe("ChildrenUpdate", () => {
  const onChange = sinon.spy();

  const comp = shallow(
    <ChildrenUpdate
      children={[user]}
      onChange={onChange}
      classes={{}}
      students={[user, user2]}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders when no additional users are available", () => {
    const comp = shallow(
      <ChildrenUpdate
        children={[user]}
        onChange={onChange}
        classes={{}}
        students={[user]}
      />
    );

    expect(comp).toMatchSnapshot();
  });

  describe("when adding user", () => {
    comp.find(".add").simulate("click");

    it("class `onChange`", () => {
      expect(onChange.called).toBe(true);
      expect(onChange.args[0][0]).toHaveLength(2);
      expect(onChange.args[0][0]).toEqual([user, user2]);
    });
  });
});

describe("includes", () => {
  it("returns false on values from parameter", () => {
    const exc = includes([user]);
    expect(exc(user)).toBe(true);
  });
  it("returns false on values not in parameters", () => {
    const exc = includes([user]);
    expect(exc(user2)).toBe(false);
  });
});
