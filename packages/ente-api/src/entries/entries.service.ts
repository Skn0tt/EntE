import { Injectable, Inject } from "@nestjs/common";
import { Validation, Fail, Success, Maybe } from "monet";
import { EntryRepo } from "../db/entry.repo";
import {
  Roles,
  EntryDto,
  CreateEntryDto,
  PatchEntryDto,
  userIsAdult,
  TEACHING_ROLES,
  entryReasonCategoryHasTeacherId,
  ExamenPayload,
  isParentSignatureNotificationEnabled,
  canEntryStillBeSigned,
  CreateEntryDtoValidator,
  BlackedEntryDto,
  UserDto
} from "ente-types";
import { UserRepo } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { Config } from "../helpers/config";
import * as _ from "lodash";
import { RequestContextUser } from "../helpers/request-context";
import { PaginationInformation } from "../helpers/pagination-info";
import { InstanceConfigService } from "../instance-config/instance-config.service";
import { EntryNotificationQueue } from "./entry-notification.queue";
import { WinstonLoggerService } from "../winston-logger.service";
import { SlotsService } from "../slots/slots.service";
import { UsersService } from "../users/users.service";
import { parseISO } from "date-fns";

export enum FindEntryFailure {
  ForbiddenForUser,
  EntryNotFound
}

export enum CreateEntryFailure {
  ForbiddenForUser,
  IllegalDto,
  StudentIdMissing,
  TeacherUnknown,
  StudentNotFound
}

export enum SetForSchoolEntryFailure {
  EntryNotFound,
  ForbiddenForRole,
  EntryDoesntBelongToUser
}

export enum SignEntryFailure {
  EntryNotFound,
  ForbiddenForUser,
  EntryDoesntBelongToUser
}

export enum FindAllEntriesFailure {
  ForbiddenForRole
}

export enum DeleteEntryFailure {
  ForbiddenForRole,
  ForbiddenForUser,
  NotFound
}

export enum PatchEntryFailure {
  ForbiddenForRole,
  ForbiddenForUser,
  NotFound,
  IllegalPatch,
  EntryAlreadyExpired
}

@Injectable()
export class EntriesService {
  constructor(
    @Inject(EntryRepo) private readonly entryRepo: EntryRepo,
    @Inject(UserRepo) private readonly userRepo: UserRepo,
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(InstanceConfigService)
    private readonly instanceConfigService: InstanceConfigService,
    @Inject(EntryNotificationQueue)
    private readonly entryNotificationQueue: EntryNotificationQueue,
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService
  ) {}

  private async _findAll(
    requestingUser: RequestContextUser,
    paginationInfo: PaginationInformation
  ): Promise<Validation<FindAllEntriesFailure, EntryDto[]>> {
    switch (requestingUser.role) {
      case Roles.MANAGER:
        const user = (await requestingUser.getDto()).some();
        return Success(
          await this.entryRepo.findByClass(user.class!, paginationInfo)
        );

      case Roles.PARENT:
        return Success(
          await this.entryRepo.findByStudents(
            requestingUser.childrenIds,
            paginationInfo
          )
        );

      case Roles.STUDENT:
        return Success(
          await this.entryRepo.findByStudents(
            [requestingUser.id],
            paginationInfo
          )
        );

      case Roles.TEACHER:
        return Fail(FindAllEntriesFailure.ForbiddenForRole);
    }
  }

  public async findAll(
    requestingUser: RequestContextUser,
    paginationInfo: PaginationInformation
  ) {
    const r = await this._findAll(requestingUser, paginationInfo);
    return r.map(entries =>
      entries.map(e => EntriesService.blackenDto(e, requestingUser))
    );
  }

  private async _findOne(
    id: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<FindEntryFailure, EntryDto>> {
    const entry = await this.entryRepo.findById(id);

    const user =
      requestingUser.role === Roles.MANAGER && (await requestingUser.getDto());

    return entry.cata(
      () => Fail(FindEntryFailure.EntryNotFound),
      e => {
        switch (requestingUser.role) {
          case Roles.STUDENT:
            const belongsStudent = e.student.id === requestingUser.id;
            return belongsStudent
              ? Success(e)
              : Fail(FindEntryFailure.ForbiddenForUser);

          case Roles.MANAGER:
            const belongsStudentOfYear =
              e.student.class === (user as Maybe<UserDto>).some().class;
            return belongsStudentOfYear
              ? Success(e)
              : Fail(FindEntryFailure.ForbiddenForUser);

          case Roles.PARENT:
            const belongsChild = requestingUser.childrenIds.includes(
              e.student.id
            );
            return belongsChild
              ? Success(e)
              : Fail(FindEntryFailure.ForbiddenForUser);

          case Roles.TEACHER:
            return Fail(FindEntryFailure.ForbiddenForUser);
        }
      }
    );
  }

  public async findOne(id: string, requestingUser: RequestContextUser) {
    const r = await this._findOne(id, requestingUser);
    return r.map(e => EntriesService.blackenDto(e, requestingUser));
  }

  private async getCreateEntryDtoValidator() {
    const deadline = await this.instanceConfigService.getEntryCreationDeadline();

    return CreateEntryDtoValidator(deadline);
  }

  private async _create(
    entry: CreateEntryDto,
    requestingUser: RequestContextUser
  ): Promise<Validation<CreateEntryFailure, EntryDto>> {
    const validator = await this.getCreateEntryDtoValidator();
    const isValidDto = validator.validate(entry);
    if (!isValidDto) {
      return Fail(CreateEntryFailure.IllegalDto);
    }

    const userIsParent = requestingUser.role === Roles.PARENT;
    const userIsStudent = requestingUser.role === Roles.STUDENT;
    if (!(userIsParent || userIsStudent)) {
      return Fail(CreateEntryFailure.ForbiddenForUser);
    }

    if (userIsParent) {
      const studentIsSet = !!entry.studentId;
      if (!studentIsSet) {
        return Fail(CreateEntryFailure.StudentIdMissing);
      }

      const studentIsChild = requestingUser.childrenIds.includes(
        entry.studentId!
      );
      if (!studentIsChild) {
        return Fail(CreateEntryFailure.ForbiddenForUser);
      }
    }

    entry.studentId = entry.studentId || requestingUser.id;

    const teachersExist = await this.userRepo.hasUsersWithRole(
      TEACHING_ROLES,
      ...entry.slots.map(s => s.teacherId)
    );
    if (!teachersExist) {
      return Fail(CreateEntryFailure.TeacherUnknown);
    }

    const result = await this.entryRepo.createEntry(entry, {
      signedByParent:
        userIsParent || userIsAdult((await requestingUser.getDto()).some())
    });

    const hasTeacher = entryReasonCategoryHasTeacherId(entry.reason.category);
    if (hasTeacher) {
      const { teacherId } = entry.reason.payload as ExamenPayload;

      const teacherExists = await this.userRepo.hasUsersWithRole(
        TEACHING_ROLES,
        teacherId!
      );
      if (!teacherExists) {
        return Fail(CreateEntryFailure.TeacherUnknown);
      }
    }

    if (!result.signedParent) {
      const parentSignatureNotificationTime = await this.instanceConfigService.getParentSignatureNotificationTime();
      if (
        isParentSignatureNotificationEnabled(parentSignatureNotificationTime)
      ) {
        await this.entryNotificationQueue.addJob(
          result.id,
          parentSignatureNotificationTime
        );
      }

      const parentsOfUser = await this.userRepo.getParentsOfUser(
        entry.studentId!
      );

      parentsOfUser.cata(
        () => {
          throw new Error(
            `DB Corrupt: User ${
              entry.studentId
            } could not be found in DB, but is child of ${
              requestingUser.username
            }`
          );
        },
        parents => {
          this.emailService.dispatchSignRequest(
            this.getSigningLinkForEntry(result),
            parents
          );
        }
      );
    }

    return Success(result);
  }

  public async create(
    entry: CreateEntryDto,
    requestingUser: RequestContextUser
  ) {
    const r = await this._create(entry, requestingUser);
    return r.map(e => EntriesService.blackenDto(e, requestingUser));
  }

  private async _patch(
    id: string,
    patch: PatchEntryDto,
    _requestingUser: RequestContextUser
  ): Promise<Validation<PatchEntryFailure, EntryDto>> {
    const roleIsAllowed = [Roles.MANAGER, Roles.PARENT].includes(
      _requestingUser.role
    );
    if (!roleIsAllowed) {
      return Fail(PatchEntryFailure.ForbiddenForRole);
    }

    const entry = await this.entryRepo.findById(id);
    if (entry.isNone()) {
      return Fail(PatchEntryFailure.NotFound);
    }

    const requestingUser = (await _requestingUser.getDto()).some();

    if (!_.isUndefined(patch.signed)) {
      const userIsManager = requestingUser.role === Roles.MANAGER;
      if (userIsManager) {
        const entryBelongsManager =
          entry.some().student.class === requestingUser.class;
        if (!entryBelongsManager) {
          return Fail(PatchEntryFailure.ForbiddenForUser);
        }

        await this.entryRepo.setSignedManager(id, patch.signed!);
        entry.some().signedManager = patch.signed!;

        const dispatchSignedInfoEmail = async (signed: boolean) => {
          const entryStudent = entry.some().student;
          const parentsOfStudent = userIsAdult(entryStudent)
            ? []
            : (await this.userRepo.getParentsOfUser(entryStudent.id)).some();

          const recipients = [entryStudent, ...parentsOfStudent];

          const link = this.getSigningLinkForEntry(entry.some());

          if (signed) {
            await this.emailService.dispatchManagerSignedInformation(
              link,
              recipients
            );
          } else {
            await this.emailService.dispatchManagerUnsignedInformation(
              link,
              recipients
            );
          }
        };

        await dispatchSignedInfoEmail(patch.signed!);
      } else {
        const expiryDuration = await this.instanceConfigService.getParentSignatureExpiryTime();
        if (
          !canEntryStillBeSigned(
            +parseISO(entry.some().createdAt),
            expiryDuration
          )
        ) {
          return Fail(PatchEntryFailure.EntryAlreadyExpired);
        }

        const isTrueBecauseOnlyManagersCanRemoveSignature =
          patch.signed === true;
        if (!isTrueBecauseOnlyManagersCanRemoveSignature) {
          return Fail(PatchEntryFailure.IllegalPatch);
        }

        const entryBelongsParent = requestingUser.children
          .map(c => c.id)
          .includes(entry.some().student.id);
        if (!entryBelongsParent) {
          return Fail(PatchEntryFailure.ForbiddenForUser);
        }

        await this.entryRepo.setSignedParent(id, patch.signed);
        entry.some().signedParent = patch.signed;

        const dispatchSignedInfoEmail = async () => {
          const entryStudent = entry.some().student;
          const parentsOfStudent = userIsAdult(entryStudent)
            ? []
            : (await this.userRepo.getParentsOfUser(entryStudent.id)).some();

          const recipients = [entryStudent, ...parentsOfStudent];

          const link = this.getSigningLinkForEntry(entry.some());
          await this.emailService.dispatchSignedInformation(link, recipients);
        };

        await dispatchSignedInfoEmail();
      }
    }

    return Success(entry.some());
  }

  public async patch(
    id: string,
    patch: PatchEntryDto,
    requestingUser: RequestContextUser
  ) {
    const r = await this._patch(id, patch, requestingUser);
    return r.map(r => EntriesService.blackenDto(r, requestingUser));
  }

  private async _delete(
    id: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<DeleteEntryFailure, EntryDto>> {
    if (![Roles.MANAGER, Roles.STUDENT].includes(requestingUser.role)) {
      return Fail(DeleteEntryFailure.ForbiddenForRole);
    }

    const entryV = await this._findOne(id, requestingUser);
    if (entryV.isFail()) {
      switch (entryV.fail()) {
        case FindEntryFailure.EntryNotFound:
          return Fail(DeleteEntryFailure.NotFound);
        default:
          return Fail(DeleteEntryFailure.ForbiddenForUser);
      }
    }

    if (requestingUser.role === Roles.STUDENT) {
      const { signedManager, signedParent } = entryV.success();
      const isPartiallySigned = signedManager || signedParent;
      if (isPartiallySigned) {
        return Fail(DeleteEntryFailure.ForbiddenForUser);
      }
    }

    await this.entryRepo.delete(id);

    entryV.forEach(async entry => {
      const recipients = [entry.student];

      if (!userIsAdult(entry.student)) {
        const parents = await this.userRepo.getParentsOfUser(entry.student.id);
        parents.forEach(parents => recipients.push(...parents));
      }

      await this.emailService.dispatchEntryDeletedNotification(
        entry,
        recipients
      );
    });

    return Success(entryV.success());
  }

  public async delete(id: string, requestingUser: RequestContextUser) {
    const r = await this._delete(id, requestingUser);
    return r.map(e => EntriesService.blackenDto(e, requestingUser));
  }

  async sendNotification(entryId: string) {
    const entry = await this.entryRepo.findById(entryId);
    await entry.cata(
      async () => {
        this.logger.log(`entry ${entryId} does not exist anymore.`);
      },
      async entry => {
        const { signedParent, student } = entry;
        if (signedParent) {
          this.logger.log(`Entry has already been signed.`);
          return;
        }

        const parents = await this.userRepo.getParentsOfUser(student.id);
        await parents.cata(
          async () => {
            this.logger.log(`Student ${student.id} does not exist anymore.`);
          },
          async parents => {
            const entryLink = this.getSigningLinkForEntry(entry);
            await this.emailService.dispatchEntryStillUnsignedNotification(
              entryLink,
              parents
            );
          }
        );
      }
    );
  }

  getSigningLinkForEntry(entry: EntryDto) {
    const baseUrl = Config.getBaseUrl();
    return `${baseUrl}/entries/${entry.id}`;
  }

  static blackenDto(
    entry: EntryDto,
    requestingUser: RequestContextUser
  ): BlackedEntryDto {
    const { student, slots } = entry;

    return {
      ...entry,
      student: UsersService.blackenDto(student, requestingUser),
      slots: slots.map(s => SlotsService.blackenDto(s, requestingUser))
    };
  }
}
