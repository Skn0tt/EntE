/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Table, changeSearch, changeSortField } from "./index";
import { shallow } from "enzyme";

describe("Table", () => {
  const onClick = jest.fn();

  type T = {
    name: string;
    alter: number;
  };

  const items: T[] = [
    {
      name: "Bernd",
      alter: 16
    },
    {
      name: "Volker",
      alter: 17
    }
  ];

  const comp = shallow(
    <Table
      cellExtractor={(i: T) => [i.name, i.alter]}
      headers={["Name", "Alter"]}
      items={items}
      classes={{}}
      keyExtractor={(i: T) => i.name}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });

  describe("changeSearch", () => {
    it("changes the search", () => {
      const search = "Hallo";
      expect(
        changeSearch(search)({ searchTerm: "jkl", sortField: 1, sortUp: false })
          .searchTerm
      ).toEqual(search);
    });
  });

  describe("changeSortField", () => {
    describe("when same field", () => {
      it("doesnt change the field", () => {
        const field = 5;
        expect(
          changeSortField(field)({
            searchTerm: "jkl",
            sortField: 5,
            sortUp: false
          }).sortField
        ).toEqual(field);
      });
      it("changes the direction", () => {
        const field = 5;
        expect(
          changeSortField(field)({
            searchTerm: "jkl",
            sortField: 5,
            sortUp: false
          }).sortUp
        ).toEqual(true);
      });
    });

    describe("different Field", () => {
      it("does change the field", () => {
        const field = 7;
        expect(
          changeSortField(field)({
            searchTerm: "jkl",
            sortField: 5,
            sortUp: false
          }).sortField
        ).toEqual(field);
      });
      it("keeps direction on true", () => {
        const field = 7;
        expect(
          changeSortField(field)({
            searchTerm: "jkl",
            sortField: 5,
            sortUp: false
          }).sortUp
        ).toEqual(true);
      });
    });
  });
});