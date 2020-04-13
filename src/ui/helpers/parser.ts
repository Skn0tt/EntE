/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { parse as papaparse, ParseResult } from "papaparse";
import * as _ from "lodash";
import { CreateUserDto, CreateUserDtoValidator } from "@@types";
import { Validation, Success, Fail } from "monet";
import { ValidationError } from "class-validator";

const isBlank = (str: string) => !str || /^\s*$/.test(str);

export const parseCSVFromFile = async (
  s: string,
  existingUsernames: string[]
) => await parseCSV(s, existingUsernames);

export const validateCreateUserDtos = (
  dtos: CreateUserDto[],
  existingStudentUsernames: string[]
): Validation<(ValidationError | string)[], CreateUserDto[]> => {
  const errors: (ValidationError | string)[] = [];
  const validations = dtos.map(CreateUserDtoValidator.validateWithErrors);
  validations.forEach((validation) => {
    validation.forEachFail((fail) => {
      errors.push(...fail);
    });
  });

  const usernames = dtos
    .map((u) => u.username)
    .concat(existingStudentUsernames);
  const childrenThatDontExist = dtos.reduce<string[]>((acc, user) => {
    const notExistant = user.children.filter((c) => !usernames.includes(c));
    return acc.concat(notExistant);
  }, []);
  errors.push(...childrenThatDontExist.map((c) => `Unknown child: ${c}`));

  return errors.length === 0 ? Success(dtos) : Fail(errors);
};

const parseCSV = async (
  input: string,
  existingUsernames: string[]
): Promise<Validation<(ValidationError | string)[], CreateUserDto[]>> => {
  const parsed = await parse(input.trim());

  const result: CreateUserDto[] = parsed.data.map((row: any) => {
    const res: CreateUserDto = {
      isAdmin: false,
      username: row.username,
      displayname: row.displayname,
      email: row.email,
      role: row.role,
      birthday: !!row.birthday ? row.birthday : undefined,
      children: !!row.children ? row.children.split(":") : [],
      password: !isBlank(row.password) ? row.password : undefined,
      class: isBlank(row.class) ? undefined : "" + row.class,
    };

    return res;
  });

  return validateCreateUserDtos(result, existingUsernames);
};

const parse = (input: string) =>
  new Promise<ParseResult>((complete, error) => {
    papaparse(input, {
      complete,
      error,
      header: true,
      dynamicTyping: true,
    });
  });

export default parseCSV;
