import { Module } from "@nestjs/common";
import { RailmailService } from "./railmail.service";
import { RedisService } from "./redis.service";
import { SignerService } from "./signer.service";

@Module({
  providers: [RailmailService, RedisService, SignerService],
  exports: [RailmailService, RedisService, SignerService]
})
export class InfrastructureModule {}
