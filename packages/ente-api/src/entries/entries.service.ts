import { Injectable, Inject, Delete } from "@nestjs/common";
import { Validation, Fail, Success } from "monet";
import { EntryRepo } from "../db/entry.repo";
import {
  Roles,
  EntryDto,
  UserDto,
  CreateEntryDto,
  PatchEntryDto
} from "ente-types";
import { UserRepo } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { Config } from "../helpers/config";
import { validate } from "class-validator";
import * as _ from "lodash";

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
    requestingUser: UserDto
  ): Promise<Validation<FindAllEntriesFailure, EntryDto[]>> {
    switch (requestingUser.role) {
      case Roles.ADMIN:
        return Success(await this.entryRepo.findAll());

      case Roles.MANAGER:
        return Success(
          await this.entryRepo.findByYear(requestingUser.graduationYear)
        );

      case Roles.PARENT:
        return Success(
          await this.entryRepo.findByStudents(
            ...requestingUser.children.map(c => c.id)
          )
        );

      case Roles.STUDENT:
        return Success(await this.entryRepo.findByStudents(requestingUser.id));

      case Roles.TEACHER:
        return Fail(FindAllEntriesFailure.ForbiddenForRole);
    }
  }

  async findOne(
    id: string,
    requestingUser: UserDto
  ): Promise<Validation<FindEntryFailure, EntryDto>> {
    const entry = await this.entryRepo.findById(id);

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
              e.student.graduationYear === requestingUser.graduationYear;
            return belongsStudentOfYear
              ? Success(e)
              : Fail(FindEntryFailure.ForbiddenForUser);

          case Roles.PARENT:
            const belongsChild = requestingUser.children
              .map(c => c.id)
              .includes(e.student.id);
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
    requestingUser: UserDto
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

      const studentIsChild = requestingUser.children.some(
        c => c.id === entry.studentId
      );
      if (!studentIsChild) {
        return Fail(CreateEntryFailure.ForbiddenForUser);
      }
    }

    entry.studentId = entry.studentId || requestingUser.id;

    const teachersExist = await this.userRepo.hasUsersWithRole(
      Roles.TEACHER,
      ...entry.slots.map(s => s.teacherId)
    );
    if (!teachersExist) {
      return Fail(CreateEntryFailure.TeacherUnknown);
    }

    const result = await this.entryRepo.createEntry(entry, {
      signedByParent: userIsParent || requestingUser.isAdult
    });

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
    requestingUser: UserDto
  ): Promise<Validation<PatchEntryFailure, EntryDto>> {
    const roleIsAllowed = [Roles.MANAGER, Roles.PARENT].includes(
      requestingUser.role
    );
    if (!roleIsAllowed) {
      return Fail(PatchEntryFailure.ForbiddenForRole);
    }

    const entry = await this.entryRepo.findById(id);
    if (entry.isNone()) {
      return Fail(PatchEntryFailure.NotFound);
    }

    if (!_.isUndefined(patch.forSchool)) {
      const userIsManager = requestingUser.role === Roles.MANAGER;
      if (!userIsManager) {
        return Fail(PatchEntryFailure.ForbiddenForRole);
      }

      const entryBelongsManager =
        entry.some().student.graduationYear === requestingUser.graduationYear;
      if (!entryBelongsManager) {
        return Fail(PatchEntryFailure.ForbiddenForUser);
      }

      await this.entryRepo.setForSchool(id, patch.forSchool);

      entry.some().forSchool = patch.forSchool;
    }

    if (!_.isUndefined(patch.signed)) {
      const userIsManager = requestingUser.role === Roles.MANAGER;
      if (userIsManager) {
        const entryBelongsManager =
          entry.some().student.graduationYear === requestingUser.graduationYear;
        if (!entryBelongsManager) {
          return Fail(PatchEntryFailure.ForbiddenForUser);
        }

        await this.entryRepo.setSignedManager(id, patch.signed);
        entry.some().signedManager = patch.signed;
      } else {
        const isTrue = patch.signed === true;
        if (!isTrue) {
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
    requestingUser: UserDto
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

    return Success(entryV.success());
  }

  getSigningLinkForEntry(entry: EntryDto) {
    const baseUrl = Config.getBaseUrl();
    return `${baseUrl}/entries/${entry.id}`;
  }
}
