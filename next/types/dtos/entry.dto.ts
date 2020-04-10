import {
  IsUUID,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsISO8601
} from "class-validator";
import { SlotDto, BlackedSlotDto } from "./slot.dto";
import { UserDto, BlackedUserDto } from "./user.dto";
import { Type } from "class-transformer";
import { EntryReasonDto } from "./entry-reason.dto";

export interface BlackedEntryDto {
  id: string;
  date: string;
  dateEnd?: string;
  reason: EntryReasonDto;
  signedManager: boolean;
  signedManagerDate: string | null;
  signedParent: boolean;
  signedParentDate: string | null;
  slots: BlackedSlotDto[];
  student: BlackedUserDto;
  managerReachedOut: boolean;
  createdAt: string;
  updatedAt: string;
}

export class EntryDto implements BlackedEntryDto {
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

  @IsOptional()
  @IsISO8601()
  signedManagerDate: string | null;

  @IsBoolean() signedParent: boolean;

  @IsOptional()
  @IsISO8601()
  signedParentDate: string | null;

  @IsBoolean()
  managerReachedOut: boolean;

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
