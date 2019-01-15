import { Injectable, Inject } from "@nestjs/common";
import {
  UserDto,
  CreateUserDto,
  Roles,
  CreateUserDtoValidator
} from "ente-types";
import { RequestContextUser } from "../helpers/request-context";
import { Fail, Validation, Success } from "monet";
import {
  UserRepo,
  ImportUsersFailure as DbImportUsersFailure
} from "../db/user.repo";
import { EntryRepo } from "../db/entry.repo";

export enum ImportUsersFailure {
  ForbiddenForRole,
  IllegalDtos,
  UsersNotFound
}

@Injectable()
export class InstanceService {
  constructor(
    @Inject(UserRepo) private readonly usersRepo: UserRepo,
    @Inject(EntryRepo) private readonly entriesRepo: EntryRepo
  ) {}

  async importUsers(
    dtos: CreateUserDto[],
    requestingUser: RequestContextUser,
    deleteEntries: boolean,
    deleteOthers: boolean
  ): Promise<Validation<ImportUsersFailure, UserDto[]>> {
    const { role } = requestingUser;
    const isAdmin = role === Roles.ADMIN;
    if (!isAdmin) {
      return Fail(ImportUsersFailure.ForbiddenForRole);
    }

    const areValidDtos = dtos.every(CreateUserDtoValidator.validate);
    if (!areValidDtos) {
      return Fail(ImportUsersFailure.IllegalDtos);
    }

    const importedUsers = await this.usersRepo.import(dtos, deleteOthers);
    return await importedUsers.cata<
      Promise<Validation<ImportUsersFailure, UserDto[]>>
    >(
      async fail => {
        switch (fail) {
          case DbImportUsersFailure.UsersNotFound:
            return Fail(DbImportUsersFailure.UsersNotFound);
        }
      },
      async importedUsers => {
        if (deleteEntries) {
          await this.entriesRepo.deleteAll();
        }

        return Success(importedUsers);
      }
    );
  }
}
