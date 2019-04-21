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
import { isBefore, parseISO, subYears, addYears, isAfter } from "date-fns";
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

const ADULTHOOD_AGE = 18;

export const userIsAdult = (u: UserDto, now = Date.now()) => {
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
