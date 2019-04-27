import { Injectable, Inject } from "@nestjs/common";
import { RedisService } from "../infrastructure/redis.service";
import { SignerService } from "../infrastructure/signer.service";

export interface HealthReport {
  isHealthy: boolean;
  dependencies: {
    redis: boolean;
    signer: boolean;
  };
}

@Injectable()
export class StatusService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(SignerService) private readonly signerService: SignerService
  ) {}

  async getStatus(): Promise<HealthReport> {
    // TODO: DB check

    const redisIsHealthy = await this.redisService.isHealthy();
    const signerIsHealthy = await this.signerService.isHealthy();

    const enteIsHealthy = redisIsHealthy && signerIsHealthy;
    const healthReport: HealthReport = {
      isHealthy: enteIsHealthy,
      dependencies: {
        signer: signerIsHealthy,
        redis: redisIsHealthy
      }
    };

    return healthReport;
  }
}
