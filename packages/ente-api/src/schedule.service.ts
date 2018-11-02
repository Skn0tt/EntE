import { Injectable, Inject } from "@nestjs/common";
import { Cron, NestSchedule } from "nest-schedule";
import { Config } from "./helpers/config";
import { SlotsService } from "./slots/slots.service";

@Injectable()
export class ScheduleService extends NestSchedule {
  public constructor(
    @Inject(SlotsService) private readonly slotsService: SlotsService
  ) {
    super();
  }

  @Cron(Config.getWeeklySummaryCron(), {
    enable: Config.isCronEnabled()
  })
  async dispatchWeeklyEmail() {
    await this.slotsService.dispatchWeeklySummary();
  }
}
