/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { parse as papaparse, ParseResult } from "papaparse";
import * as _ from "lodash";
import { CreateUserDto, isValidCreateUserDtoWithErrors } from "ente-types";
import { Validation, Success, Fail } from "monet";
import { ValidationError } from "class-validator";

const isBlank = (str: string) => !str || /^\s*$/.test(str);

export const parseCSVFromFile = async (
  s: string,
  existingUsernames: string[]
) => await parseCSV(s, existingUsernames);

const parseCSV = async (
  input: string,
  existingUsernames: string[]
): Promise<Validation<(ValidationError | string)[], CreateUserDto[]>> => {
  const errors: (ValidationError | string)[] = [];

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

  const validations = result.map(isValidCreateUserDtoWithErrors);
  validations.forEach(validation => {
    validation.forEachFail(fail => {
      errors.push(...fail);
    });
  });

  const usernames = result.map(u => u.username).concat(existingUsernames);
  const childrenThatDontExist = result.reduce<string[]>((acc, user) => {
    const notExistant = user.children.filter(c => !usernames.includes(c));
    return acc.concat(notExistant);
  }, []);
  errors.push(...childrenThatDontExist.map(c => `Unknown child: ${c}`));

  return errors.length === 0 ? Success(result) : Fail(errors);
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
