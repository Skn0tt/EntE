import {
  IsUUID,
  ValidateNested,
  IsDate,
  IsInt,
  IsBoolean,
  IsOptional,
  IsISO8601,
} from "class-validator";
import { UserDto, BlackedUserDto } from "./user.dto";
import { Type } from "class-transformer";

export interface BlackedSlotDto {
  id: string;
  isPrefiled: boolean;
  teacher: BlackedUserDto | null;
  student: BlackedUserDto;
  date: string;
  from: number;
  to: number;
  signed: boolean;
  isEducational: boolean;
  forSchool: boolean; // remove in future version
}

export class SlotDto implements BlackedSlotDto {
  @IsUUID("4") id: string;

  @IsBoolean()
  isPrefiled: boolean = false;

  @IsOptional()
  @Type(() => UserDto)
  @ValidateNested()
  teacher: UserDto | null;

  @Type(() => UserDto)
  @ValidateNested()
  student: UserDto;

  @IsISO8601() date: string;

  @IsInt() from: number;

  @IsDate() to: number;

  @IsBoolean() signed: boolean;

  @IsBoolean() forSchool: boolean;

  @IsBoolean() isEducational: boolean;
}
