import {
  IsISO8601,
  IsInt,
  Max,
  Min,
  IsUUID,
  IsAlpha,
  IsArray,
  MinLength
} from "class-validator";

export class CreatePrefiledSlotDto {
  @IsISO8601()
  date: string;

  @IsInt()
  @Min(1)
  @Max(13)
  hour_from: number;

  @IsInt()
  @Min(1)
  @Max(13)
  hour_to: number;

  @MinLength(1)
  @IsUUID(undefined, { each: true })
  studentIds: string[];
}
