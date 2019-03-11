import { Module } from "@nestjs/common";
import { SlotsModule } from "../slots/slots.module";
import { WeeklyUpdateScheduler } from "./weekly-updates-scheduler.queue";

@Module({
  imports: [SlotsModule],
  providers: [WeeklyUpdateScheduler]
})
export class WeeklyUpdatesSchedulerModule {}
