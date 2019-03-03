import { Injectable, Inject } from "@nestjs/common";
import { Validation, Fail, Success, Maybe } from "monet";
import { EntryRepo } from "../db/entry.repo";
import {
  Roles,
  EntryDto,
  CreateEntryDto,
  PatchEntryDto,
  UserDto,
  userIsAdult,
  TEACHING_ROLES,
  entryReasonCategoryHasTeacherId,
  ExamenPayload
} from "ente-types";
import { UserRepo } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { Config } from "../helpers/config";
import { validate } from "class-validator";
import * as _ from "lodash";
import { RequestContextUser } from "../helpers/request-context";
import { PaginationInformation } from "../helpers/pagination-info";

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
  IllegalPatch
}

@Injectable()
export class EntriesService {
  constructor(
    @Inject(EntryRepo) private readonly entryRepo: EntryRepo,
    @Inject(UserRepo) private readonly userRepo: UserRepo,
    @Inject(EmailService) private readonly emailService: EmailService
  ) {}

  async findAll(
    requestingUser: RequestContextUser,
    paginationInfo: PaginationInformation
  ): Promise<Validation<FindAllEntriesFailure, EntryDto[]>> {
    switch (requestingUser.role) {
      case Roles.ADMIN:
        return Success(await this.entryRepo.findAll(paginationInfo));

      case Roles.MANAGER:
        const user = (await requestingUser.getDto()).some();
        return Success(
          await this.entryRepo.findByYear(user.graduationYear!, paginationInfo)
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

  async findOne(
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
          case Roles.ADMIN:
            return Success(e);

          case Roles.STUDENT:
            const belongsStudent = e.student.id === requestingUser.id;
            return belongsStudent
              ? Success(e)
              : Fail(FindEntryFailure.ForbiddenForUser);

          case Roles.MANAGER:
            const belongsStudentOfYear =
              e.student.graduationYear ===
              (user as Maybe<UserDto>).some().graduationYear;
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

  async create(
    entry: CreateEntryDto,
    requestingUser: RequestContextUser
  ): Promise<Validation<CreateEntryFailure, EntryDto>> {
    const isValidDto =
      (await validate(entry, { forbidNonWhitelisted: true })).length === 0;
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

  async patch(
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
          entry.some().student.graduationYear === requestingUser.graduationYear;
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
      }
    }

    return Success(entry.some());
  }

  async delete(
    id: string,
    requestingUser: RequestContextUser
  ): Promise<Validation<DeleteEntryFailure, EntryDto>> {
    if (
      [Roles.PARENT, Roles.STUDENT, Roles.TEACHER, Roles.ADMIN].includes(
        requestingUser.role
      )
    ) {
      return Fail(DeleteEntryFailure.ForbiddenForRole);
    }

    const entryV = await this.findOne(id, requestingUser);
    if (entryV.isFail()) {
      switch (entryV.fail()) {
        case FindEntryFailure.EntryNotFound:
          return Fail(DeleteEntryFailure.NotFound);
        default:
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

  getSigningLinkForEntry(entry: EntryDto) {
    const baseUrl = Config.getBaseUrl();
    return `${baseUrl}/entries/${entry.id}`;
  }
}
