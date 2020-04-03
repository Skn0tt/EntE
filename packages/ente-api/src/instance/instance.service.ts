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
import { InstanceConfigService } from "../instance-config/instance-config.service";
import { PasswordResetService } from "../password-reset/password-reset.service";
import * as _ from "lodash";

export enum ImportUsersFailure {
  ForbiddenForRole,
  IllegalDtos,
  UsersNotFound
}

@Injectable()
export class InstanceService {
  constructor(
    @Inject(UserRepo) private readonly usersRepo: UserRepo,
    @Inject(EntryRepo) private readonly entriesRepo: EntryRepo,
    @Inject(InstanceConfigService)
    private readonly instanceConfigService: InstanceConfigService,
    @Inject(PasswordResetService)
    private readonly passwordResetService: PasswordResetService
  ) {}

  async importUsers(
    dtos: CreateUserDto[],
    requestingUser: RequestContextUser,
    deleteEntries: boolean,
    deleteOthers: boolean,
    deleteStudentsAndParents: boolean
  ): Promise<Validation<ImportUsersFailure, UserDto[]>> {
    const defaultLanguage = await this.instanceConfigService.getDefaultLanguage();

    const { role, isAdmin } = requestingUser;
    if (!isAdmin) {
      return Fail(ImportUsersFailure.ForbiddenForRole);
    }

    const areValidDtos = dtos.every(CreateUserDtoValidator.validate);
    if (!areValidDtos) {
      return Fail(ImportUsersFailure.IllegalDtos);
    }

    const importedUsers = await this.usersRepo.import(
      dtos,
      deleteOthers,
      deleteStudentsAndParents,
      defaultLanguage
    );

    const dtosByUsername = _.keyBy(dtos, (dto: CreateUserDto) => dto.username);

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
        const { created, updated } = importedUsers;

        const createdWithoutPassword = created.filter(user => {
          const { username } = user;

          const dto = dtosByUsername[username];
          return !!dto && !_.isString(dto.password);
        });

        await Promise.all(
          createdWithoutPassword.map(async user => {
            await this.passwordResetService.invokeInvitationRoutine(user);
          })
        );

        if (deleteEntries) {
          await this.entriesRepo.deleteAll();
        }

        return Success([...created, ...updated]);
      }
    );
  }
}
