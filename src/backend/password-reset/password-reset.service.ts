import { Injectable, Inject, LoggerService } from "@nestjs/common";
import { Validation, Fail, Success } from "monet";
import {
  PasswordResetTokenService,
  FindTokenFailure,
} from "../auth/password-token.service";
import { UserRepo, SetPasswordHashFailure } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { hashPassword } from "../helpers/password-hash";
import { Config } from "../helpers/config";
import { WinstonLoggerService } from "../winston-logger.service";
import { isValidPassword, UserDto } from "@@types";
import { days, hours } from "../helpers/time";
import * as querystring from "querystring";

export enum StartPasswordRoutineFailure {
  UserNotFound,
}

export enum SetNewPasswordFailure {
  TokenUnknown,
  TokenExpired,
  UserNotFound,
  PasswordIllegal,
}

@Injectable()
export class PasswordResetService {
  constructor(
    @Inject(PasswordResetTokenService)
    private readonly passwordTokenService: PasswordResetTokenService,
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(UserRepo) private readonly userRepo: UserRepo,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async invokePasswordResetRoutine(
    username: string,
    expiry: number = hours(24)
  ): Promise<Validation<StartPasswordRoutineFailure, boolean>> {
    const user = await this.userRepo.findByUsername(username);
    if (user.isNone()) {
      return Fail(StartPasswordRoutineFailure.UserNotFound);
    }

    const token = await this.passwordTokenService.createToken(
      user.some().id,
      false,
      expiry
    );
    await this.emailService.dispatchPasswordResetLink(
      this.getPasswordResetLink(token, username),
      user.some()
    );

    this.logger.log(`User ${username} invoked password reset routine.`);

    return Success(true);
  }

  async invokeInvitationRoutine(user: UserDto): Promise<void> {
    const token = await this.passwordTokenService.createToken(
      user.id,
      true,
      null
    );
    await this.emailService.dispatchInvitationLink(
      this.getInvitationLink(token, user.username),
      user
    );
    this.logger.log(
      `Successfully invoked InvitationRoutine for user "${user.username}".`
    );
  }

  async setNewPassword(
    token: string,
    newPassword: string
  ): Promise<Validation<SetNewPasswordFailure, boolean>> {
    const isValid = isValidPassword(newPassword);
    if (!isValid) {
      return Fail(SetNewPasswordFailure.PasswordIllegal);
    }

    const tokenInfo = await this.passwordTokenService.findToken(token);
    await this.passwordTokenService.destroyToken(token);

    return await tokenInfo.cata<
      Promise<Validation<SetNewPasswordFailure, boolean>>
    >(
      async (fail) => {
        switch (fail) {
          case FindTokenFailure.TokenExpired:
            return Fail(SetNewPasswordFailure.TokenExpired);
          case FindTokenFailure.TokenNotFound:
            return Fail(SetNewPasswordFailure.TokenUnknown);
        }
      },
      async (tokenInfo) => {
        const { isInvitation, userId } = tokenInfo;
        const newPasswordHash = await hashPassword(newPassword);
        const result = await this.userRepo.setPasswordHash(
          userId,
          newPasswordHash
        );

        return result.cata(
          (fail) => {
            switch (fail) {
              case SetPasswordHashFailure.UserNotFound:
                return Fail(SetNewPasswordFailure.UserNotFound);
            }
          },
          (user) => {
            if (!isInvitation) {
              this.emailService.dispatchPasswordResetSuccess(user);
            }

            this.logger.log(
              `User ${user.username} successfully reset password.`
            );

            return Success(true);
          }
        );
      }
    );
  }

  getPasswordResetLink(token: string, username: string) {
    const baseUrl = Config.getBaseUrl();
    const query = querystring.stringify({ username });
    return `${baseUrl}/passwordReset/${token}?${query}`;
  }

  getInvitationLink(token: string, username: string) {
    const baseUrl = Config.getBaseUrl();
    const query = querystring.stringify({ username });
    return `${baseUrl}/invitation/${token}?${query}`;
  }
}
