import { Roles, rolesArr } from "ente-types";
import {
  IsBoolean,
  IsIn,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsInt
} from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail
} from "../validators";
import { Type } from "class-transformer";
import { EmptyWhen } from "../helpers/empty-when";

export class UserDto {
  @IsUUID() id: string;

  @CustomStringValidator(isValidUsername) username: string;

  @CustomStringValidator(isValidDisplayname) displayname: string;

  @CustomStringValidator(isValidEmail) email: string;

  @IsIn(rolesArr) role: Roles;

  @IsOptional()
  @IsArray()
  @EmptyWhen((u: UserDto) => u.role !== Roles.PARENT)
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  children: UserDto[];

  @IsOptional()
  @IsInt()
  graduationYear?: number;

  @IsBoolean() isAdult: boolean;
}
