import { Module } from "@nestjs/common";
import { StatusService } from "./status.service";
import { StatusController } from "./status.controller";
import { EmailModule } from "../email/email.module";
import { AuthModule } from "../auth/auth.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [EmailModule, AuthModule, InfrastructureModule],
  providers: [StatusService],
  controllers: [StatusController]
})
export class StatusModule {}
