/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { ImportUsers } from "./ImportUsers";
import { shallow } from "enzyme";

describe.skip("ImportUsers", () => {
  const onClose = jest.fn();
  const onImport = jest.fn();
  const comp = shallow(
    <ImportUsers
      show
      onImport={onImport}
      classes={{ dropzone: "dropzone" }}
      onClose={onClose}
      fullScreen
      usernames={[]}
    />
  );

  it("renders correctly", () => {
    const comp = shallow(
      <ImportUsers
        show
        classes={{ dropzone: "dropzone" }}
        onClose={onClose}
        onImport={onImport}
        fullScreen
        usernames={[]}
      />
    );

    expect(comp).toMatchSnapshot();
  });

  it("closes on clicking close", () => {
    comp.find(".close").simulate("click");
    expect(onClose).toHaveBeenCalled();
  });

  describe("when not added users", () => {
    it("doesn't submit", () => {
      comp.find(".submit").simulate("click");
      expect(onImport).not.toHaveBeenCalled();
    });
  });
});
