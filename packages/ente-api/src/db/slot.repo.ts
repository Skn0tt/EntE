import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";
import { Some, None, Maybe } from "monet";
import { Slot } from "./slot.entity";
import { UserRepo } from "./user.repo";
import { SlotDto, entryReasonCategoryIsEducational } from "ente-types";
import {
  PaginationInformation,
  withPagination
} from "../helpers/pagination-info";

@Injectable()
export class SlotRepo {
  constructor(
    @InjectRepository(Slot) private readonly repo: Repository<Slot>
  ) {}

  private _slotQueryWithTeacher = () =>
    this.repo
      .createQueryBuilder("slot")
      .leftJoinAndSelect("slot.teacher", "teacher")
      .innerJoin("slot.entry", "entry")
      .leftJoinAndSelect("entry.student", "student");

  async findAll(paginationInfo: PaginationInformation): Promise<SlotDto[]> {
    const slots = await withPagination(paginationInfo)(
      this._slotQueryWithTeacher()
    ).getMany();
    return slots.map(SlotRepo.toDto);
  }

  async findById(id: string): Promise<Maybe<SlotDto>> {
    const slot = await this._slotQueryWithTeacher()
      .whereInIds(id)
      .getOne();
    return !!slot ? Some(SlotRepo.toDto(slot)) : None();
  }

  async findByStudents(
    ids: string[],
    paginationInfo: PaginationInformation
  ): Promise<SlotDto[]> {
    const slots = await withPagination(paginationInfo)(
      this._slotQueryWithTeacher().where("student._id IN (:ids)", { ids })
    ).getMany();

    return slots.map(SlotRepo.toDto);
  }

  async findHavingTeacher(
    id: string,
    paginationInfo: PaginationInformation
  ): Promise<SlotDto[]> {
    const slots = await withPagination(paginationInfo)(
      this._slotQueryWithTeacher().where("slot.teacher = :id", { id })
    ).getMany();
    return slots.map(SlotRepo.toDto);
  }

  async findByClassOfStudent(
    _class: string,
    paginationInfo: PaginationInformation
  ): Promise<SlotDto[]> {
    const slots = await withPagination(paginationInfo)(
      this._slotQueryWithTeacher().where("student.class = :_class", {
        _class
      })
    ).getMany();

    return slots.map(SlotRepo.toDto);
  }

  async findSlotsSignedOrCreatedSinceHavingTeacher(
    teacherId: string,
    since: Date
  ): Promise<SlotDto[]> {
    const hasBeenSignedDuringLastWeek = new Brackets(qb => {
      qb.where("entry.managerSignatureDate IS NOT NULL")
        .andWhere("entry.parentSignatureDate IS NOT NULL")
        .andWhere(
          new Brackets(qb => {
            qb.where("entry.managerSignatureDate > :since", { since }).orWhere(
              "entry.parentSignatureDate > :since",
              { since }
            );
          })
        );
    });

    const hasBeenCreatedOrSignedDuringLastWeek = new Brackets(qb => {
      qb.where("entry.createdAt > :since", { since }).orWhere(
        hasBeenSignedDuringLastWeek
      );
    });

    const slots = await this._slotQueryWithTeacher()
      .where("slot.teacher = :id", { id: teacherId })
      .andWhere(hasBeenCreatedOrSignedDuringLastWeek)
      .getMany();

    return slots.map(SlotRepo.toDto);
  }

  static toDto(slot: Slot): SlotDto {
    const result = new SlotDto();

    result.id = slot._id;

    if (slot.entry) {
      result.date = !!slot.entry.dateEnd ? slot.date! : slot.entry.date;

      result.student = UserRepo.toDto(slot.entry.student);

      result.forSchool = entryReasonCategoryIsEducational(
        slot.entry.reason.category
      );

      result.isEducational = result.forSchool;

      result.signed =
        !!slot.entry.managerSignatureDate && !!slot.entry.parentSignatureDate;
    }

    result.from = slot.hour_from;
    result.to = slot.hour_to;
    result.teacher =
      slot.teacher === null ? null : UserRepo.toDto(slot.teacher);

    return result;
  }
}

interface PrefiledSlotsCreate {
  date: string;
  hour_from: number;
  hour_to: number;
  studentIds: string[];
}

@Injectable()
export class PrefiledSlotRepo {
  constructor(
    @InjectRepository(Slot) private readonly repo: Repository<Slot>
  ) {}

  private _slotQueryWithTeacher = () =>
    this.repo
      .createQueryBuilder("slot")
      .leftJoinAndSelect("slot.teacher", "teacher")
      .innerJoin("slot.prefiled_for", "student");

  public async findForStudents(ids: string[]) {
    const slots = await this._slotQueryWithTeacher()
      .where("student._id IN (:ids)", { ids })
      .getMany();

    return slots.map(PrefiledSlotRepo.toDto);
  }

  public async attachToEntry(slotIds: string[], entryId: string) {
    await this.repo.update(slotIds, {
      entry: { _id: entryId },
      prefiled_for: null
    });
  }

  public async create(data: PrefiledSlotsCreate, teacherId: string) {
    const { studentIds, date, hour_from, hour_to } = data;
    const slots = this.repo.create(
      studentIds.map(studentId => ({
        date,
        hour_from,
        hour_to,
        prefiled_for: { _id: studentId },
        teacher: { _id: teacherId }
      }))
    );

    const createdSlots = await this.repo.save(slots);

    return createdSlots.map(PrefiledSlotRepo.toDto);
  }

  static toDto(slot: Slot) {
    const result = SlotRepo.toDto(slot);

    if (slot.prefiled_for) {
      result.student = UserRepo.toDto(slot.prefiled_for);
    }

    return result;
  }
}
