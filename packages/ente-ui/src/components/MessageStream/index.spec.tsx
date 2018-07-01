/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { MessageStream } from "./index";
import { shallow } from "enzyme";
import * as ReactRouterEnzymeContext from "react-router-enzyme-context";

describe("MessageStream", () => {
  const removeMessage = jest.fn();
  const messages = ["Hallo", "Nachricht"];

  const comp = shallow(
    <MessageStream
      messages={messages}
      removeMessage={removeMessage}
      classes={{}}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});