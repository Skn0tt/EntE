import { Injectable, Inject } from "@nestjs/common";
import { Validation, Fail, Success } from "monet";
import { EntryRepo } from "../db/entry.repo";
import { Roles, EntryDto, UserDto, CreateEntryDto } from "ente-types";
import { UserRepo } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { Config } from "../helpers/config";
import { validate } from "class-validator";

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

      case Roles.PARENT:
      case Roles.MANAGER:
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

          case Roles.PARENT:
          case Roles.MANAGER:
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

  async setForSchool(
    id: string,
    value: boolean,
    requestingUser: UserDto
  ): Promise<Validation<SetForSchoolEntryFailure, EntryDto>> {
    if (requestingUser.role !== Roles.MANAGER) {
      return Fail(SetForSchoolEntryFailure.ForbiddenForRole);
    }

    const entry = await this.entryRepo.findById(id);
    if (entry.isNone()) {
      return Fail(SetForSchoolEntryFailure.EntryNotFound);
    }

    const entryBelongsManager = requestingUser.children
      .map(c => c.id)
      .includes(entry.some().student.id);
    if (!entryBelongsManager) {
      return Fail(SetForSchoolEntryFailure.EntryDoesntBelongToUser);
    }

    await this.entryRepo.setForSchool(id, value);
    entry.some().forSchool = value;
    return Success(entry.some());
  }

  async sign(
    id: string,
    value: boolean,
    requestingUser: UserDto
  ): Promise<Validation<SignEntryFailure, EntryDto>> {
    switch (requestingUser.role) {
      case Roles.MANAGER:
      case Roles.PARENT:
        const entry = await this.entryRepo.findById(id);
        if (entry.isNone()) {
          return Fail(SignEntryFailure.EntryNotFound);
        }

        const entryBelongsToChild = requestingUser.children
          .map(c => c.id)
          .includes(entry.some().id);
        if (!entryBelongsToChild) {
          return Fail(SignEntryFailure.EntryDoesntBelongToUser);
        }

        if (requestingUser.role === Roles.MANAGER) {
          await this.entryRepo.setSignedManager(id, value);
          entry.some().signedManager = value;
          return Success(entry.some());
        } else {
          await this.entryRepo.setSignedParent(id, value);
          entry.some().signedParent = value;

          const parents = await this.userRepo.getParentsOfUser(
            entry.some().student.id
          );

          this.emailService.dispatchSignedInformation(
            this.getSigningLinkForEntry(entry.some()),
            parents.some()
          );

          return Success(entry.some());
        }
      default:
        return Fail(SignEntryFailure.ForbiddenForUser);
    }
  }

  getSigningLinkForEntry(entry: EntryDto) {
    const baseUrl = Config.getBaseUrl();
    return `${baseUrl}/entries/${entry.id}`;
  }
}
