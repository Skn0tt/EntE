import {
  IsUUID,
  IsDate,
  IsOptional,
  IsBoolean,
  ValidateNested
} from "class-validator";
import { DateIsAfter } from "../helpers/date-is-after";
import { SlotDto } from "./slot.dto";
import { UserDto } from "./user.dto";
import { Type } from "class-transformer";

export class EntryDto {
  @IsUUID("4") id: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @Type(() => Date)
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

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
