import {
  IsUUID,
  IsDate,
  IsOptional,
  IsBoolean,
  ValidateNested
} from "class-validator";
import { DateIsAfter } from "../helpers";
import { SlotDto } from "./slot.dto";
import { UserDto } from "./user.dto";
import { Type } from "class-transformer";

export class EntryDto {
  @IsUUID("4") id: string;

  @IsDate() date: Date;

  @IsOptional()
  @IsDate()
  @DateIsAfter("date")
  dateEnd?: Date;

  @IsBoolean() forSchool: boolean;

  @IsBoolean() signedManager: boolean;

  @IsBoolean() signedParent: boolean;

  @Type(() => SlotDto)
  @ValidateNested({ each: true })
  slots: SlotDto[];

  @Type(() => UserDto)
  @ValidateNested()
  student: UserDto;

  @IsDate() createdAt: Date;

  @IsDate() updatedAt: Date;
}
