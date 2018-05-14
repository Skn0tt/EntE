/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { AuthenticatedRoute } from "./index";
import { shallow } from "enzyme";
import * as renderer from "react-test-renderer";
import { getMockRouterProps } from "../../../testHelpers/mockRouter";

describe("AuthenticatedRoute", () => {
  const text = "hallo";
  const comp = shallow(
    <AuthenticatedRoute {...getMockRouterProps<{}>({})} isLoggedIn={true}>
      {text}
    </AuthenticatedRoute>
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  describe("when isLoggedIn", () => {
    it("returns it's children", () => {
      expect(comp.text()).toBe(text);
    });
  });

  describe("when is not LoggedIn", () => {
    const notLoggedIn = shallow(
      <AuthenticatedRoute {...getMockRouterProps<{}>({})} isLoggedIn={false}>
        {text}
      </AuthenticatedRoute>
    );

    it("returns a redirect", () => {
      expect(notLoggedIn.find("Redirect").exists()).toBe(true);
    });
  });
});
