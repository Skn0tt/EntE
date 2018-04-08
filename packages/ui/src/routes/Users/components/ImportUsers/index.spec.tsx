import * as React from "react";
import { ImportUsers } from "./";
import { shallow } from "enzyme";

describe("ImportUsers", () => {
  const addMessage = jest.fn();
  const onClose = jest.fn();
  const createUsers = jest.fn();
  const comp = shallow(
    <ImportUsers
      addMessage={addMessage}
      show
      onClose={onClose}
      classes={{}}
      fullScreen
      createUsers={createUsers}
      usernames={[]}
    />
  );

  it("renders correctly", () => {
    const comp = shallow(
      <ImportUsers
        addMessage={addMessage}
        show
        onClose={onClose}
        classes={{}}
        fullScreen
        createUsers={createUsers}
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
      expect(createUsers).not.toHaveBeenCalled();
    });
  });
});
