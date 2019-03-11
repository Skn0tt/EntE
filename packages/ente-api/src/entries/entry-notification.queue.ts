import { Injectable, Inject, forwardRef } from "@nestjs/common";
import * as Bull from "bull";
import { WinstonLoggerService } from "../winston-logger.service";
import { EntriesService } from "./entries.service";
import { BullQueue } from "../bull.queue";

const ENTRY_NOTIFICATION_QUEUE_NAME = "ENTRY_NOTIFICATION_QUEUE";

interface EntryNotificationJobPayload {
  entryId: string;
}

interface EntryNotificationJobDependencies {
  entriesService: EntriesService;
  logger: WinstonLoggerService;
}

@Injectable()
export class EntryNotificationQueue extends BullQueue<
  EntryNotificationJobPayload
> {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
    @Inject(forwardRef(() => EntriesService))
    private readonly entriesService: EntriesService
  ) {
    super(
      ENTRY_NOTIFICATION_QUEUE_NAME,
      EntryNotificationQueue.createProcessor({
        entriesService,
        logger
      }),
      logger
    );
  }

  private static createProcessor(deps: EntryNotificationJobDependencies) {
    return async function process(job: Bull.Job<EntryNotificationJobPayload>) {
      const { id, data } = job;
      const { entryId } = data;

      deps.logger.log(`Received EntryNotificationJob for '${entryId}'`, {
        jobId: id
      });

      await deps.entriesService.sendNotification(entryId);

      deps.logger.log(`Successfully completed job.`, { jobId: id });
    };
  }

  public async addJob(entryId: string, delay: number) {
    await this.queue.add({ entryId }, { delay });
    this.logger.log(
      `Successfully added a new job for entry ${entryId} to run in ${delay} ms.`
    );
  }
}
