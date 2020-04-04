import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Maybe, Some, None } from "monet";
import { Entry } from "./entry.entity";
import { User } from "./user.entity";
import { Slot } from "./slot.entity";
import { UserRepo } from "./user.repo";
import { SlotRepo } from "./slot.repo";
import { EntryDto, CreateEntryDto, dateToIsoString } from "ente-types";
import {
  PaginationInformation,
  withPagination
} from "../helpers/pagination-info";
import { EntryReasonRepo } from "./entry-reason.repo";
import { parseISO } from "date-fns";

@Injectable()
export class EntryRepo {
  constructor(
    @InjectRepository(Entry) private readonly repo: Repository<Entry>
  ) {}

  private _studentsQuery = () =>
    this.repo
      .createQueryBuilder("entry")
      .leftJoinAndSelect("entry.student", "student")
      .leftJoinAndSelect("entry.reason.teacher", "reasonTeacher")
      .leftJoinAndSelect("entry.slots", "slot")
      .leftJoinAndSelect("slot.teacher", "teacher")
      .leftJoinAndSelect("slot.entry", "slotEntry")
      .leftJoinAndSelect("slotEntry.student", "slotEntryStudent");

  async findAll(paginationInfo: PaginationInformation): Promise<EntryDto[]> {
    const entries = await withPagination(paginationInfo)(
      this._studentsQuery()
    ).getMany();
    return entries.map(EntryRepo.toDto);
  }

  async findByStudents(
    studentIds: string[],
    paginationInfo: PaginationInformation
  ): Promise<EntryDto[]> {
    const entries = await withPagination(paginationInfo)(
      this._studentsQuery().where("student._id IN (:studentIds)", {
        studentIds
      })
    ).getMany();

    return entries.map(EntryRepo.toDto);
  }

  async findById(id: string): Promise<Maybe<EntryDto>> {
    const entry = await this._studentsQuery()
      .whereInIds(id)
      .getOne();
    return !!entry ? Some(EntryRepo.toDto(entry)) : None();
  }

  async findByClass(
    _class: string,
    paginationInfo: PaginationInformation
  ): Promise<EntryDto[]> {
    const entry = await withPagination(paginationInfo)(
      this._studentsQuery().where("student.class = :_class", { _class })
    ).getMany();

    return entry.map(EntryRepo.toDto);
  }

  async createEntry(
    dto: CreateEntryDto,
    config: { signedByParent: boolean } = {
      signedByParent: false
    }
  ): Promise<EntryDto> {
    const entry = await this.repo.manager.transaction(
      async (manager): Promise<Entry> => {
        const [student] = await manager.findByIds(User, [dto.studentId], {
          relations: ["children"]
        });

        const isMultiDayEntry = !!dto.dateEnd;

        const newEntry = await manager.create(Entry, {
          student,
          reason: !!dto.reason
            ? EntryReasonRepo.fromCreationDto(dto.reason)
            : undefined,
          parentSignatureDate: config.signedByParent
            ? dateToIsoString(Date.now())
            : null,
          date: dto.date,
          dateEnd: dto.dateEnd,
          slots: await Promise.all(
            dto.slots.map(async s => {
              const [teacher] = await manager.findByIds(User, [s.teacherId], {
                relations: ["children"]
              });
              return await manager.create(Slot, {
                date: isMultiDayEntry
                  ? dateToIsoString(parseISO(s.date!))
                  : null,
                hour_from: s.from,
                hour_to: s.to,
                teacher
              });
            })
          )
        });

        newEntry.slots.forEach((_ignored, i) => {
          newEntry.slots[i].entry = newEntry;
        });

        await manager.save(Entry, newEntry);
        await manager.save(Slot, newEntry.slots);

        return newEntry;
      }
    );

    return EntryRepo.toDto(entry);
  }

  async setSignedManager(id: string, value: boolean) {
    if (value) {
      await this.repo.query(
        `UPDATE entry
        SET managerSignatureDate = ?
        WHERE _id = ?
        AND managerSignatureDate IS NULL;
        `,
        [dateToIsoString(Date.now()), id]
      );
    } else {
      await this.repo.update(id, { managerSignatureDate: null });
    }
  }

  async setSignedParent(id: string, value: boolean) {
    if (value) {
      await this.repo.query(
        `UPDATE entry
        SET parentSignatureDate = ?
        WHERE _id = ?
        AND parentSignatureDate IS NULL;
        `,
        [dateToIsoString(Date.now()), id]
      );
    } else {
      await this.repo.update(id, { parentSignatureDate: null });
    }
  }

  async delete(id: string) {
    await this.repo.delete({ _id: id });
  }

  async deleteAll() {
    await this.repo
      .createQueryBuilder()
      .delete()
      .execute();
  }

  static toDto(entry: Entry): EntryDto {
    const result = new EntryDto();

    result.id = entry._id;
    result.date = entry.date;
    result.dateEnd = entry.dateEnd || undefined;
    result.slots = entry.slots.map(SlotRepo.toDto);
    result.student = UserRepo.toDto(entry.student);
    result.managerReachedOut = !!entry.managerReachedOut;
    result.createdAt = entry.createdAt.toISOString();
    result.updatedAt = entry.updatedAt.toISOString();
    result.signedManager = !!entry.managerSignatureDate;
    result.signedParent = !!entry.parentSignatureDate;
    result.signedManagerDate = entry.managerSignatureDate;
    result.signedParentDate = entry.parentSignatureDate;
    result.reason = EntryReasonRepo.toDto(entry.reason);

    return result;
  }
}
