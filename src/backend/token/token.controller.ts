import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { TokenService } from "./token.service";
import { Ctx, RequestContext } from "../helpers/request-context";
import { AuthGuard } from "@nestjs/passport";

@Controller("token")
@UseGuards(AuthGuard("combined"))
export class TokenController {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService
  ) {}

  @Get()
  getToken(@Ctx() ctx: RequestContext) {
    return this.tokenService.createToken(ctx.user);
  }
}
