import {
  IsInt,
  Max,
  Min,
  IsUUID,
  IsOptional,
  IsISO8601,
} from "class-validator";

export class CreateSlotDto {
  @IsInt()
  @Min(1)
  @Max(13)
  from: number;

  @IsInt()
  @Min(1)
  @Max(13)
  to: number;

  @IsUUID() teacherId: string;

  @IsOptional()
  @IsISO8601()
  date?: string;
}
