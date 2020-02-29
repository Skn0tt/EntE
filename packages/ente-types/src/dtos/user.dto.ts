import { Roles, rolesArr } from "ente-types";
import {
  IsIn,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsISO8601,
  IsString,
  IsInt
} from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail,
  isValidClass
} from "../validators";
import { Type } from "class-transformer";
import { parseISO, addYears, isAfter } from "date-fns";
import { roleHasBirthday } from "../roles";
import { languagesArr, Languages } from "../languages";

export interface BaseUserDto {
  id: string;
  username: string;
  displayname: string;
  role: Roles;
  subscribedToWeeklySummary?: boolean;
}

export interface SensitiveUserDto extends BaseUserDto {
  email: string;
  language: Languages;
  children: BlackedUserDto[];
  class?: string;
  birthday?: string;
  managerNotes: string;
}

export type BlackedUserDto = BaseUserDto & Partial<SensitiveUserDto>;

export class UserDto implements BlackedUserDto {
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
  @CustomStringValidator(isValidClass)
  class?: string;

  /**
   * @deprecated
   */
  @IsOptional()
  @IsInt()
  graduationYear?: number;

  @IsISO8601()
  birthday?: string;

  @IsOptional()
  @IsString()
  managerNotes?: string;

  @IsOptional()
  @IsString()
  subscribedToWeeklySummary?: boolean;
}

const ADULTHOOD_AGE = 18;

export const userIsAdult = (u: BlackedUserDto, now = Date.now()) => {
  if (!roleHasBirthday(u.role)) {
    return false;
  }

  if (!u.birthday) {
    throw new Error(
      `Incosistent user found! user '${
        u.id
      }' is required to have a birthday specified.`
    );
  }

  const { birthday } = u;

  const edgeOfAdultHood = addYears(parseISO(birthday), ADULTHOOD_AGE);

  const adultHoodBirthdayIsInPastOrRightNow = !isAfter(edgeOfAdultHood, now);

  return adultHoodBirthdayIsInPastOrRightNow;
};
