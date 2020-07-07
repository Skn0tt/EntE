import { Module } from "@nestjs/common";
import { SlotsService } from "./slots.service";
import { SlotsController } from "./slots.controller";
import { DbModule } from "../db/db.module";
import { EmailModule } from "../email/email.module";
import { InstanceConfigModule } from "../instance-config/instance-config.module";

@Module({
  imports: [DbModule, EmailModule, InstanceConfigModule],
  providers: [SlotsService],
  controllers: [SlotsController],
  exports: [SlotsService],
})
export class SlotsModule {}
