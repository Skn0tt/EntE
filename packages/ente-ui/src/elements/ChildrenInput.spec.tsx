/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { ChildrenInput, includes, translation } from "./ChildrenInput";
import { shallow } from "enzyme";
import { Roles } from "ente-types";
import * as sinon from "sinon";
import { UserN } from "../redux";

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
const user2 = new UserN({
  id: "jkldsfjlk",
  children: [],
  displayname: "Hanni Ball",
  email: "hanni@ball.de",
  birthday: "2100-01-01",
  role: Roles.STUDENT,
  username: "hball"
});

describe("ChildrenInput", () => {
  const onChange = sinon.spy();

  const comp = shallow(
    <ChildrenInput
      children={[user]}
      onChange={onChange}
      translation={translation.en}
      students={[user, user2]}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders when no additional users are available", () => {
    const onChange = sinon.spy();
    const comp = shallow(
      <ChildrenInput
        children={[user]}
        onChange={onChange}
        students={[user]}
        translation={translation.en}
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
