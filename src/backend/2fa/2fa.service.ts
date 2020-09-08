import { Injectable, Inject } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { UserRepo } from "../db/user.repo";
import { Fail, Success, Validation } from "monet";
import { TOTP } from "../auth/TOTP";
import { EmailService } from "../email/email.service";
import { UserDto } from "@@types";

export enum TwoFAEnableFail {
  AlreadyEnabled,
}

@Injectable()
export class TwoFAService {
  constructor(
    @Inject(UserRepo)
    private readonly userRepo: UserRepo,
    @Inject(EmailService)
    private readonly emailService: EmailService
  ) {}

  async enable(
    rcUser: RequestContextUser
  ): Promise<Validation<TwoFAEnableFail, string>> {
    const itsAlreadyEnabled = (
      await this.userRepo.hasTOTPSecret(rcUser.id)
    ).some();

    if (itsAlreadyEnabled === true) {
      return Fail(TwoFAEnableFail.AlreadyEnabled);
    }

    const user = (await rcUser.getDto()).some();

    const { secret, qrcode_url } = TOTP.generateSecret();
    await this.userRepo.setTOTPSecret(user.id, secret);

    await this.emailService.dispatch2FAEnabledNotification(user);

    return Success(qrcode_url);
  }

  async disable(userId: string) {
    const user = (await this.userRepo.findById(userId)).some();
    await this.userRepo.removeTOTPSecret(userId);
    await this.emailService.dispatch2FADisabledNotification(user);
  }

  async disableForUser(userId: string, requestingUser: RequestContextUser) {
    if (!requestingUser.isAdmin) {
      return "not_authorized";
    }

    await this.disable(userId);
    return "ok";
  }

  async isEnabled(user: RequestContextUser) {
    return (await this.userRepo.hasTOTPSecret(user.id)).some();
  }
}
