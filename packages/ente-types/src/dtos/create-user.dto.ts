import { rolesArr, Roles } from "ente-types";
import { IsIn, IsBoolean, IsOptional, IsDefined } from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail,
  isValidUuidOrUsername
} from "../validators/user";
import { isValidPassword } from "../validators/auth";
import { EmptyWhen } from "../helpers/empty-when";
import { IsIntWhen } from "../helpers/is-int-when";

export class CreateUserDto {
  @CustomStringValidator(isValidUsername) username: string;

  @IsOptional()
  @CustomStringValidator(isValidPassword)
  password?: string;

  @CustomStringValidator(isValidDisplayname) displayname: string;

  @CustomStringValidator(isValidEmail) email: string;

  @IsDefined()
  @IsIn(rolesArr)
  role: Roles;

  @EmptyWhen((u: CreateUserDto) => u.role !== Roles.PARENT)
  @CustomStringValidator(isValidUuidOrUsername, { each: true })
  children: string[];

  @IsIntWhen((u: CreateUserDto) =>
    [Roles.STUDENT, Roles.MANAGER].includes(u.role)
  )
  graduationYear?: number;

  @IsDefined()
  @IsBoolean()
  isAdult: boolean;
}

export const createDefaultCreateUserDto = (): CreateUserDto => {
  const result = new CreateUserDto();

  result.username = "";
  result.password = undefined;
  result.displayname = "";
  result.email = "";
  result.role = Roles.STUDENT;
  result.children = [];
  result.isAdult = false;
  result.graduationYear = 2019;

  return result;
};
