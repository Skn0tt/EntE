import { Injectable, Inject, LoggerService } from "@nestjs/common";
import { Validation, Fail, Success } from "monet";
import { SlotRepo } from "../db/slot.repo";
import {
  Roles,
  SlotDto,
  daysBeforeNow,
  TEACHING_ROLES,
  BlackedSlotDto,
  UserDto
} from "ente-types";
import { UserRepo } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { WinstonLoggerService } from "../winston-logger.service";
import { RequestContextUser } from "../helpers/request-context";
import { PaginationInformation } from "../helpers/pagination-info";
import { UsersService } from "../users/users.service";

export enum FindOneSlotFailure {
  SlotNotFound,
  ForbiddenForUser
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
    if (requestingUser.isAdmin) {
      return await this.slotRepo.findAll(paginationInfo);
    }
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
    return r.map(s => SlotsService.blackenDto(s, requestingUser));
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
      s => {
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
    return r.map(r => SlotsService.blackenDto(r, requestingUser));
  }

  async dispatchWeeklySummary() {
    this.logger.log("Starting do dispatch the weekly summary.");
    const teachingUsers = await this.userRepo.findWeeklySummaryRecipients();
    await Promise.all(
      teachingUsers.map(async teacher => {
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
        : null
    };
  }
}
