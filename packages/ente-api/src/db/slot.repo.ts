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
      .leftJoinAndSelect("slot.entry", "entry")
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
      this.repo
        .createQueryBuilder("slot")
        .leftJoinAndSelect("slot.entry", "entry")
        .leftJoinAndSelect("entry.student", "student")
        .leftJoinAndSelect("slot.teacher", "teacher")
        .where("student._id IN (:ids)", { ids })
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

  async findByYearOfStudent(
    year: number,
    paginationInfo: PaginationInformation
  ): Promise<SlotDto[]> {
    const slots = await withPagination(paginationInfo)(
      this._slotQueryWithTeacher().where("student.graduationYear = :year", {
        year
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
    result.date = !!slot.entry.dateEnd ? slot.date! : slot.entry.date;
    result.from = slot.hour_from;
    result.to = slot.hour_to;
    result.teacher =
      slot.teacher === null ? null : UserRepo.toDto(slot.teacher);
    result.student = UserRepo.toDto(slot.entry.student);
    result.forSchool = entryReasonCategoryIsEducational(
      slot.entry.reason.category
    );
    result.isEducational = result.forSchool;
    result.signed =
      !!slot.entry.managerSignatureDate && !!slot.entry.parentSignatureDate;

    return result;
  }
}
