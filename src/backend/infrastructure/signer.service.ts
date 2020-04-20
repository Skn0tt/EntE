import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  LoggerService,
} from "@nestjs/common";
import { Maybe } from "monet";
import { RedisService } from "./redis.service";
import Signer, { JWTRepository } from "@skn0tt/signer";
import { Config } from "../helpers/config";
import { Interval } from "@nestjs/schedule";
import { WinstonLoggerService } from "../winston-logger.service";

const { rotationInterval, tokenExpiry } = Config.getSignerConfig();

@Injectable()
export class SignerService<T extends object>
  implements OnModuleInit, OnModuleDestroy {
  private signer: Signer<T>;
  private jwtRepo: JWTRepository<T>;

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async onModuleInit() {
    this.signer = await Signer.fromRedis(this.redisService.getClient(), {
      rotationInterval: null,
      tokenExpiry,
      mode: "asymmetric",
      secretLength: 96,
    });

    this.jwtRepo = this.signer.getJwtRepository();
  }

  @Interval(rotationInterval)
  private async rotate() {
    await this.signer.rotate();
    this.logger.log("Successfully rotated JWT secrets.");
  }

  async onModuleDestroy() {
    this.signer.close();
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
