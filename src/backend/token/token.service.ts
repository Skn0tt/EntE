import { Injectable, Inject } from "@nestjs/common";
import { SignerService } from "../infrastructure/signer.service";
import { JwtTokenPayload } from "@@types";
import { RequestContextUser } from "../helpers/request-context";

@Injectable()
export class TokenService {
  constructor(
    @Inject(SignerService)
    private readonly signerService: SignerService<JwtTokenPayload>
  ) {}

  async createToken(user: RequestContextUser): Promise<string> {
    const payload: JwtTokenPayload = {
      id: user.id,
      role: user.role,
      username: user.username,
      childrenIds: user.childrenIds,
      isAdmin: user.isAdmin,
    };
    return await this.signerService.createToken(payload);
  }
}
