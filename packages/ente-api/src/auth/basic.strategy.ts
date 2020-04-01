import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy as _BasicStrategy } from "passport-http";
import { AuthService } from "./auth.service";
import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { Some } from "monet";

@Injectable()
export class BasicStrategy extends PassportStrategy(_BasicStrategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string
  ): Promise<RequestContextUser> {
    const user = await this.authService.findUserByCredentials(
      username,
      password
    );
    return user.cata<RequestContextUser>(
      () => {
        throw new UnauthorizedException();
      },
      user => {
        return {
          getDto: async () => Some(user),
          childrenIds: user.children.map(c => c.id),
          displayname: user.displayname,
          id: user.id,
          role: user.role,
          username: user.username,
          isAdmin: user.isAdmin
        };
      }
    );
  }
}
