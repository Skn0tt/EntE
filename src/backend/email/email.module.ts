import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { EmailQueue, EMAIL_QUEUE_KEY, EmailProcessor } from "./email.queue";
import { BullModule } from "@nestjs/bull";
import { Config } from "../helpers/config";

@Module({
  imports: [
    InfrastructureModule,
    BullModule.registerQueue({
      name: EMAIL_QUEUE_KEY,
      redis: Config.getIORedisConfig(),
    }),
  ],
  providers: [EmailService, EmailQueue, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
