import { Roles, rolesArr } from "ente-types";
import { IsOptional, IsIn, IsBoolean, IsInt } from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidDisplayname,
  isValidEmail,
  isValidUuidOrUsername
} from "../validators";

export class PatchUserDto {
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
  @CustomStringValidator(isValidUuidOrUsername, { each: true })
  children?: string[];

  @IsOptional()
  @IsBoolean()
  isAdult?: boolean;

  @IsOptional()
  @IsInt()
  graduationYear?: number;
}
