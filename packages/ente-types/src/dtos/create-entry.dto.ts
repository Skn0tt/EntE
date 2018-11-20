import {
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  ArrayMinSize
} from "class-validator";
import { DateIsAfter } from "../helpers/date-is-after";
import { twoWeeksBeforeNow } from "../validators/entry";
import { Type } from "class-transformer";
import { CreateSlotDto } from "./create-slot.dto";

export class CreateEntryDto {
  @DateIsAfter(() => twoWeeksBeforeNow())
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @DateIsAfter("date")
  @Type(() => Date)
  dateEnd?: Date;

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
