/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import ChildrenInput, { includes } from "./ChildrenInput";
import { shallow } from "enzyme";
import { Roles } from "@@types";
import * as sinon from "sinon";
import { UserN } from "../redux";
import { TestWrapper } from "test/TestWrapper";

const userId = "fdas90ß9sß0";
const user = new UserN({
  id: userId,
  children: [],
  firstName: "Horst",
  lastName: "Hansen",
  displayname: "Horst Hansen",
  email: "hort@hansen.de",
  birthday: "2100-01-01",
  role: Roles.STUDENT,
  username: "hhansen",
});
const user2 = new UserN({
  id: "jkldsfjlk",
  children: [],
  firstName: "Hanni",
  lastName: "Ball",
  displayname: "Hanni Ball",
  email: "hanni@ball.de",
  birthday: "2100-01-01",
  role: Roles.STUDENT,
  username: "hball",
});

describe("ChildrenInput", () => {
  it("renders correctly", () => {
    const onChange = sinon.spy();

    const comp = shallow(
      <TestWrapper>
        <ChildrenInput
          children={[user]}
          onChange={onChange}
          students={[user, user2]}
        />
      </TestWrapper>
    );

    expect(comp).toMatchSnapshot();
  });

  it("renders when no additional users are available", () => {
    const onChange = sinon.spy();
    const comp = shallow(
      <TestWrapper>
        <ChildrenInput
          children={[user]}
          onChange={onChange}
          students={[user]}
        />
      </TestWrapper>
    );

    expect(comp).toMatchSnapshot();
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
