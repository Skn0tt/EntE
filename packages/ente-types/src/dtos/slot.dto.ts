import {
  IsUUID,
  ValidateNested,
  IsDate,
  IsInt,
  IsBoolean,
  IsOptional
} from "class-validator";
import { UserDto } from "./user.dto";
import { Type } from "class-transformer";

export class SlotDto {
  @IsUUID("4") id: string;

  @IsOptional()
  @Type(() => UserDto)
  @ValidateNested()
  teacher: UserDto | null;

  @Type(() => UserDto)
  @ValidateNested()
  student: UserDto;

  @IsDate() date: Date;

  @IsInt() from: number;

  @IsDate() to: number;

  @IsBoolean() signed: boolean;
}
