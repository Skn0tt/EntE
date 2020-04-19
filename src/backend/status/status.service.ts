import { Injectable, Inject } from "@nestjs/common";
import { RedisService } from "../infrastructure/redis.service";
import { DbHealthIndicator } from "../db/db-health-indicator";

export interface HealthReport {
  isHealthy: boolean;
  dependencies: {
    redis: boolean;
    db: boolean;
  };
}

@Injectable()
export class StatusService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(DbHealthIndicator)
    private readonly dbHealthIndicator: DbHealthIndicator
  ) {}

  async getStatus(): Promise<HealthReport> {
    // TODO: email check

    const redisIsHealthy = await this.redisService.isHealthy();
    const dbIsHealthy = await this.dbHealthIndicator.isHealthy();

    const enteIsHealthy = redisIsHealthy && dbIsHealthy;
    const healthReport: HealthReport = {
      isHealthy: enteIsHealthy,
      dependencies: {
        redis: redisIsHealthy,
        db: dbIsHealthy,
      },
    };

    return healthReport;
  }
}
