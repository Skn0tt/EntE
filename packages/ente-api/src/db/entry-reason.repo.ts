import { EntryReason } from "./entry-reason.entity";
import {
  EntryReasonDto,
  EntryReasonCategory,
  CompetitionPayload,
  ExamenPayload,
  FieldTripPayload,
  OtherPayload
} from "ente-types";
import { User } from "./user.entity";

export class EntryReasonRepo {
  static fromCreationDto(dto: EntryReasonDto): EntryReason {
    const result = new EntryReason();

    result.category = dto.category;

    switch (dto.category) {
      case EntryReasonCategory.COMPETITION: {
        const { from, name, to } = dto.payload as CompetitionPayload;
        result.from = from;
        result.description = name;
        result.to = to;
        break;
      }
      case EntryReasonCategory.EXAMEN: {
        const { from, to, class: _class } = dto.payload as ExamenPayload;
        result.from = from;
        result.to = to;
        result.description = _class;
        break;
      }
      case EntryReasonCategory.FIELD_TRIP: {
        const { from, to, teacherId } = dto.payload as FieldTripPayload;
        result.from = from;
        result.to = to;
        result.teacher = { _id: teacherId } as User;
        break;
      }
      case EntryReasonCategory.OTHER: {
        const { description } = dto.payload as OtherPayload;
        result.description = description!;
        break;
      }
    }

    return result;
  }

  static toDto(v: EntryReason): EntryReasonDto {
    const result = new EntryReasonDto();

    result.category = v.category;

    switch (v.category) {
      case EntryReasonCategory.COMPETITION: {
        const payload: CompetitionPayload = {
          from: v.from!,
          to: v.to!,
          name: v.description!
        };

        result.payload = payload;

        break;
      }

      case EntryReasonCategory.EXAMEN: {
        const payload: ExamenPayload = {
          from: v.from!,
          to: v.to!,
          class: v.description!
        };

        result.payload = payload;

        break;
      }

      case EntryReasonCategory.FIELD_TRIP: {
        const payload: FieldTripPayload = {
          from: v.from!,
          to: v.to!,
          teacherId: !!v.teacher ? v.teacher._id : null
        };

        result.payload = payload;

        break;
      }

      case EntryReasonCategory.OTHER: {
        const payload: OtherPayload = {
          description: v.description!
        };

        result.payload = payload;

        break;
      }
    }

    return result;
  }
}
