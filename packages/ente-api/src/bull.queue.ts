import * as Bull from "bull";
import { Config } from "./helpers/config";
import { LoggerService } from "@nestjs/common";
import { Maybe, None, Some, Validation } from "monet";

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

type BullQueueObserver<T> = (value: T) => Promise<Validation<string, void>>;

export class SubscribeableRetryBullQueue<T> extends BullQueue<T> {
  constructor(
    queueName: string,
    private logger: LoggerService,
    private retryDelay: number
  ) {
    super(queueName, job => this.processor(job), logger);
  }

  private subscriber: Maybe<BullQueueObserver<T>> = None();

  private processor: JobProcessor<T> = async job => {
    if (this.subscriber.isSome()) {
      const result = await this.subscriber.some()(job.data);
      result.forEachFail(() => {
        this.logger.log(`Job ${job.id} failed, retrying in ${this.retryDelay}`);
        this.enqueue(job.data, {
          delay: this.retryDelay
        });
      });
    }
  };

  public subscribe = (observer: BullQueueObserver<T>) =>
    (this.subscriber = Some(observer));

  public async enqueue(value: T, opts?: Bull.JobOptions): Promise<Bull.JobId> {
    if (!!this.logger.debug) {
      this.logger.debug(`Enqueueing ${JSON.stringify(value)}`);
    }

    const job = await this.queue.add(value, opts);
    return job.id;
  }
}
