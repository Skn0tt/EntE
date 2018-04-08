import { parse as papaparse, ParseResult } from "papaparse";
import { IUserCreate } from "ente-types";
import { isValidUserExcludingChildren } from "ente-validator";
import * as _ from "lodash";

const isBlank = (str: string) => !str || /^\s*$/.test(str);

const readFile = async (f: File) =>
  new Promise<string>((resolve, reject) => {
    var r = new FileReader();
    r.onload = _ => resolve(r.result);
    r.onerror = reject;
    r.readAsText(f);
  });

export const parseCSVFromFile = async (f: File, existingUsernames: string[]) =>
  await parseCSV(await readFile(f), existingUsernames);

const parseCSV = async (
  input: string,
  existingUsernames: string[]
): Promise<IUserCreate[]> => {
  const parsed = await parse(input.trim());

  const result: IUserCreate[] = parsed.data.map(row => {
    const res: IUserCreate = {
      username: row.username,
      displayname: row.displayname,
      email: row.email,
      role: row.role,
      isAdult: !row.isAdult ? false : true,
      children: !!row.children ? row.children.split(";") : []
    };

    if (!isBlank(row.password)) {
      res.password = row.password;
    }

    return res;
  });

  const allValid = result.every(isValidUserExcludingChildren);
  if (!allValid) {
    throw new Error("One of the users is invalid.");
  }

  const usernames = result.map(u => u.username).concat(existingUsernames);
  const childrenValid = result.every(u =>
    u.children.every(c => usernames.indexOf(c) !== -1)
  );
  if (!childrenValid) {
    throw new Error("One of the children does not exist");
  }

  return result;
};

const parse = (input: string) =>
  new Promise<ParseResult>((complete, error) => {
    papaparse(input, {
      complete,
      error,
      header: true,
      dynamicTyping: true
    });
  });

export default parseCSV;
