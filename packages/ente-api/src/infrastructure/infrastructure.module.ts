import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { SignerService } from "./signer.service";
import { NodemailerService } from "./nodemailer.service";

@Module({
  providers: [RedisService, SignerService, NodemailerService],
  exports: [RedisService, SignerService, NodemailerService]
})
export class InfrastructureModule {}
