import {
  IsISO8601,
  IsInt,
  Max,
  Min,
  IsUUID,
  MinLength,
  IsArray,
  IsNotEmpty,
  ArrayNotEmpty
} from "class-validator";

export class CreatePrefiledSlotsDto {
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

  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  studentIds: string[];
}
