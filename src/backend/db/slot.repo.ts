import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets, In } from "typeorm";
import { Some, None, Maybe } from "monet";
import { Slot } from "./slot.entity";
import { UserRepo } from "./user.repo";
import {
  SlotDto,
  entryReasonCategoryIsEducational,
  CreatePrefiledSlotsDto,
} from "@@types";
import {
  PaginationInformation,
  withPagination,
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
      .leftJoinAndSelect("slot.entry", "entry")
      .leftJoinAndSelect("slot.prefiledFor", "prefiledFor")
      .leftJoinAndSelect("entry.student", "student");

  async findAll(paginationInfo: PaginationInformation): Promise<SlotDto[]> {
    const slots = await withPagination(paginationInfo)(
      this._slotQueryWithTeacher()
    ).getMany();
    return slots.map(SlotRepo.toDto);
  }

  async findById(id: string): Promise<Maybe<SlotDto>> {
    const slot = await this._slotQueryWithTeacher().whereInIds(id).getOne();
    return !!slot ? Some(SlotRepo.toDto(slot)) : None();
  }

  async findPrefiledForStudentByIds(
    studentId: string,
    ...ids: string[]
  ): Promise<SlotDto[]> {
    const slot = await this._slotQueryWithTeacher()
      .whereInIds(ids)
      .andWhere("prefiledFor._id = :studentId", { studentId })
      .getMany();

    return slot.map(SlotRepo.toDto);
  }

  async findByStudents(
    ids: string[],
    paginationInfo: PaginationInformation
  ): Promise<SlotDto[]> {
    const slots = await withPagination(paginationInfo)(
      this._slotQueryWithTeacher()
        .where("student._id IN (:ids)", { ids })
        .orWhere("prefiledFor._id IN (:ids)", { ids })
    ).getMany();

    return slots.map(SlotRepo.toDto);
  }

  async findPrefiledForStudents(...studentIds: string[]): Promise<SlotDto[]> {
    const slots = await this._slotQueryWithTeacher()
      .orWhere("prefiledFor._id IN (:studentIds)", { studentIds })
      .getMany();

    return slots.map(SlotRepo.toDto);
  }

  async findPrefiledForStudent(studentId: string) {
    return this.findPrefiledForStudents(studentId);
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
      this._slotQueryWithTeacher()
        .where("student.class = :_class", { _class })
        .orWhere("prefiledFor.class = :_class", { _class })
    ).getMany();

    return slots.map(SlotRepo.toDto);
  }

  async findSlotsSignedOrCreatedSinceHavingTeacher(
    teacherId: string,
    since: Date
  ): Promise<SlotDto[]> {
    const hasBeenSignedDuringLastWeek = new Brackets((qb) => {
      qb.where("entry.managerSignatureDate IS NOT NULL")
        .andWhere("entry.parentSignatureDate IS NOT NULL")
        .andWhere(
          new Brackets((qb) => {
            qb.where("entry.managerSignatureDate > :since", {
              since,
            }).orWhere("entry.parentSignatureDate > :since", { since });
          })
        );
    });

    const hasBeenCreatedOrSignedDuringLastWeek = new Brackets((qb) => {
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

  public async prefiledSlotsExistForStudent(
    studentId: string,
    slotIds: string[]
  ): Promise<boolean> {
    const existingSlots = await this.repo.count({
      where: {
        prefiledFor: { _id: studentId },
        _id: In(slotIds),
      },
    });

    return existingSlots === slotIds.length;
  }

  public async findPrefiledCreatedByTeacher(id: string) {
    const slots = await this._slotQueryWithTeacher()
      .where("teacher._id = :id", { id })
      .getMany();

    return slots.map(SlotRepo.toDto);
  }

  public async createPrefiled(data: CreatePrefiledSlotsDto, teacherId: string) {
    const { studentIds, date, hour_from, hour_to } = data;
    const slots = this.repo.create(
      studentIds.map((studentId) => ({
        date,
        hour_from,
        hour_to,
        prefiledFor: { _id: studentId },
        teacher: { _id: teacherId },
      }))
    );

    const createdSlots = await this.repo.save(slots);

    return createdSlots.map(SlotRepo.toDto);
  }

  public async remove(id: string) {
    await this.repo.delete(id);
  }

  static toDto(slot: Slot): SlotDto {
    const result = new SlotDto();

    result.id = slot._id;

    result.hasBeenPrefiled = !!slot.prefiledFor;

    if (!slot.entry) {
      result.isPrefiled = true;
      result.student = UserRepo.toDto(slot.prefiledFor!);
      result.date = slot.date!;
      result.signed = false;
    }

    if (slot.entry) {
      result.isPrefiled = false;

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
