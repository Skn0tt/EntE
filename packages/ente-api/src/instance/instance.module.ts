import { Module } from "@nestjs/common";
import { InstanceController } from "./instance.controller";
import { InstanceService } from "./instance.service";
import { DbModule } from "../db/db.module";
import { InstanceConfigModule } from "../instance-config/instance-config.module";
import { PasswordResetModule } from "../password-reset/password-reset.module";

@Module({
  controllers: [InstanceController],
  providers: [InstanceService],
  imports: [DbModule, InstanceConfigModule, PasswordResetModule]
})
export class InstanceModule {}
