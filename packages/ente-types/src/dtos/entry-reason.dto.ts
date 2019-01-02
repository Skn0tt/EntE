import {
  IsIn,
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  ValidateNested,
  IsUUID
} from "class-validator";
import { enumToArray } from "../helpers/enum-to-array";
import { Type } from "class-transformer";

export enum EntryReasonCategory {
  EXAMEN = "examen",
  FIELD_TRIP = "field_trip",
  COMPETITION = "competition",
  OTHER = "other"
}

export const entryReasonCategoryArray = enumToArray(EntryReasonCategory);

export type EntryReasonPayload =
  | ExamenPayload
  | FieldTripPayload
  | CompetitionPayload
  | OtherPayload;

export class ExamenPayload {
  @IsInt()
  from: number;

  @IsInt()
  to: number;

  @IsString()
  @IsNotEmpty()
  class: string;
}

export class OtherPayload {
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class FieldTripPayload {
  @IsInt()
  from: number;

  @IsInt()
  to: number;

  @IsOptional()
  @IsUUID("4")
  teacherId: string | null;
}

export class CompetitionPayload {
  @IsInt()
  from: number;

  @IsInt()
  to: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class EntryReasonDto {
  @IsIn(entryReasonCategoryArray)
  category: EntryReasonCategory;

  @ValidateNested()
  @Type(v => {
    const { category } = v!.newObject;
    switch (category) {
      case EntryReasonCategory.COMPETITION:
        return CompetitionPayload;
      case EntryReasonCategory.EXAMEN:
        return ExamenPayload;
      case EntryReasonCategory.FIELD_TRIP:
        return FieldTripPayload;
      case EntryReasonCategory.OTHER:
        return OtherPayload;
    }
    throw new Error("category unknown");
  })
  payload: EntryReasonPayload;
}
