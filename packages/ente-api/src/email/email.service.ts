import { Injectable, Inject, LoggerService } from "@nestjs/common";
import {
  WeeklySummaryRowData,
  WeeklySummary
} from "../templates/WeeklySummary";
import { UserDto, SlotDto, Languages } from "ente-types";
import { WinstonLoggerService } from "../winston-logger.service";
import { NodemailerService } from "../infrastructure/nodemailer.service";
import { EmailTransportService } from "../infrastructure/email-transport.service";
import { SignedInformation } from "../templates/SignedInformation";
import { PasswordResetLink } from "../templates/PasswordResetLink";
import { PasswordResetSuccess } from "../templates/PasswordResetSuccess";
import { SignRequest } from "../templates/SignRequest";

@Injectable()
export class EmailService {
  constructor(
    @Inject(NodemailerService)
    private readonly emailTransport: EmailTransportService,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async dispatchSignRequest(link: string, recipients: UserDto[]) {
    const { html, subject } = await SignRequest(link, Languages.GERMAN);
    await this.emailTransport.sendMail({
      recipients: recipients.map(r => r.email),
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully dispatched SignRequest to ${JSON.stringify(
        recipients.map(r => [r.username, r.email])
      )}`
    );
  }

  async dispatchSignedInformation(link: string, recipients: UserDto[]) {
    await Promise.all(
      recipients.map(async recipient => {
        const { html, subject } = await SignedInformation(
          link,
          Languages.GERMAN
        );
        await this.emailTransport.sendMail({
          recipients: [recipient.email],
          body: {
            html
          },
          subject
        });
        this.logger.log(
          `Successfully dispatched SignedInformation to ${JSON.stringify(
            recipients.map(r => [r.username, r.email])
          )}`
        );
      })
    );
  }

  async dispatchPasswordResetLink(link: string, user: UserDto) {
    const { subject, html } = await PasswordResetLink(
      link,
      user.username,
      Languages.GERMAN
    );
    await this.emailTransport.sendMail({
      recipients: [user.email],
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully dispatched PasswordResetLink to ${user.username}, ${
        user.email
      }`
    );
  }

  async dispatchPasswordResetSuccess(user: UserDto) {
    const { subject, html } = await PasswordResetSuccess(
      user.username,
      Languages.GERMAN
    );
    await this.emailTransport.sendMail({
      recipients: [user.email],
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully dispatched PasswordResetSuccess to ${user.username}, ${
        user.email
      }`
    );
  }

  async dispatchWeeklySummary(teacher: UserDto, slots: SlotDto[]) {
    const data = slots.map<WeeklySummaryRowData>(s => ({
      date: s.date,
      displayname: s.student.displayname,
      hour_from: s.from,
      hour_to: s.to,
      signed: s.signed
    }));
    const { html, subject } = await WeeklySummary(data, Languages.GERMAN);
    await this.emailTransport.sendMail({
      recipients: [teacher.email],
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully dispatched WeeklySummary to ${teacher.username}, ${
        teacher.email
      }`
    );
  }
}
