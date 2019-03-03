import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsISO8601
} from "class-validator";
import { Type } from "class-transformer";
import { CreateSlotDto } from "./create-slot.dto";
import { EntryReasonDto } from "./entry-reason.dto";

export class CreateEntryDto {
  @IsISO8601()
  date: string;

  @IsOptional()
  @IsISO8601()
  dateEnd?: string;

  @IsArray()
  @ValidateNested()
  @Type(() => CreateSlotDto)
  slots: CreateSlotDto[];

  @ValidateNested()
  @Type(() => EntryReasonDto)
  reason: EntryReasonDto;

  @IsOptional()
  @IsUUID()
  studentId?: string;
}
