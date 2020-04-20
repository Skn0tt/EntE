import { Injectable, Inject, forwardRef } from "@nestjs/common";
import * as Bull from "bull";
import { WinstonLoggerService } from "../winston-logger.service";
import { EntriesService } from "./entries.service";
import { InjectQueue, Processor, Process } from "@nestjs/bull";
import { ENTRY_NOTIFICATION_QUEUE_KEY } from "../app.module";

interface EntryNotificationJobPayload {
  entryId: string;
}

@Injectable()
export class EntryNotificationQueue {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
    @InjectQueue(ENTRY_NOTIFICATION_QUEUE_KEY)
    private readonly queue: Bull.Queue<EntryNotificationJobPayload>
  ) {}

  public async addJob(entryId: string, delay: number) {
    await this.queue.add({ entryId }, { delay });
    this.logger.log(
      `Successfully added a new job for entry ${entryId} to run in ${delay} ms.`
    );
  }
}

@Processor(ENTRY_NOTIFICATION_QUEUE_KEY)
export class EntryNotificationProcessor {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
    @Inject(forwardRef(() => EntriesService))
    private readonly entriesService: EntriesService
  ) {}

  @Process()
  async process(job: Bull.Job<EntryNotificationJobPayload>) {
    const { id, data } = job;
    const { entryId } = data;

    this.logger.log(`Received EntryNotificationJob for '${entryId}'`, {
      jobId: id,
    });

    await this.entriesService.sendNotification(entryId);

    this.logger.log(`Successfully completed job.`, { jobId: id });
  }
}
