/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { parse as papaparse, ParseResult } from "papaparse";
import * as _ from "lodash";
import { CreateUserDto, isValidCreateUserDto } from "ente-types";

const isBlank = (str: string) => !str || /^\s*$/.test(str);

export const parseCSVFromFile = async (
  s: string,
  existingUsernames: string[]
) => await parseCSV(s, existingUsernames);

const parseCSV = async (
  input: string,
  existingUsernames: string[]
): Promise<CreateUserDto[]> => {
  const parsed = await parse(input.trim());

  const result: CreateUserDto[] = parsed.data.map(row => {
    const res: CreateUserDto = {
      username: row.username,
      displayname: row.displayname,
      email: row.email,
      role: row.role,
      isAdult: !row.isAdult ? false : true,
      children: !!row.children ? row.children.split(":") : [],
      password: !isBlank(row.password) ? row.password : undefined,
      graduationYear: isBlank(row.graduationYear)
        ? undefined
        : +row.graduationYear
    };

    return res;
  });

  const allValid = result.every(isValidCreateUserDto);
  if (!allValid) {
    throw new Error("One of the users is invalid.");
  }

  const usernames = result.map(u => u.username).concat(existingUsernames);
  const childrenValid = result.every(u =>
    u.children.every(c => usernames.includes(c))
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
