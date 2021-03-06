import {
  Controller,
  UseGuards,
  Inject,
  Post,
  ConflictException,
  Get,
  Param,
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

  @Get()
  async isEnabled(@Ctx() ctx: RequestContext) {
    const result = await this.twoFAService.isEnabled(ctx.user);
    return result ? "enabled" : "disabled";
  }

  @Post("enable")
  async enable(@Ctx() ctx: RequestContext) {
    const result = await this.twoFAService.enable(ctx.user);
    return result.cata(
      (fail) => {
        switch (fail) {
          case TwoFAEnableFail.AlreadyEnabled:
            throw new ConflictException("already enabled");
        }
      },
      (qrCode) => qrCode
    );
  }

  @Post("disable")
  async disable(@Ctx() ctx: RequestContext) {
    await this.twoFAService.disable(ctx.user.id);
  }

  @Post("disable/:userId")
  async disableForUser(
    @Param("userId") id: string,
    @Ctx() ctx: RequestContext
  ) {
    await this.twoFAService.disableForUser(id, ctx.user);
  }
}
