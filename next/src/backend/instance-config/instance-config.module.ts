import { Module } from "@nestjs/common";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { InstanceConfigController } from "./instance-config.controller";
import { InstanceConfigService } from "./instance-config.service";

@Module({
  controllers: [InstanceConfigController],
  providers: [InstanceConfigService],
  imports: [InfrastructureModule],
  exports: [InstanceConfigService],
})
export class InstanceConfigModule {}
