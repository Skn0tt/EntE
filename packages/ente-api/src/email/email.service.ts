import { Injectable, Inject, LoggerService } from "@nestjs/common";
import { RailmailService } from "../infrastructure/railmail.service";
import SignRequest from "../templates/SignRequest";
import SignedInformation from "../templates/SignedInformation";
import PasswordResetLink from "../templates/PasswordResetLink";
import PasswordResetSuccess from "../templates/PasswordResetSuccess";
import WeeklySummary, {
  WeeklySummaryRowData
} from "../templates/WeeklySummary";
import { UserDto, SlotDto } from "ente-types";
import { WinstonLoggerService } from "../winston-logger.service";

@Injectable()
export class EmailService {
  constructor(
    @Inject(RailmailService) private readonly railMailService: RailmailService,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async dispatchSignRequest(link: string, recipients: UserDto[]) {
    const { html, subject } = await SignRequest(link);
    await this.railMailService.sendMail({
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
    const { html, subject } = await SignedInformation(link);
    await this.railMailService.sendMail({
      recipients: recipients.map(r => r.email),
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
  }

  async dispatchPasswordResetLink(link: string, user: UserDto) {
    const { subject, html } = await PasswordResetLink(link, user.username);
    await this.railMailService.sendMail({
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
    const { subject, html } = await PasswordResetSuccess(user.username);
    await this.railMailService.sendMail({
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
    const { html, subject } = await WeeklySummary(data);
    await this.railMailService.sendMail({
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
