import { PassportStrategy } from "@nestjs/passport";
import { Strategy as CustomStrategy } from "passport-custom";
import { AuthService, FindUserByCredentialsFail } from "./auth.service";
import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { Some } from "monet";
import basicAuth from "basic-auth";
import _ from "lodash";
import type { IncomingMessage } from "http";

@Injectable()
export class BasicStrategy extends PassportStrategy(CustomStrategy, "basic") {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }

  async validate(req: IncomingMessage): Promise<RequestContextUser> {
    const authHeader = basicAuth(req);
    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const { name, pass } = authHeader;
    let totpToken = req.headers["X-TOTP-Token"];
    if (_.isArray(totpToken)) {
      throw new UnauthorizedException(
        "Don't provide multiple X-TOTP-Token headers."
      );
    }

    const user = await this.authService.findUserByCredentials(
      name,
      pass,
      totpToken
    );
    return user.cata<RequestContextUser>(
      (fail) => {
        switch (fail) {
          case FindUserByCredentialsFail.TOTPMissing:
            throw new UnauthorizedException("totp_missing");
          default:
            throw new UnauthorizedException();
        }
      },
      (user) => {
        return {
          getDto: async () => Some(user),
          childrenIds: user.children.map((c) => c.id),
          displayname: user.displayname,
          id: user.id,
          role: user.role,
          username: user.username,
          isAdmin: user.isAdmin,
        };
      }
    );
  }
}
