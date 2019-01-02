import {
  IsInt,
  Max,
  Min,
  IsUUID,
  IsOptional,
  IsISO8601
} from "class-validator";
import { CompareToProperty } from "../helpers";

export class CreateSlotDto {
  @IsInt()
  @Min(1)
  @Max(13)
  from: number;

  @IsInt()
  @Min(1)
  @Max(13)
  @CompareToProperty("from", (to, from) => to >= from)
  to: number;

  @IsUUID() teacherId: string;

  @IsOptional()
  @IsISO8601()
  date?: string;
}
