import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { SignerService } from "../infrastructure/signer.service";
import { JwtTokenPayload } from "@@types";
import { UserRepo } from "../db/user.repo";

@Injectable()
export class JwtStrategy {
  constructor(
    @Inject(SignerService)
    private readonly signerService: SignerService<JwtTokenPayload>,
    @Inject(UserRepo) private readonly userRepo: UserRepo
  ) {}

  async validate(token: string): Promise<RequestContextUser> {
    const payload = await this.signerService.decryptToken(token);

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
