import { Injectable, Inject } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { UserRepo } from "../db/user.repo";
import { Fail, Success, Validation } from "monet";
import { TOTP } from "../auth/TOTP";

export enum TwoFAEnableFail {
  NotFound,
  AlreadyEnabled,
}

@Injectable()
export class TwoFAService {
  constructor(
    @Inject(UserRepo)
    private readonly userRepo: UserRepo
  ) {}

  async enable(
    user: RequestContextUser
  ): Promise<Validation<TwoFAEnableFail, string>> {
    const itsAlreadyEnabled = await this.userRepo.hasTOTPSecret(user.id);
    if (itsAlreadyEnabled.isNone()) {
      return Fail(TwoFAEnableFail.NotFound);
    }

    if (itsAlreadyEnabled.contains(true)) {
      return Fail(TwoFAEnableFail.AlreadyEnabled);
    }

    const { secret, qrcode_url } = TOTP.generateSecret();
    await this.userRepo.setTOTPSecret(user.id, secret);

    return Success(qrcode_url);
  }

  async disable(user: RequestContextUser) {
    await this.userRepo.removeTOTPSecret(user.id);
  }
}
