import {
  IsUUID,
  ValidateNested,
  IsDate,
  IsInt,
  IsBoolean
} from "class-validator";
import { UserDto } from "./user.dto";
import { Type } from "class-transformer";

export class SlotDto {
  @IsUUID("4") id: string;

  @Type(() => UserDto)
  @ValidateNested()
  teacher: UserDto;

  @Type(() => UserDto)
  @ValidateNested()
  student: UserDto;

  @IsDate() date: Date;

  @IsInt() from: number;

  @IsDate() to: number;

  @IsBoolean() signed: boolean;
}
