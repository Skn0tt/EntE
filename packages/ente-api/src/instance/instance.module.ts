import { Module } from "@nestjs/common";
import { InstanceController } from "./instance.controller";
import { InstanceService } from "./instance.service";
import { DbModule } from "../db/db.module";

@Module({
  controllers: [InstanceController],
  providers: [InstanceService],
  imports: [DbModule]
})
export class InstanceModule {}
