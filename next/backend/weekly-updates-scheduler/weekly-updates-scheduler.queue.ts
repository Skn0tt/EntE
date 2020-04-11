import { BullQueue } from "../bull.queue";
import { WinstonLoggerService } from "../winston-logger.service";
import { SlotsService } from "../slots/slots.service";
import { Inject } from "@nestjs/common";
import { Config } from "../helpers/config";
import { Maybe } from "monet";

interface WeeklyUpdateJobPayload {}

const WEEKLY_UPDATE_QUEUE_NAME = "WEEKLY_UPDATE_SCHEDULE";

interface WeeklyUpdateProcessorDependencies {
  slotsService: SlotsService;
}

export class WeeklyUpdateScheduler extends BullQueue<WeeklyUpdateJobPayload> {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
    @Inject(SlotsService)
    private readonly slotsService: SlotsService
  ) {
    super(
      WEEKLY_UPDATE_QUEUE_NAME,
      WeeklyUpdateScheduler.createProcessor({ slotsService }),
      logger
    );

    const cron = Config.getWeeklySummaryCron();
    this.updateSchedule(cron);
  }

  async updateSchedule(newCron: string) {
    await this.queue.clean(0);

    await this.queue.add(
      {},
      {
        repeat: {
          cron: newCron,
        },
      }
    );
  }

  async getCurrentSchedule(): Promise<Maybe<string>> {
    const jobs = await this.queue.getRepeatableJobs();

    return Maybe.fromUndefined(jobs[0]).map((j) => j.cron);
  }

  private static createProcessor(deps: WeeklyUpdateProcessorDependencies) {
    return async function process(job: WeeklyUpdateJobPayload) {
      await deps.slotsService.dispatchWeeklySummary();
    };
  }
}
