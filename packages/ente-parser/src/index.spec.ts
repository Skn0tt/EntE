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
leiter,l.leiter,leiter@email.de,,manager,,2019,
`;
const sampleDataError = `
username,displayname,email,password,role,isAdult,graduationYear,children
schüler,S. Schüler,sschüler@email.com,,student,FALSE,2019,
lehrer,B. Lehrer,blehrer@email.de,,teacher,,,
vater,PVater,pvaterarcor.de,parent,,,,schüler
leiter,l.leiter,leiter@email.de,,manager,,2019,
`;

const exampleImport = `
username;displayname;email;password;role;isAdult;graduationYear;children
norahparis;Norah Paris;test@test.com;p4sswort!;student;TRUE;2019;
marcusparis;Marcus Paris;test@test.com;p4sswort!;student;FALSE;2021;
seymourparis;Seymour Paris;test@test.com;p4sswort!;parent;;;norahparis:marcusparis
candaceparis;Candace Paris;test@test.com;p4sswort!;parent;;;norahparis:marcusparis
montyabrams;Monty Abrams;test@test.com;p4sswort!;student;FALSE;2019;
penabrams;Pen Abrams;test@test.com;p4sswort!;student;FALSE;2021;
hermanabrams;Herman Abrams;test@test.com;p4sswort!;parent;;;montyabrams:penabrams
claudabrams;Claud Abrams;test@test.com;p4sswort!;parent;;;montyabrams:penabrams
orvillekeighley;Orville Keighley;test@test.com;p4sswort!;teacher;;;
luannedavidson;Luanne Davidson;test@test.com;p4sswort!;teacher;;;
rufuskay;Rufus Kay;test@test.com;p4sswort!;manager;;2019;
daytonkimberly;Dayton Kimberly;test@test.com;p4sswort!;manager;;2021;
`;

describe("parse", () => {
  it("correctly parses the example import", async () => {
    const expectedResult: CreateUserDto[] = [
      {
        username: "norahparis",
        displayname: "Norah Paris",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: 2019,
        isAdult: true,
        role: Roles.STUDENT
      },
      {
        username: "marcusparis",
        displayname: "Marcus Paris",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: 2021,
        isAdult: false,
        role: Roles.STUDENT
      },
      {
        username: "seymourparis",
        displayname: "Seymour Paris",
        children: ["norahparis", "marcusparis"],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: undefined,
        isAdult: false,
        role: Roles.PARENT
      },
      {
        username: "candaceparis",
        displayname: "Candace Paris",
        children: ["norahparis", "marcusparis"],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: undefined,
        isAdult: false,
        role: Roles.PARENT
      },
      {
        username: "montyabrams",
        displayname: "Monty Abrams",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: 2019,
        isAdult: false,
        role: Roles.STUDENT
      },
      {
        username: "penabrams",
        displayname: "Pen Abrams",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: 2021,
        isAdult: false,
        role: Roles.STUDENT
      },
      {
        username: "hermanabrams",
        displayname: "Herman Abrams",
        children: ["montyabrams", "penabrams"],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: undefined,
        isAdult: false,
        role: Roles.PARENT
      },
      {
        username: "claudabrams",
        displayname: "Claud Abrams",
        children: ["montyabrams", "penabrams"],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: undefined,
        isAdult: false,
        role: Roles.PARENT
      },
      {
        username: "orvillekeighley",
        displayname: "Orville Keighley",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: undefined,
        isAdult: false,
        role: Roles.TEACHER
      },
      {
        username: "luannedavidson",
        displayname: "Luanne Davidson",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: undefined,
        isAdult: false,
        role: Roles.TEACHER
      },
      {
        username: "rufuskay",
        displayname: "Rufus Kay",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: 2019,
        isAdult: false,
        role: Roles.MANAGER
      },
      {
        username: "daytonkimberly",
        displayname: "Dayton Kimberly",
        children: [],
        email: "test@test.com",
        password: "p4sswort!",
        graduationYear: 2021,
        isAdult: false,
        role: Roles.MANAGER
      }
    ];

    expect(await parse(exampleImport, [])).toEqual(expectedResult);
  });

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
        graduationYear: undefined,
        password: undefined
      },
      {
        username: "vater",
        displayname: "Piet Vater",
        email: "pvater@arcor.de",
        children: ["schüler"],
        role: Roles.PARENT,
        isAdult: false,
        graduationYear: undefined,
        password: undefined
      },
      {
        username: "leiter",
        displayname: "l.leiter",
        email: "leiter@email.de",
        isAdult: false,
        role: Roles.MANAGER,
        children: [],
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
