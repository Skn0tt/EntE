import {
  IsUUID,
  IsDate,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsISO8601
} from "class-validator";
import { DateIsAfter } from "../helpers/date-is-after";
import { SlotDto } from "./slot.dto";
import { UserDto } from "./user.dto";
import { Type } from "class-transformer";
import { UndefinedWhen } from "../helpers/undefined-when";
import { EntryReasonDto } from "./entry-reason.dto";

export class EntryDto {
  @IsUUID("4") id: string;

  @IsISO8601()
  date: string;

  @IsOptional()
  @IsISO8601()
  @DateIsAfter("date")
  dateEnd?: string;

  @IsBoolean() forSchool: boolean;

  @UndefinedWhen(s => s.forSchool === false)
  @IsOptional()
  @ValidateNested()
  @Type(() => EntryReasonDto)
  reason?: EntryReasonDto;

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
