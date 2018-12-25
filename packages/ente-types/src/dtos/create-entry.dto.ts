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

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
