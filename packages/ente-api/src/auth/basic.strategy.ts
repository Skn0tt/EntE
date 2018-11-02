import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy as _BasicStrategy } from "passport-http";
import { AuthService } from "./auth.service";
import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";

@Injectable()
export class BasicStrategy extends PassportStrategy(_BasicStrategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.findUserByCredentials(
      username,
      password
    );
    return user.cata(() => {
      throw new UnauthorizedException();
    }, u => u);
  }
}
