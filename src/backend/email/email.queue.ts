import { Injectable, Inject } from "@nestjs/common";
import {
  EmailTransportService,
  Envelope,
} from "../infrastructure/email-transport.service";
import { NodemailerService } from "../infrastructure/nodemailer.service";
import { Processor, Process, InjectQueue } from "@nestjs/bull";
import { Job, Queue } from "bull";

export const EMAIL_QUEUE_KEY = "email";

@Injectable()
export class EmailQueue {
  constructor(
    @InjectQueue(EMAIL_QUEUE_KEY) private readonly queue: Queue<Envelope>
  ) {}

  async sendMail(envelope: Envelope): Promise<void> {
    await this.queue.add(envelope, {
      attempts: 10,
      backoff: {
        type: "exponential",
        delay: 500,
      },
    });
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
