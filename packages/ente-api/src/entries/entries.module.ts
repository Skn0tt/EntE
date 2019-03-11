import { Module } from "@nestjs/common";
import { EntriesService } from "./entries.service";
import { EntriesController } from "./entries.controller";
import { EmailModule } from "../email/email.module";
import { DbModule } from "../db/db.module";
import { InstanceConfigModule } from "../instance-config/instance-config.module";
import { EntryNotificationQueue } from "./entry-notification.queue";

@Module({
  imports: [DbModule, EmailModule, InstanceConfigModule],
  providers: [EntriesService, EntryNotificationQueue],
  controllers: [EntriesController],
  exports: [EntriesService]
})
export class EntriesModule {}
