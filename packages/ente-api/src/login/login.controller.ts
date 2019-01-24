import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { RequestContext, Ctx } from "helpers/request-context";
import { LoginDto } from "ente-types";
import { LoginService } from "./login.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("login")
@UseGuards(AuthGuard("combined"))
export class LoginController {
  constructor(
    @Inject(LoginService)
    private readonly loginService: LoginService
  ) {}

  @Get()
  async login(@Ctx() ctx: RequestContext): Promise<LoginDto> {
    return this.loginService.getLoginData(ctx.user);
  }
}
