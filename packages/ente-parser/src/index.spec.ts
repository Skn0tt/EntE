/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import parse from "./";
import { Roles, CreateUserDto } from "ente-types";

const sampleData = `
username,displayname,email,password,role,isAdult,graduationYear,children
schüler,S. Schüler,sschüler@email.com,,student,FALSE,2019,
lehrer,B. Lehrer,blehrer@email.de,,teacher,,,
vater,Piet Vater,pvater@arcor.de,,parent,,,schüler
leiter,l.leiter,leiter@email.de,,manager,,2019,schüler
`;
const sampleDataError = `
username,displayname,email,password,role,isAdult,graduationYear,children
schüler,S. Schüler,sschüler@email.com,,student,FALSE,2019,
lehrer,B. Lehrer,blehrer@email.de,,teacher,,,
vater,PVater,pvaterarcor.de,parent,,,,schüler
leiter,l.leiter,leiter@email.de,,manager,,2019,schüler
`;

describe("parse", () => {
  it("returns the right data", async () => {
    const expectedResult: CreateUserDto[] = [
      {
        username: "schüler",
        displayname: "S. Schüler",
        email: "sschüler@email.com",
        children: [],
        role: Roles.STUDENT,
        isAdult: false,
        graduationYear: 2019,
        password: undefined
      },
      {
        username: "lehrer",
        displayname: "B. Lehrer",
        email: "blehrer@email.de",
        children: [],
        role: Roles.TEACHER,
        isAdult: false,
        password: undefined
      },
      {
        username: "vater",
        displayname: "Piet Vater",
        email: "pvater@arcor.de",
        children: ["schüler"],
        role: Roles.PARENT,
        isAdult: false,
        password: undefined
      },
      {
        username: "leiter",
        displayname: "l.leiter",
        email: "leiter@email.de",
        isAdult: false,
        role: Roles.MANAGER,
        children: ["schüler"],
        graduationYear: 2019,
        password: undefined
      }
    ];

    expect(await parse(sampleData, [])).toEqual(expectedResult);
  });

  it("throws error on giving wrong data", async () => {
    expect.assertions(1);
    try {
      await parse(sampleDataError, []);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it("throws error on giving data with a not existing user", async () => {
    expect.assertions(1);
    try {
      await parse(sampleDataError, []);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it("doesn't throw error on giving data with user from usernames param", async () => {
    expect.assertions(1);
    try {
      const result = await parse(sampleDataError, ["schüler2"]);
      expect(result).toBeInstanceOf(Array);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
