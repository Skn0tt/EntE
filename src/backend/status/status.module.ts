import { Module } from "@nestjs/common";
import { StatusService } from "./status.service";
import { StatusController } from "./status.controller";
import { AuthModule } from "../auth/auth.module";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { DbModule } from "../db/db.module";

@Module({
  imports: [AuthModule, InfrastructureModule, DbModule],
  providers: [StatusService],
  controllers: [StatusController],
})
export class StatusModule {}
