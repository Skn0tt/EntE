import {
  IsIn,
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  ValidateNested,
  IsUUID,
  Min,
  Max,
  IsISO8601,
} from "class-validator";
import { enumToArray } from "../helpers/enum-to-array";
import { Type } from "class-transformer";
import * as _ from "lodash";

export enum EntryReasonCategory {
  EXAMEN = "examen",
  FIELD_TRIP = "field_trip",
  COMPETITION = "competition",
  OTHER_EDUCATIONAL = "other_educational",
  ILLNESS = "illness",
  OTHER_NON_EDUCATIONAL = "other_non_educational",
}

export const entryReasonCategoryArray = enumToArray(EntryReasonCategory);

export const REASON_CATEGORIES_EDUCATIONAL = [
  EntryReasonCategory.EXAMEN,
  EntryReasonCategory.FIELD_TRIP,
  EntryReasonCategory.COMPETITION,
  EntryReasonCategory.OTHER_EDUCATIONAL,
];

export const REASON_CATEGORIES_NON_EDUCATIONAL = [
  EntryReasonCategory.ILLNESS,
  EntryReasonCategory.OTHER_NON_EDUCATIONAL,
];

export const REASON_CATEGORIES_DISALLOWED_IN_MULTIDAY = [
  EntryReasonCategory.EXAMEN,
  EntryReasonCategory.COMPETITION,
];

export const REASON_CATEGORIES_ALLOWED_IN_MULTIDAY = [
  EntryReasonCategory.FIELD_TRIP,
  EntryReasonCategory.ILLNESS,
  EntryReasonCategory.OTHER_EDUCATIONAL,
  EntryReasonCategory.OTHER_NON_EDUCATIONAL,
];

export const REASON_CATEGORIES_WITH_TEACHER_ID = [
  EntryReasonCategory.FIELD_TRIP,
  EntryReasonCategory.EXAMEN,
];

export const entryReasonCategoryIsAllowedInMultiday = (
  c: EntryReasonCategory
) => REASON_CATEGORIES_ALLOWED_IN_MULTIDAY.includes(c);

export const entryReasonCategoryHasTeacherId = (c: EntryReasonCategory) =>
  REASON_CATEGORIES_WITH_TEACHER_ID.includes(c);

export const entryReasonCategoryIsEducational = (c: EntryReasonCategory) =>
  REASON_CATEGORIES_EDUCATIONAL.includes(c);

export const entryReasonIsEducational = (v: EntryReasonDto) => {
  return entryReasonCategoryIsEducational(v.category);
};

export type EntryReasonPayload =
  | OtherNonEducationalPayload
  | OtherEducationalPayload
  | ExamenPayload
  | FieldTripPayload
  | IllnessPayload
  | CompetitionPayload;

export class IllnessPayload {
  @IsOptional()
  _mock_property?: never;
}

export class ExamenPayload {
  @IsInt()
  @Min(1)
  @Max(13)
  from: number;

  @IsInt()
  @Min(1)
  @Max(13)
  to: number;

  @IsOptional()
  @IsUUID("4")
  teacherId: string | null;
}

abstract class OtherPayload {
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class OtherEducationalPayload extends OtherPayload {}
export class OtherNonEducationalPayload extends OtherPayload {}

export class FieldTripPayload {
  @IsInt()
  @Min(1)
  @Max(13)
  from: number;

  @IsInt()
  @Min(1)
  @Max(13)
  to: number;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @IsUUID("4")
  teacherId: string | null;
}

export class CompetitionPayload {
  @IsInt()
  @Min(1)
  @Max(13)
  from: number;

  @IsInt()
  @Min(1)
  @Max(13)
  to: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class EntryReasonDto {
  @IsIn(entryReasonCategoryArray)
  category: EntryReasonCategory;

  @ValidateNested()
  @Type((v) => {
    const { category } = v!.newObject;
    switch (category) {
      case EntryReasonCategory.COMPETITION:
        return CompetitionPayload;
      case EntryReasonCategory.EXAMEN:
        return ExamenPayload;
      case EntryReasonCategory.FIELD_TRIP:
        return FieldTripPayload;
      case EntryReasonCategory.OTHER_EDUCATIONAL:
        return OtherEducationalPayload;
      case EntryReasonCategory.OTHER_NON_EDUCATIONAL:
        return OtherNonEducationalPayload;
      case EntryReasonCategory.ILLNESS:
        return IllnessPayload;
    }
    throw new Error("category unknown");
  })
  payload: EntryReasonPayload;
}
