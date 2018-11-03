import {
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsNumber,
  IsDate
} from "class-validator";
import { DateIsAfter } from "../helpers";
import { twoWeeksBeforeNow } from "../validators";
import { Type } from "class-transformer";

export class CreateEntryDto {
  @DateIsAfter(() => twoWeeksBeforeNow())
  date: Date;

  @IsOptional()
  @DateIsAfter("date")
  dateEnd?: Date;

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
  @IsDate() date: Date;

  @IsNumber() from: number;

  @IsNumber() to: number;

  @IsUUID() teacherId: string;
}
