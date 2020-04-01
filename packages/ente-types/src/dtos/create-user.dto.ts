import { rolesArr, Roles } from "ente-types";
import {
  IsIn,
  IsOptional,
  IsDefined,
  IsISO8601,
  IsBoolean
} from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail,
  isValidUuidOrUsername,
  isValidClass
} from "../validators/user";
import { isValidPassword } from "../validators/auth";
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

  @IsDefined()
  @IsBoolean()
  isAdmin: boolean;

  @CustomStringValidator(isValidUuidOrUsername, { each: true })
  children: string[];

  @IsOptional()
  @CustomStringValidator(isValidClass)
  class?: string;

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
  result.class = undefined;

  return result;
};
