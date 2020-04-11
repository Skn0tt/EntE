import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { EmailQueue } from "./email.queue";

@Module({
  imports: [InfrastructureModule],
  providers: [EmailService, EmailQueue],
  exports: [EmailService],
})
export class EmailModule {}
