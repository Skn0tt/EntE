import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { Maybe } from "monet";
import { RedisService } from "./redis.service";
import Signer, { JWTRepository } from "@skn0tt/signer";
import { Config } from "../helpers/config";

@Injectable()
export class SignerService<T extends object> implements OnModuleInit {
  private signer: Signer<T>;
  private jwtRepo: JWTRepository<T>;

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService
  ) {}

  async onModuleInit() {
    const { rotationInterval, tokenExpiry } = Config.getSignerConfig();

    this.signer = await Signer.fromRedis(this.redisService.getClient(), {
      rotationInterval,
      tokenExpiry,
      mode: "asymmetric",
      secretLength: 96,
    });

    this.jwtRepo = this.signer.getJwtRepository();
  }

  async createToken(payload: any): Promise<string> {
    return await this.jwtRepo.sign(payload);
  }

  async decryptToken(token: string): Promise<Maybe<T>> {
    const payload = await this.jwtRepo.verify(token);
    return Maybe.fromNull(payload);
  }

  async blockToken(token: string) {
    await this.jwtRepo.block(token);
  }
}
