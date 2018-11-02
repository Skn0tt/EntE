import { PatchUserDto } from "./user-patch.dto";
import { rolesArr, Roles } from "ente-types";
import {
  IsIn,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsDefined
} from "class-validator";
import { CustomStringValidator } from "../helpers";
import {
  isValidUsername,
  isValidPassword,
  isValidDisplayname,
  isValidEmail
} from "../validators";

export class CreateUserDto extends PatchUserDto {
  @CustomStringValidator(isValidUsername) username: string;

  @IsOptional()
  @CustomStringValidator(isValidPassword)
  password?: string;

  @CustomStringValidator(isValidDisplayname) displayname: string;

  @CustomStringValidator(isValidEmail) email: string;

  @IsDefined()
  @IsIn(rolesArr)
  role: Roles;

  @IsUUID("4", { each: true })
  children: string[];

  @IsDefined()
  @IsBoolean()
  isAdult: boolean;
}

export const createDefaultCreateUserDto = (): CreateUserDto => {
  const result = new CreateUserDto();

  result.username = "";
  result.password = "";
  result.displayname = "";
  result.email = "";
  result.role = Roles.STUDENT;
  result.children = [];
  result.isAdult = false;

  return result;
};
