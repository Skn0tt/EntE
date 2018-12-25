import { Roles, rolesArr } from "ente-types";
import {
  IsIn,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsInt,
  IsISO8601
} from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail
} from "../validators";
import { Type } from "class-transformer";
import { EmptyWhen } from "../helpers/empty-when";
import { UndefinedWhen } from "../helpers/undefined-when";
import { isBefore } from "date-fns";
import { roleHasBirthday } from "../roles";

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

  @UndefinedWhen((u: UserDto) => u.role !== Roles.STUDENT)
  @IsISO8601()
  birthday?: string;
}

export const userIsAdult = (u: UserDto) => {
  return roleHasBirthday(u.role) && isBefore(u.birthday!, Date.now());
};
