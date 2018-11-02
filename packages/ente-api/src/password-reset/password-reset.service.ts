import { Injectable, Inject, LoggerService } from "@nestjs/common";
import { Validation, Fail, Success } from "monet";
import {
  PasswordResetTokenService,
  FindTokenFailure
} from "../auth/password-token.service";
import { UserRepo, SetPasswordHashFailure } from "../db/user.repo";
import { EmailService } from "../email/email.service";
import { hashPassword } from "../helpers/password-hash";
import { Config } from "../helpers/config";
import { WinstonLoggerService } from "../winston-logger.service";
import { isValidPassword } from "ente-types";

export enum StartPasswordRoutineFailure {
  UserNotFound
}

export enum SetNewPasswordFailure {
  TokenUnknown,
  TokenExpired,
  UserNotFound,
  PasswordIllegal
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

  async startPasswordResetRoutine(
    username: string,
    expiry?: number
  ): Promise<Validation<StartPasswordRoutineFailure, boolean>> {
    const user = await this.userRepo.findByUsername(username);
    if (user.isNone()) {
      return Fail(StartPasswordRoutineFailure.UserNotFound);
    }

    const token = await this.passwordTokenService.createToken(
      user.some().id,
      expiry
    );
    await this.emailService.dispatchPasswordResetLink(
      this.getPasswordResetLink(token),
      user.some()
    );

    this.logger.log(`User ${username} invoked password reset routine.`);

    return Success(true);
  }

  async setNewPassword(
    token: string,
    newPassword: string
  ): Promise<Validation<SetNewPasswordFailure, boolean>> {
    const isValid = isValidPassword(newPassword);
    if (!isValid) {
      return Fail(SetNewPasswordFailure.PasswordIllegal);
    }

    const userId = await this.passwordTokenService.findToken(token);
    if (userId.isFail()) {
      switch (userId.fail()) {
        case FindTokenFailure.TokenExpired:
          return Fail(SetNewPasswordFailure.TokenExpired);
        case FindTokenFailure.TokenNotFound:
          return Fail(SetNewPasswordFailure.TokenUnknown);
      }
    }

    const newPasswordHash = await hashPassword(newPassword);
    const result = await this.userRepo.setPasswordHash(
      userId.success(),
      newPasswordHash
    );

    return result.cata(
      fail => {
        switch (fail) {
          case SetPasswordHashFailure.UserNotFound:
            return Fail(SetNewPasswordFailure.UserNotFound);
        }
      },
      user => {
        this.emailService.dispatchPasswordResetSuccess(user);

        this.passwordTokenService.destroyToken(token);

        this.logger.log(`User ${user.username} successfully reset password.`);

        return Success(true);
      }
    );
  }

  getPasswordResetLink(token: string) {
    const baseUrl = Config.getBaseUrl();
    return `${baseUrl}/passwordReset/${token}`;
  }
}
