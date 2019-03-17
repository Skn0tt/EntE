/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { shallow } from "enzyme";
import { Table } from "./Table";

describe("Table", () => {
  type Person = {
    name: string;
    alter: number;
  };

  const items: Person[] = [
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
    <Table<Person>
      columns={[
        { name: "Name", extract: v => v.name },
        { name: "Alter", extract: v => v.alter }
      ]}
      items={items}
      extractId={i => i.name}
    />
  );

  it("renders correctly", () => {
    expect(comp).toMatchSnapshot();
  });
});
