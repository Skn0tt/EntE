import { AuthService, FindUserByCredentialsFail } from "./auth.service";
import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { Some } from "monet";
import _ from "lodash";
import type { IncomingMessage } from "http";

@Injectable()
export class BasicStrategy {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async validate(
    name: string,
    pass: string,
    req: IncomingMessage
  ): Promise<RequestContextUser> {
    const totpToken = req.headers["x-totp-token"];
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
          id: user.id,
          role: user.role,
          username: user.username,
          isAdmin: user.isAdmin,
        };
      }
    );
  }
}
