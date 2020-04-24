import {
  Controller,
  UseGuards,
  Inject,
  Post,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TwoFAService, TwoFAEnableFail } from "./2fa.service";
import { RequestContext, Ctx } from "../helpers/request-context";

@Controller("2fa")
@UseGuards(AuthGuard("combined"))
export class TwoFAController {
  constructor(
    @Inject(TwoFAService)
    private readonly twoFAService: TwoFAService
  ) {}

  @Post("enable")
  async enable(@Ctx() ctx: RequestContext) {
    const result = await this.twoFAService.enable(ctx.user);
    return result.cata(
      (fail) => {
        switch (fail) {
          case TwoFAEnableFail.NotFound:
            throw new UnauthorizedException();
          case TwoFAEnableFail.AlreadyEnabled:
            throw new ConflictException("already enabled");
        }
      },
      (qrCode) => qrCode
    );
  }

  @Post("disable")
  async disable(@Ctx() ctx: RequestContext) {
    await this.twoFAService.disable(ctx.user);
  }
}
