import * as React from "react";
import { MessageStream } from "./index";
import { shallow } from "enzyme";
import { getMockRouterProps } from "../../../test_helpers/mockRouter";
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
