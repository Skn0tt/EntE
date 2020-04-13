import { IsOptional, IsIn, IsISO8601, IsBoolean } from "class-validator";
import { CustomStringValidator } from "../helpers/custom-string-validator";
import {
  isValidDisplayname,
  isValidEmail,
  isValidUuidOrUsername,
  isValidUsername,
  isValidClass,
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
  @IsIn(languagesArr)
  language?: Languages;

  @IsOptional()
  @CustomStringValidator(isValidUuidOrUsername, { each: true })
  children?: string[];

  @IsOptional()
  @IsISO8601()
  birthday?: string;

  @IsOptional()
  @CustomStringValidator(isValidClass)
  class?: string;

  @IsOptional()
  @IsBoolean()
  subscribedToWeeklySummary?: boolean;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
