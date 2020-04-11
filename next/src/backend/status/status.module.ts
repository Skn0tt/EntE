import { Module } from "@nestjs/common";
import { StatusService } from "./status.service";
import { StatusController } from "./status.controller";
import { AuthModule } from "../auth/auth.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [AuthModule, InfrastructureModule],
  providers: [StatusService],
  controllers: [StatusController],
})
export class StatusModule {}
