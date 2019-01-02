import {
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  ArrayMinSize
} from "class-validator";
import { DateIsAfter } from "../helpers/date-is-after";
import { Type } from "class-transformer";
import { CreateSlotDto } from "./create-slot.dto";
import { daysBeforeNow } from "../validators";
import { UndefinedWhen } from "../helpers/undefined-when";
import { EntryReasonDto } from "./entry-reason.dto";

export class CreateEntryDto {
  @DateIsAfter(() => daysBeforeNow(14))
  date: string;

  @IsOptional()
  @DateIsAfter("date")
  dateEnd?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => CreateSlotDto)
  slots: CreateSlotDto[];

  @IsBoolean() forSchool: boolean;

  @UndefinedWhen(s => s.forSchool === false)
  @IsOptional()
  @ValidateNested()
  @Type(() => EntryReasonDto)
  reason?: EntryReasonDto;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
