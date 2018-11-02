import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { RailmailService } from "../infrastructure/railmail.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [EmailService, RailmailService],
  exports: [EmailService]
})
export class EmailModule {}
