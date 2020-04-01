/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import parse from "./parser";
import { Roles, CreateUserDto } from "ente-types";

const sampleData = `
username,displayname,email,password,role,birthday,class,children
schüler,S. Schüler,sschüler@email.com,,student,2100-04-02,2019,
lehrer,B. Lehrer,blehrer@email.de,,teacher,,,
vater,Piet Vater,pvater@arcor.de,,parent,,,schüler
leiter,l.leiter,leiter@email.de,,manager,,2019,
`;

const sampleDataError = `
username,displayname,email,password,role,birthday,class,children
schüler,S. Schüler,sschüler@email.com,,student,2100-01-01,2019,
lehrer,B. Lehrer,blehrer@email.de,,teacher,,,
vater,PVater,pvaterarcor.de,parent,,,,schüler
leiter,l.leiter,leiter@email.de,,manager,,2019,
`;

const sampleDataUnknownStudent = `
username,displayname,email,password,role,birthday,class,children
schüler,S. Schüler,sschüler@email.com,,student,2100-01-01,2019,
lehrer,B. Lehrer,blehrer@email.de,,teacher,,,
vater,Piet Vater,pvater@arcor.de,,parent,,,schüler2
leiter,l.leiter,leiter@email.de,,manager,,2019,
`;

const exampleImport = `
username;displayname;email;password;role;birthday;class;children
norahparis;Norah Paris;test@test.com;p4sswort!;student;2000-01-01;2019;
marcusparis;Marcus Paris;test@test.com;p4sswort!;student;2100-01-01;2021;
seymourparis;Seymour Paris;test@test.com;p4sswort!;parent;;;norahparis:marcusparis
candaceparis;Candace Paris;test@test.com;p4sswort!;parent;;;norahparis:marcusparis
montyabrams;Monty Abrams;test@test.com;p4sswort!;student;2100-01-01;2019;
penabrams;Pen Abrams;test@test.com;p4sswort!;student;2100-01-01;2021;
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
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: "2019",
        birthday: "2000-01-01",
        role: Roles.STUDENT
      },
      {
        username: "marcusparis",
        displayname: "Marcus Paris",
        children: [],
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: "2021",
        birthday: "2100-01-01",
        role: Roles.STUDENT
      },
      {
        username: "seymourparis",
        displayname: "Seymour Paris",
        children: ["norahparis", "marcusparis"],
        email: "test@test.com",
        password: "p4sswort!",
        class: undefined,
        birthday: undefined,
        isAdmin: false,
        role: Roles.PARENT
      },
      {
        username: "candaceparis",
        displayname: "Candace Paris",
        children: ["norahparis", "marcusparis"],
        email: "test@test.com",
        password: "p4sswort!",
        class: undefined,
        birthday: undefined,
        isAdmin: false,
        role: Roles.PARENT
      },
      {
        username: "montyabrams",
        displayname: "Monty Abrams",
        children: [],
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: "2019",
        birthday: "2100-01-01",
        role: Roles.STUDENT
      },
      {
        username: "penabrams",
        displayname: "Pen Abrams",
        children: [],
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: "2021",
        birthday: "2100-01-01",
        role: Roles.STUDENT
      },
      {
        username: "hermanabrams",
        displayname: "Herman Abrams",
        children: ["montyabrams", "penabrams"],
        email: "test@test.com",
        password: "p4sswort!",
        class: undefined,
        isAdmin: false,
        birthday: undefined,
        role: Roles.PARENT
      },
      {
        username: "claudabrams",
        displayname: "Claud Abrams",
        children: ["montyabrams", "penabrams"],
        email: "test@test.com",
        password: "p4sswort!",
        class: undefined,
        isAdmin: false,
        birthday: undefined,
        role: Roles.PARENT
      },
      {
        username: "orvillekeighley",
        displayname: "Orville Keighley",
        children: [],
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: undefined,
        birthday: undefined,
        role: Roles.TEACHER
      },
      {
        username: "luannedavidson",
        displayname: "Luanne Davidson",
        children: [],
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: undefined,
        birthday: undefined,
        role: Roles.TEACHER
      },
      {
        username: "rufuskay",
        displayname: "Rufus Kay",
        children: [],
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: "2019",
        birthday: undefined,
        role: Roles.MANAGER
      },
      {
        username: "daytonkimberly",
        displayname: "Dayton Kimberly",
        children: [],
        isAdmin: false,
        email: "test@test.com",
        password: "p4sswort!",
        class: "2021",
        birthday: undefined,
        role: Roles.MANAGER
      }
    ];

    expect((await parse(exampleImport, [])).success()).toEqual(expectedResult);
  });

  it("returns the right data", async () => {
    const expectedResult: CreateUserDto[] = [
      {
        username: "schüler",
        displayname: "S. Schüler",
        email: "sschüler@email.com",
        children: [],
        isAdmin: false,
        role: Roles.STUDENT,
        birthday: "2100-04-02",
        class: "2019",
        password: undefined
      },
      {
        username: "lehrer",
        displayname: "B. Lehrer",
        email: "blehrer@email.de",
        children: [],
        isAdmin: false,
        role: Roles.TEACHER,
        birthday: undefined,
        class: undefined,
        password: undefined
      },
      {
        username: "vater",
        displayname: "Piet Vater",
        email: "pvater@arcor.de",
        children: ["schüler"],
        role: Roles.PARENT,
        birthday: undefined,
        class: undefined,
        isAdmin: false,
        password: undefined
      },
      {
        username: "leiter",
        displayname: "l.leiter",
        email: "leiter@email.de",
        birthday: undefined,
        role: Roles.MANAGER,
        children: [],
        isAdmin: false,
        class: "2019",
        password: undefined
      }
    ];

    expect((await parse(sampleData, [])).success()).toEqual(expectedResult);
  });

  it("throws error on giving wrong data", async () => {
    const result = await parse(sampleDataError, []);
    expect(result.isFail()).toBe(true);
  });

  it("throws error on giving data with a not existing user", async () => {
    const result = await parse(sampleDataUnknownStudent, []);
    expect(result.isFail()).toEqual(true);
  });

  it("doesn't throw error on giving data with user from usernames param", async () => {
    const result = await parse(sampleDataUnknownStudent, ["schüler2"]);
    expect(result.isSuccess()).toBe(true);
  });
});
