import { Roles, rolesArr } from "ente-types";
import {
  IsBoolean,
  IsIn,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional
} from "class-validator";
import { CustomStringValidator } from "../helpers";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail
} from "../validators";
import { Type } from "class-transformer";

export class UserDto {
  @IsUUID() id: string;

  @CustomStringValidator(isValidUsername) username: string;

  @CustomStringValidator(isValidDisplayname) displayname: string;

  @CustomStringValidator(isValidEmail) email: string;

  @IsIn(rolesArr) role: Roles;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  children: UserDto[];

  @IsBoolean() isAdult: boolean;
}
