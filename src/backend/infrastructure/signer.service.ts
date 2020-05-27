import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  LoggerService,
} from "@nestjs/common";
import { Maybe } from "monet";
import { RedisService } from "./redis.service";
import Signer from "@skn0tt/signer";
import { Config } from "../helpers/config";
import { WinstonLoggerService } from "../winston-logger.service";

let globalSigner: Signer<any>;

@Injectable()
export class SignerService<T extends object>
  implements OnModuleInit, OnModuleDestroy {
  get signer(): Signer<T> {
    return globalSigner;
  }

  set signer(s: Signer<T>) {
    if (globalSigner) {
      globalSigner.close();
      this.logger.log("Closed existing Signer.");
    }

    globalSigner = s;
  }

  get jwtRepo() {
    return this.signer.getJwtRepository();
  }

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async onModuleInit() {
    const { rotationInterval, tokenExpiry } = Config.getSignerConfig();

    this.signer = await Signer.fromRedis(this.redisService.getClient(), {
      rotationInterval,
      tokenExpiry,
      mode: "asymmetric",
      secretLength: 96,
      onRotate: () => this.logger.log("Successfully rotated JWT secrets."),
    });
    this.logger.log("Started JWT rotation.");
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
