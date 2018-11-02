import { Injectable, Inject } from "@nestjs/common";
import { Validation, Success, Fail } from "monet";
import { RailmailService } from "../infrastructure/railmail.service";
import { RedisService } from "../infrastructure/redis.service";
import { SignerService } from "../infrastructure/signer.service";

enum ConnectionUnhealthy {
  RailMail = "CONNECTION_UNHEALTHY_RAILMAIL",
  Redis = "CONNECTION_UNHEALTHY_REDIS",
  Signer = "CONNECTION_UNHEALTHY_SIGNER"
}

@Injectable()
export class StatusService {
  constructor(
    @Inject(RailmailService) private readonly railmailService: RailmailService,
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(SignerService) private readonly signerService: SignerService
  ) {}

  async getStatus(): Promise<Validation<ConnectionUnhealthy[], boolean>> {
    const errors: ConnectionUnhealthy[] = [];

    if (!await this.railmailService.isHealthy()) {
      errors.push(ConnectionUnhealthy.RailMail);
    }

    if (!await this.redisService.isHealthy()) {
      errors.push(ConnectionUnhealthy.Redis);
    }

    if (!await this.signerService.isHealthy()) {
      errors.push(ConnectionUnhealthy.Redis);
    }

    return errors.length === 0 ? Success(true) : Fail(errors);
  }
}
