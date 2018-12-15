/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { withErrorBoundary } from "./withErrorBoundary";
import { shallow, ShallowWrapper, mount } from "enzyme";

const ErrorComponent: React.SFC<{ throwErr?: boolean }> = ({ throwErr }) => {
  if (throwErr) {
    throw new Error("I'm an error.");
  }

  return <h1>No Error</h1>;
};

describe("ErrorComponent", () => {
  it("renders correctly", () => {
    const comp = shallow(<ErrorComponent />);

    expect(comp.text()).toContain("No Error");
  });

  it("throw an Error", () => {
    expect.assertions(2);
    try {
      const comp = shallow(<ErrorComponent throwErr />);
    } catch (e) {
      const error = e as Error;
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("I'm an error.");
    }
  });
});

describe("withErrorBoundary", () => {
  const Bounded = withErrorBoundary()(ErrorComponent);

  describe("when wrapped component throws", () => {
    it("doesnt throw error", () => {
      expect(() => mount(<Bounded throwErr />)).not.toThrow();
    });

    it("displays the 'Something went wrong' screen.", () => {
      expect(mount(<Bounded throwErr />).html()).toContain("error");
    });

    it("displays the 'CustomErrorBoundary' screen.", () => {
      const CustumBounded = withErrorBoundary(() => <p>Help!!</p>)(
        ErrorComponent
      );
      expect(mount(<CustumBounded throwErr />).html()).toContain("Help!!");
    });
  });

  it("renders the original component", () => {
    try {
      const comp = shallow(<Bounded />);
      expect(comp.text()).toEqual("<ErrorComponent />");
    } catch {
      expect(false).toBe(true);
    }
  });
});
