import { Injectable, Inject, LoggerService } from "@nestjs/common";
import {
  EmailTransportService,
  Envelope,
} from "../infrastructure/email-transport.service";
import { NodemailerService } from "../infrastructure/nodemailer.service";
import { Processor, Process, InjectQueue } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { Validation, Success } from "monet";
import { WinstonLoggerService } from "../winston-logger.service";

export const EMAIL_QUEUE_KEY = "email";

@Injectable()
export class EmailQueue implements EmailTransportService {
  constructor(
    @InjectQueue(EMAIL_QUEUE_KEY) private readonly queue: Queue<Envelope>,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async sendMail(envelope: Envelope): Promise<Validation<string, void>> {
    await this.queue.add(envelope, {
      attempts: 10,
      backoff: {
        type: "exponential",
        delay: 500,
      },
    });

    this.logger.log(
      `Successfully enqueued '${
        envelope.subject
      }' to ${envelope.recipients.join(", ")}`
    );

    return Success(undefined);
  }
}

@Processor(EMAIL_QUEUE_KEY)
export class EmailProcessor {
  constructor(
    @Inject(NodemailerService)
    private readonly emailTransport: EmailTransportService
  ) {}

  @Process()
  async process(job: Job<Envelope>) {
    const response = await this.emailTransport.sendMail(job.data);
    response.success(); // throw exception
  }
}
