import { Injectable, forwardRef, Inject, LoggerService } from "@nestjs/common";
import { Maybe, None, Some } from "monet";
import { SignerService } from "../infrastructure/signer.service";
import { UserRepo } from "../db/user.repo";
import { checkPassword } from "../helpers/password-hash";
import { UserDto, JwtTokenPayload } from "@@types";
import { WinstonLoggerService } from "../winston-logger.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(SignerService) private readonly signerService: SignerService,
    @Inject(forwardRef(() => UserRepo))
    private readonly userRepo: UserRepo,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async findUserByCredentials(
    username: string,
    password: string
  ): Promise<Maybe<UserDto>> {
    const userAndHash = await this.userRepo.findUserAndPasswordHashByUsername(
      username
    );
    if (userAndHash.isNone()) {
      return None();
    }

    // No Password Set
    if (!userAndHash.some().hash) {
      return None();
    }

    const isValidPassword = await checkPassword(
      userAndHash.some().hash,
      password
    );
    if (isValidPassword) {
      this.logger.log(
        `User ${username} successfully authenticated using BasicAuth.`
      );
      return Some(userAndHash.some().user);
    } else {
      this.logger.log(`User ${username} provided wrong password.`);
      return None();
    }
  }

  async findUserByToken(token: string): Promise<Maybe<UserDto>> {
    const jwt = await this.signerService.decryptToken<JwtTokenPayload>(token);
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
