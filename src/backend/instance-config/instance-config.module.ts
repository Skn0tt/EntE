import { Module } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { InstanceConfigController } from "./instance-config.controller";
import { InstanceConfigService } from "./instance-config.service";
import { DbModule } from "../db/db.module";

@Module({
  controllers: [InstanceConfigController],
  providers: [InstanceConfigService],
  imports: [InfrastructureModule, DbModule],
  exports: [InstanceConfigService],
})
export class InstanceConfigModule {}
