import { Module } from "@nestjs/common";
import { InstanceController } from "./instance.controller";
import { InstanceService } from "./instance.service";
import { DbModule } from "../db/db.module";
import { InstanceConfigModule } from "../instance-config/instance-config.module";

@Module({
  controllers: [InstanceController],
  providers: [InstanceService],
  imports: [DbModule, InstanceConfigModule]
})
export class InstanceModule {}
