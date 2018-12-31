import { rolesArr, Roles } from "ente-types";
import { IsIn, IsOptional, IsDefined, IsISO8601 } from "class-validator";
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
import { languagesArr, Languages } from "../languages";

export class CreateUserDto {
  @CustomStringValidator(isValidUsername, { message: "Illegal username" })
  username: string;

  @IsOptional()
  @CustomStringValidator(isValidPassword, { message: "Illegal password" })
  password?: string;

  @CustomStringValidator(isValidDisplayname, { message: "Illegal displayname" })
  displayname: string;

  @CustomStringValidator(isValidEmail, { message: "Illegal email address" })
  email: string;

  @IsOptional()
  @IsIn(languagesArr)
  language?: Languages;

  @IsDefined()
  @IsIn(rolesArr)
  role: Roles;

  @EmptyWhen((u: CreateUserDto) => u.role !== Roles.PARENT, {
    message: "Only parents are allowed to have children."
  })
  @CustomStringValidator(isValidUuidOrUsername, { each: true })
  children: string[];

  @IsIntWhen(
    (u: CreateUserDto) => [Roles.STUDENT, Roles.MANAGER].includes(u.role),
    { message: "Students and Managers need to have a graduationYear set." }
  )
  graduationYear?: number;

  @IsOptional()
  @IsISO8601()
  birthday?: string;
}

export const createDefaultCreateUserDto = (): CreateUserDto => {
  const result = new CreateUserDto();

  result.username = "";
  result.password = undefined;
  result.displayname = "";
  result.email = "";
  result.role = Roles.STUDENT;
  result.children = [];
  result.birthday = undefined;
  result.graduationYear = 2019;

  return result;
};
