import {
  IsDate,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsOptional
} from "class-validator";
import { CompareToProperty } from "../helpers/compare-to-property";
import { Type } from "class-transformer";

export class CreateSlotDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

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
