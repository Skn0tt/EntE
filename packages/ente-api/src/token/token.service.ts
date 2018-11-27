import { Injectable, Inject } from "@nestjs/common";
import { SignerService } from "../infrastructure/signer.service";
import { JwtTokenPayload } from "ente-types";
import { RequestContextUser } from "helpers/request-context";

@Injectable()
export class TokenService {
  constructor(
    @Inject(SignerService) private readonly signerService: SignerService
  ) {}

  async createToken(user: RequestContextUser): Promise<string> {
    const payload: JwtTokenPayload = {
      displayname: user.displayname,
      id: user.id,
      role: user.role,
      username: user.username,
      childrenIds: user.childrenIds
    };
    return await this.signerService.createToken(payload);
  }
}
