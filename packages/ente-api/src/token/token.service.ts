import { Injectable, Inject } from "@nestjs/common";
import { SignerService } from "../infrastructure/signer.service";
import { UserDto, JwtTokenPayload } from "ente-types";

@Injectable()
export class TokenService {
  constructor(
    @Inject(SignerService) private readonly signerService: SignerService
  ) {}

  async createToken(user: UserDto): Promise<string> {
    const payload: JwtTokenPayload = {
      displayname: user.displayname,
      id: user.id,
      role: user.role,
      username: user.username
    };
    return await this.signerService.createToken(payload);
  }
}
