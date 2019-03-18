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
import { isBefore, parseISO } from "date-fns";
import { roleHasBirthday } from "../roles";
import { languagesArr, Languages } from "../languages";

export class UserDto {
  @IsUUID() id: string;

  @CustomStringValidator(isValidUsername) username: string;

  @CustomStringValidator(isValidDisplayname) displayname: string;

  @CustomStringValidator(isValidEmail) email: string;

  @IsIn(rolesArr) role: Roles;

  @IsIn(languagesArr) language: Languages;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  children: UserDto[];

  @IsOptional()
  @IsInt()
  graduationYear?: number;

  @IsISO8601()
  birthday?: string;
}

export const userIsAdult = (u: UserDto) => {
  return roleHasBirthday(u.role) && isBefore(parseISO(u.birthday!), Date.now());
};
