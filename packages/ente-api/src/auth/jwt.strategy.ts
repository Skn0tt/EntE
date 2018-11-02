import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-http-bearer";
import { AuthService } from "./auth.service";
import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const user = await this.authService.findUserByToken(token);
    return user.cata(() => {
      throw new UnauthorizedException();
    }, u => u);
  }
}
