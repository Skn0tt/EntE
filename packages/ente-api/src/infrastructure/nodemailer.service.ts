import {
  Injectable,
  OnModuleInit,
  LoggerService,
  Inject
} from "@nestjs/common";
import { Config } from "../helpers/config";
import * as nodemailer from "nodemailer";
import { WinstonLoggerService } from "../winston-logger.service";
import { EmailTransportService, Envelope } from "./email-transport.service";

@Injectable()
export class NodemailerService implements EmailTransportService, OnModuleInit {
  private readonly transport: nodemailer.Transporter;
  private readonly sender: string;

  constructor(
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {
    const config = Config.getMailConfig();
    this.sender = `${config.sender} <${config.address}>`;
    this.transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      pool: config.pool as true,
      auth: {
        user: config.username,
        pass: config.password
      }
    });
  }

  async onModuleInit() {
    try {
      await this.transport.verify();
      this.logger.log("SMTP connection works.");
    } catch (error) {
      this.logger.error("SMTP connection does not work.");
    }
  }

  async sendMail(envelope: Envelope) {
    await this.transport.sendMail({
      to: envelope.recipients,
      subject: envelope.subject,
      text: envelope.body.text,
      html: envelope.body.html,
      from: this.sender
    });
  }
}
