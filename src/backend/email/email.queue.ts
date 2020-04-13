import { Injectable, Inject, LoggerService } from "@nestjs/common";
import { WinstonLoggerService } from "../winston-logger.service";
import {
  EmailTransportService,
  Envelope,
} from "../infrastructure/email-transport.service";
import { SubscribeableRetryBullQueue } from "../bull.queue";
import { NodemailerService } from "../infrastructure/nodemailer.service";
import { Config } from "../helpers/config";

@Injectable()
export class EmailQueue {
  private queue: SubscribeableRetryBullQueue<Envelope>;

  constructor(
    @Inject(WinstonLoggerService) private readonly logger: LoggerService,
    @Inject(NodemailerService) emailTransport: EmailTransportService
  ) {
    const { retryDelay } = Config.getMailConfig();
    this.queue = new SubscribeableRetryBullQueue(
      "emailQueue",
      this.logger,
      retryDelay
    );

    this.queue.subscribe((envelope) => emailTransport.sendMail(envelope));
  }

  async sendMail(envelope: Envelope): Promise<void> {
    await this.queue.enqueue(envelope);
  }
}
