import { Injectable, forwardRef, Inject, LoggerService } from "@nestjs/common";
import { Maybe, None, Some, Validation, Fail, Success } from "monet";
import { SignerService } from "../infrastructure/signer.service";
import { UserRepo } from "../db/user.repo";
import { checkPassword } from "../helpers/password-hash";
import { UserDto, JwtTokenPayload } from "@@types";
import { WinstonLoggerService } from "../winston-logger.service";
import { TOTP } from "./TOTP";

export enum FindUserByCredentialsFail {
  NotFound,
  PasswordUnset,
  PasswordWrong,
  TOTPMissing,
  TOTPWrong,
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(SignerService)
    private readonly signerService: SignerService<JwtTokenPayload>,
    @Inject(forwardRef(() => UserRepo))
    private readonly userRepo: UserRepo,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async findUserByCredentials(
    username: string,
    password: string,
    totpToken: string | undefined
  ): Promise<Validation<FindUserByCredentialsFail, UserDto>> {
    const maybeUserAndHash = await this.userRepo.findUserAndPasswordHashByUsername(
      username
    );
    if (maybeUserAndHash.isNone()) {
      return Fail(FindUserByCredentialsFail.NotFound);
    }

    const { user, hash, totpSecret } = maybeUserAndHash.some();

    // No Password Set
    if (!hash) {
      return Fail(FindUserByCredentialsFail.PasswordUnset);
    }

    const isValidPassword = await checkPassword(hash, password);
    if (!isValidPassword) {
      this.logger.log(`User ${username} provided wrong password.`);
      return Fail(FindUserByCredentialsFail.PasswordWrong);
    }

    if (totpSecret) {
      if (!totpToken) {
        this.logger.log(`User ${username} didn't provide TOTP token.`);
        return Fail(FindUserByCredentialsFail.TOTPMissing);
      }

      const isValidTotpToken = TOTP.verifyToken(totpSecret, totpToken);
      if (!isValidTotpToken) {
        this.logger.log(`User ${username} provided wrong TOTP token.`);
        return Fail(FindUserByCredentialsFail.TOTPWrong);
      }
    }

    this.logger.log(
      `User ${username} successfully authenticated using BasicAuth.`
    );
    return Success(user);
  }

  async findUserByToken(token: string): Promise<Maybe<UserDto>> {
    const jwt = await this.signerService.decryptToken(token);
    if (jwt.isNone()) {
      return None();
    }

    const user = await this.userRepo.findById(jwt.some().id);
    user.cata(
      () => {},
      (u) => {
        this.logger.log(
          `User ${u.username} successfully authenticated using JWT.`
        );
      }
    );
    return user;
  }
}
