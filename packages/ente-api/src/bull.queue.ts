import * as Bull from "bull";
import { Config } from "./helpers/config";
import { LoggerService } from "@nestjs/common";

type JobProcessor<T> = (job: Bull.Job<T>) => Promise<void> | void;

export abstract class BullQueue<T> {
  protected queue: Bull.Queue<T>;

  constructor(
    queueName: string,
    processor: JobProcessor<T>,
    logger: LoggerService
  ) {
    const { host, port, prefix } = Config.getRedisConfig();

    this.queue = new Bull(queueName, {
      redis: {
        port,
        host,
        keyPrefix: prefix
      }
    });

    this.queue.process(processor);

    logger.log(`Successfully connected to bull queue '${queueName}'.`);
  }
}
