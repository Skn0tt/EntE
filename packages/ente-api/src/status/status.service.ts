import { Injectable, Inject } from "@nestjs/common";
import { RedisService } from "../infrastructure/redis.service";
import { SignerService } from "../infrastructure/signer.service";
import { DbHealthIndicator } from "db/db-health-indicator";

export interface HealthReport {
  isHealthy: boolean;
  dependencies: {
    redis: boolean;
    signer: boolean;
    db: boolean;
  };
}

@Injectable()
export class StatusService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(SignerService) private readonly signerService: SignerService,
    @Inject(DbHealthIndicator)
    private readonly dbHealthIndicator: DbHealthIndicator
  ) {}

  async getStatus(): Promise<HealthReport> {
    // TODO: email check

    const redisIsHealthy = await this.redisService.isHealthy();
    const signerIsHealthy = await this.signerService.isHealthy();
    const dbIsHealthy = await this.dbHealthIndicator.isHealthy();

    const enteIsHealthy = redisIsHealthy && signerIsHealthy && dbIsHealthy;
    const healthReport: HealthReport = {
      isHealthy: enteIsHealthy,
      dependencies: {
        signer: signerIsHealthy,
        redis: redisIsHealthy,
        db: dbIsHealthy
      }
    };

    return healthReport;
  }
}
