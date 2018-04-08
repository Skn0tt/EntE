import * as React from "react";
import { TableHeadCell } from "./index";
import { shallow } from "enzyme";

describe("TableHeadCell", () => {
  const onClick = jest.fn();

  const comp = shallow(
    <TableHeadCell
      onClick={onClick}
      classes={{}}
      sortUp
      active
      tooltip="I bims"
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  it("calls onClick when clicking", () => {
    comp.find(".tableSortLabel").simulate("click");
    expect(onClick).toBeCalled();
  });
});
