import { Injectable, Inject, LoggerService } from "@nestjs/common";
import { Validation, Fail, Success } from "monet";
import { SlotRepo } from "../db/slot.repo";
import {
  Roles,
  SlotDto,
  daysBeforeNow,
  BlackedSlotDto,
  UserDto,
  CreatePrefiledSlotsDto,
  TEACHING_ROLES,
  CreatePrefiledSlotDtoValidator,
} from "@@types";
import { UserRepo } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { WinstonLoggerService } from "../winston-logger.service";
import { RequestContextUser } from "../helpers/request-context";
import { PaginationInformation } from "../helpers/pagination-info";
import { UsersService } from "../users/users.service";
import * as _ from "lodash";

export enum FindOneSlotFailure {
  SlotNotFound,
  ForbiddenForUser,
}

export enum CreatePrefiledSlotsFailure {
  ForbiddenForUser,
  InvalidDto,
}

export enum DeletePrefiledSlotsFailure {
  ForbiddenForUser,
  NotFound,
  SlotIsNotPrefiled,
}

@Injectable()
export class SlotsService {
  constructor(
    @Inject(SlotRepo) private readonly slotRepo: SlotRepo,
    @Inject(UserRepo) private readonly userRepo: UserRepo,
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  private async _findAll(
    requestingUser: RequestContextUser,
    paginationInfo: PaginationInformation
  ): Promise<SlotDto[]> {
    switch (requestingUser.role) {
      case Roles.MANAGER:
        const user = (await requestingUser.getDto()).some();
        return await this.slotRepo.findByClassOfStudent(
          user.class!,
          paginationInfo
        );

      case Roles.PARENT:
        return await this.slotRepo.findByStudents(
          requestingUser.childrenIds,
          paginationInfo
        );

      case Roles.TEACHER:
        return await this.slotRepo.findHavingTeacher(
          requestingUser.id,
          paginationInfo
        );

      case Roles.STUDENT:
        return await this.slotRepo.findByStudents(
          [requestingUser.id],
          paginationInfo
        );
    }
  }

  public async findAll(
    requestingUser: RequestContextUser,
    paginationInfo: PaginationInformation
  ) {
    const r = await this._findAll(requestingUser, paginationInfo);
    return r.map((s) => SlotsService.blackenDto(s, requestingUser));
  }

  private async _findOne(
    id: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<FindOneSlotFailure, SlotDto>> {
    const slot = await this.slotRepo.findById(id);

    const user =
      requestingUser.role === Roles.MANAGER &&
      (await requestingUser.getDto()).some();

    return slot.cata(
      () => Fail(FindOneSlotFailure.SlotNotFound),
      (s) => {
        switch (requestingUser.role) {
          case Roles.MANAGER:
            const isSameYear = s.student.class === (user as UserDto).class!;
            if (!isSameYear) {
              return Fail(FindOneSlotFailure.ForbiddenForUser);
            }
            break;

          case Roles.PARENT:
            const slotMatchesUser = requestingUser.childrenIds.includes(
              s.student.id
            );
            if (!slotMatchesUser) {
              return Fail(FindOneSlotFailure.ForbiddenForUser);
            }
            break;

          case Roles.STUDENT:
            const slotBelongsStudent = s.student.id === requestingUser.id;
            if (!slotBelongsStudent) {
              return Fail(FindOneSlotFailure.ForbiddenForUser);
            }
            break;

          case Roles.TEACHER:
            const slotBelongsTeacher =
              !!s.teacher && s.teacher.id === requestingUser.id;
            if (!slotBelongsTeacher) {
              return Fail(FindOneSlotFailure.ForbiddenForUser);
            }
            break;
        }

        return Success(s);
      }
    );
  }

  public async findOne(id: string, requestingUser: RequestContextUser) {
    const r = await this._findOne(id, requestingUser);
    return r.map((r) => SlotsService.blackenDto(r, requestingUser));
  }

  public async createPrefiled(
    slots: CreatePrefiledSlotsDto,
    requestingUser: RequestContextUser
  ): Promise<Validation<CreatePrefiledSlotsFailure, BlackedSlotDto[]>> {
    if (!TEACHING_ROLES.includes(requestingUser.role)) {
      return Fail(CreatePrefiledSlotsFailure.ForbiddenForUser);
    }

    const isValidDto = CreatePrefiledSlotDtoValidator.validate(slots);
    if (!isValidDto) {
      return Fail(CreatePrefiledSlotsFailure.InvalidDto);
    }

    const studentIdsAreStudents = await this.userRepo.hasUsersWithRole(
      [Roles.STUDENT],
      ...slots.studentIds
    );
    if (!studentIdsAreStudents) {
      return Fail(CreatePrefiledSlotsFailure.InvalidDto);
    }

    const result = await this.slotRepo.createPrefiled(slots, requestingUser.id);

    await this.dispatchPrefiledCreationNotification(slots, requestingUser.id);

    return Success(
      result.map((s) => SlotsService.blackenDto(s, requestingUser))
    );
  }

  async dispatchPrefiledCreationNotification(
    data: CreatePrefiledSlotsDto,
    teacherId: string
  ) {
    const users = await this.userRepo.findByIds(teacherId, ...data.studentIds);
    const [[teacher], students] = _.partition(users, (u) =>
      TEACHING_ROLES.includes(u.role)
    );

    await this.emailService.dispatchSlotPrefiledNotification(
      data,
      students,
      teacher
    );
  }

  public async deletePrefiled(
    id: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<DeletePrefiledSlotsFailure, true>> {
    if (!TEACHING_ROLES.includes(requestingUser.role)) {
      return Fail(DeletePrefiledSlotsFailure.ForbiddenForUser);
    }

    const slot = await this.slotRepo.findById(id);
    if (slot.isNone()) {
      return Fail(DeletePrefiledSlotsFailure.NotFound);
    }

    const { isPrefiled, teacher } = slot.some();
    if (!isPrefiled) {
      return Fail(DeletePrefiledSlotsFailure.SlotIsNotPrefiled);
    }

    const teacherId = !!teacher && teacher.id;
    if (teacherId !== requestingUser.id) {
      return Fail(DeletePrefiledSlotsFailure.ForbiddenForUser);
    }

    await this.slotRepo.remove(id);
    return Success<DeletePrefiledSlotsFailure, true>(true);
  }

  async dispatchWeeklySummary() {
    this.logger.log("Starting to dispatch the weekly summary.");
    const teachingUsers = await this.userRepo.findWeeklySummaryRecipients();
    await Promise.all(
      teachingUsers.map(async (teacher) => {
        const slots = await this.slotRepo.findSlotsSignedOrCreatedSinceHavingTeacher(
          teacher.id,
          daysBeforeNow(7)
        );
        await this.emailService.dispatchWeeklySummary(teacher, slots);
      })
    );
    this.logger.log("Weekly summary successfully dispatched.");
  }

  static blackenDto(
    slot: SlotDto,
    requestingUser: RequestContextUser
  ): BlackedSlotDto {
    const { teacher, student } = slot;
    return {
      ...slot,
      student: UsersService.blackenDto(student, requestingUser),
      teacher: !!teacher
        ? UsersService.blackenDto(teacher, requestingUser)
        : null,
    };
  }
}
