import parse from "./";
import { IUserCreate, Roles } from "ente-types";

const sampleData = `
username,displayname,email,role,isAdult,children
schüler,S. Schüler,sschüler@email.com,student,FALSE,
lehrer,B. Lehrer,blehrer@email.de,teacher,,
vater,Piet Vater,pvater@arcor.de,parent,,schüler
leiter,l.leiter,leiter@email.de,manager,,schüler
`
const sampleDataError = `
username,displayname,email,role,isAdult,children
schüler,S. Schüler,sschüler@email.com,student,FALSE,
lehrer,B. Lehrer,blehrer@email.de,teacher,,
vater,PVater,pvaterarcor.de,parent,,schüler
leiter,l.leiter,leiter@email.de,manager,,schüler
`

describe("parse", () => {
  it("returns the right data", async () => {
    const expectedResult: IUserCreate[] = [{
      username: "schüler",
      displayname: "S. Schüler",
      email: "sschüler@email.com",
      children: [],
      role: Roles.STUDENT,
      isAdult: false
    }, {
      username: "lehrer",
      displayname: "B. Lehrer",
      email: "blehrer@email.de",
      children: [],
      role: Roles.TEACHER,
      isAdult: false
    }, {
      username: "vater",
      displayname: "Piet Vater",
      email: "pvater@arcor.de",
      children: ["schüler"],
      role: Roles.PARENT,
      isAdult: false
    }, {
      username: "leiter",
      displayname: "l.leiter",
      email: "leiter@email.de",
      isAdult: false,
      role: Roles.MANAGER,
      children: ["schüler"]
    }]

    expect(await parse(sampleData)).toEqual(expectedResult);
  })

  it("throws error on giving wrong data", async () => {
    expect.assertions(1);
    try {
      await parse(sampleDataError);
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
})
