import { Module } from "@nestjs/common";
import { EntriesService } from "./entries.service";
import { EntriesController } from "./entries.controller";
import { EmailModule } from "../email/email.module";
import { DbModule } from "../db/db.module";
import { InstanceConfigModule } from "../instance-config/instance-config.module";
import {
  EntryNotificationQueue,
  ENTRY_NOTIFICATION_QUEUE_KEY,
  EntryNotificationProcessor,
} from "./entry-notification.queue";
import { Config } from "../helpers/config";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    DbModule,
    EmailModule,
    InstanceConfigModule,
    BullModule.registerQueue({
      name: ENTRY_NOTIFICATION_QUEUE_KEY,
      redis: Config.getIORedisConfig(),
    }),
  ],
  providers: [
    EntriesService,
    EntryNotificationQueue,
    EntryNotificationProcessor,
  ],
  controllers: [EntriesController],
  exports: [EntriesService],
})
export class EntriesModule {}
