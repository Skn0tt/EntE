import {
  IsUUID,
  IsDate,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsISO8601
} from "class-validator";
import { SlotDto } from "./slot.dto";
import { UserDto } from "./user.dto";
import { Type } from "class-transformer";
import { EntryReasonDto } from "./entry-reason.dto";

export class EntryDto {
  @IsUUID("4") id: string;

  @IsISO8601()
  date: string;

  @IsOptional()
  @IsISO8601()
  dateEnd?: string;

  @ValidateNested()
  @Type(() => EntryReasonDto)
  reason: EntryReasonDto;

  @IsBoolean() signedManager: boolean;

  @IsBoolean() signedParent: boolean;

  @Type(() => SlotDto)
  @ValidateNested({ each: true })
  slots: SlotDto[];

  @Type(() => UserDto)
  @ValidateNested()
  student: UserDto;

  @IsISO8601()
  createdAt: string;

  @IsISO8601()
  updatedAt: string;
}
