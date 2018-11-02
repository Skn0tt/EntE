import { Roles, rolesArr } from "ente-types";
import { IsOptional, IsIn, IsUUID, IsBoolean } from "class-validator";
import { CustomStringValidator } from "../helpers";
import { isValidDisplayname, isValidEmail } from "../validators";

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
  @IsUUID("4", { each: true })
  children?: string[];

  @IsOptional()
  @IsBoolean()
  isAdult?: boolean;
}
