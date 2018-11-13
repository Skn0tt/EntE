import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
