import { Roles, rolesArr } from "ente-types";
import { IsOptional, IsIn, IsInt, IsISO8601 } from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidDisplayname,
  isValidEmail,
  isValidUuidOrUsername,
  isValidUsername
} from "../validators";
import { languagesArr, Languages } from "../languages";

export class PatchUserDto {
  @IsOptional()
  @CustomStringValidator(isValidUsername)
  username?: string;

  @IsOptional()
  @CustomStringValidator(isValidDisplayname)
  displayname?: string;

  @IsOptional()
  @CustomStringValidator(isValidEmail)
  email?: string;

  @IsOptional()
  @IsIn(rolesArr)
  role?: Roles;

  @IsOptional()
  @IsIn(languagesArr)
  language?: Languages;

  @IsOptional()
  @CustomStringValidator(isValidUuidOrUsername, { each: true })
  children?: string[];

  @IsOptional()
  @IsISO8601()
  birthday?: string;

  @IsOptional()
  @IsInt()
  graduationYear?: number;
}
