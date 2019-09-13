import { Injectable, Inject, LoggerService } from "@nestjs/common";
import {
  WeeklySummaryRowData,
  WeeklySummary
} from "../templates/WeeklySummary";
import { UserDto, SlotDto, EntryDto } from "ente-types";
import { WinstonLoggerService } from "../winston-logger.service";
import { SignedInformation } from "../templates/SignedInformation";
import { PasswordResetLink } from "../templates/PasswordResetLink";
import { PasswordResetSuccess } from "../templates/PasswordResetSuccess";
import { EntryDeletedNotification } from "../templates/EntryDeletedNotification";
import { SignRequest } from "../templates/SignRequest";
import { InvitationLink } from "../templates/InvitationLink";
import { ManagerSignedInformation } from "../templates/ManagerSignedInformation";
import { ManagerUnsignedInformation } from "../templates/ManagerUnsignedInformation";
import { EntryStillUnsignedNotification } from "../templates/EntryStillUnsignedNotification";
import { EmailQueue } from "./email.queue";

@Injectable()
export class EmailService {
  constructor(
    @Inject(EmailQueue)
    private readonly emailQueue: EmailQueue,
    @Inject(WinstonLoggerService) private readonly logger: LoggerService
  ) {}

  async dispatchSignRequest(link: string, recipients: UserDto[]) {
    await Promise.all(
      recipients.map(async recipient => {
        const { html, subject } = await SignRequest(link, recipient.language);
        await this.emailQueue.sendMail({
          recipients: [recipient.email],
          body: {
            html
          },
          subject
        });
        this.logger.log(
          `Successfully enqueued SignRequest to ${JSON.stringify([
            recipient.username,
            recipient.email
          ])}`
        );
      })
    );
  }

  async dispatchSignedInformation(link: string, recipients: UserDto[]) {
    await Promise.all(
      recipients.map(async recipient => {
        const { html, subject } = await SignedInformation(
          link,
          recipient.language
        );
        await this.emailQueue.sendMail({
          recipients: [recipient.email],
          body: {
            html
          },
          subject
        });
        this.logger.log(
          `Successfully enqueued SignedInformation to ${JSON.stringify([
            recipient.username,
            recipient.email
          ])}`
        );
      })
    );
  }

  async dispatchManagerSignedInformation(link: string, recipients: UserDto[]) {
    await Promise.all(
      recipients.map(async recipient => {
        const { html, subject } = await ManagerSignedInformation(
          link,
          recipient.language
        );
        await this.emailQueue.sendMail({
          recipients: [recipient.email],
          body: {
            html
          },
          subject
        });
        this.logger.log(
          `Successfully enqueued ManagerSignedInformation to ${JSON.stringify([
            recipient.username,
            recipient.email
          ])}`
        );
      })
    );
  }

  async dispatchManagerUnsignedInformation(
    link: string,
    recipients: UserDto[]
  ) {
    await Promise.all(
      recipients.map(async recipient => {
        const { html, subject } = await ManagerUnsignedInformation(
          link,
          recipient.language
        );
        await this.emailQueue.sendMail({
          recipients: [recipient.email],
          body: {
            html
          },
          subject
        });
        this.logger.log(
          `Successfully enqueued ManagerUnsignedInformation to ${JSON.stringify(
            [recipient.username, recipient.email]
          )}`
        );
      })
    );
  }

  async dispatchEntryDeletedNotification(
    entry: EntryDto,
    recipients: UserDto[]
  ) {
    await Promise.all(
      recipients.map(async recipient => {
        const { html, subject } = await EntryDeletedNotification(
          entry,
          recipient,
          recipient.language
        );
        await this.emailQueue.sendMail({
          recipients: [recipient.email],
          body: {
            html
          },
          subject
        });
        this.logger.log(
          `Successfully enqueued EntryDeletedInformation to ${JSON.stringify([
            recipient.username,
            recipient.email
          ])}`
        );
      })
    );
  }

  async dispatchEntryStillUnsignedNotification(
    link: string,
    recipients: UserDto[]
  ) {
    await Promise.all(
      recipients.map(async recipient => {
        const { html, subject } = await EntryStillUnsignedNotification(
          link,
          recipient.language
        );
        await this.emailQueue.sendMail({
          recipients: [recipient.email],
          body: {
            html
          },
          subject
        });
        this.logger.log(
          `Successfully enqueued EntryStillUnsignedNotification to ${JSON.stringify(
            [recipient.username, recipient.email]
          )}`
        );
      })
    );
  }

  async dispatchPasswordResetLink(link: string, user: UserDto) {
    const { subject, html } = await PasswordResetLink(
      link,
      user.username,
      user.language
    );
    await this.emailQueue.sendMail({
      recipients: [user.email],
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully enqueued PasswordResetLink to ${user.username}, ${
        user.email
      }`
    );
  }

  async dispatchInvitationLink(link: string, user: UserDto) {
    const { subject, html } = await InvitationLink(
      link,
      user.role,
      user.language
    );
    await this.emailQueue.sendMail({
      recipients: [user.email],
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully enqueued InvitationLink to ${user.username}, ${user.email}`
    );
  }

  async dispatchPasswordResetSuccess(user: UserDto) {
    const { subject, html } = await PasswordResetSuccess(
      user.username,
      user.language
    );
    await this.emailQueue.sendMail({
      recipients: [user.email],
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully enqueued PasswordResetSuccess to ${user.username}, ${
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
      signed: s.signed,
      educational: s.forSchool
    }));
    const { html, subject } = await WeeklySummary(data, teacher.language);
    await this.emailQueue.sendMail({
      recipients: [teacher.email],
      body: {
        html
      },
      subject
    });
    this.logger.log(
      `Successfully enqueued WeeklySummary to ${teacher.username}, ${
        teacher.email
      }`
    );
  }
}
