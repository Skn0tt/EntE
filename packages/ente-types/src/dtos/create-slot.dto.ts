import {
  IsDate,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsOptional,
  IsISO8601
} from "class-validator";
import { CompareToProperty } from "../helpers/compare-to-property";

export class CreateSlotDto {
  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsNumber()
  @Min(1)
  @Max(13)
  from: number;

  @IsNumber()
  @Min(1)
  @Max(13)
  @CompareToProperty("from", (to, from) => to >= from)
  to: number;

  @IsUUID() teacherId: string;
}
