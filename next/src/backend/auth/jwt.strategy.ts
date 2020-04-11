import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-http-bearer";
import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { SignerService } from "../infrastructure/signer.service";
import { JwtTokenPayload } from "@@types";
import { UserRepo } from "../db/user.repo";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(SignerService) private readonly signerService: SignerService,
    @Inject(UserRepo) private readonly userRepo: UserRepo
  ) {
    super();
  }

  async validate(token: string): Promise<RequestContextUser> {
    const payload = await this.signerService.decryptToken<JwtTokenPayload>(
      token
    );

    return payload.cata<RequestContextUser>(
      () => {
        throw new UnauthorizedException();
      },
      (payload) => {
        return {
          getDto: async () => await this.userRepo.findById(payload.id),
          childrenIds: payload.childrenIds,
          id: payload.id,
          role: payload.role,
          displayname: payload.displayname,
          username: payload.username,
          isAdmin: payload.isAdmin,
        };
      }
    );
  }
}
