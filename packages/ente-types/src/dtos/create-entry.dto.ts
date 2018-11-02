import {
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsNumber
} from "class-validator";
import { DateIsAfter, CustomStringValidator } from "../helpers";
import { twoWeeksBeforeNow, isValidReason } from "../validators";
import { Type } from "class-transformer";

export class CreateEntryDto {
  @DateIsAfter(() => twoWeeksBeforeNow())
  date: Date;

  @IsOptional()
  @DateIsAfter("date")
  dateEnd?: Date;

  @IsOptional()
  @CustomStringValidator(isValidReason)
  reason?: string;

  @IsArray()
  @ValidateNested()
  @Type(() => CreateSlotDto)
  slots: CreateSlotDto[];

  @IsBoolean() forSchool: boolean;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}

export class CreateSlotDto {
  @IsNumber() from: number;

  @IsNumber() to: number;

  @IsUUID() teacherId: string;
}
