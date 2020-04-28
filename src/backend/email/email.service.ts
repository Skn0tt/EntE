import { Injectable, Inject } from "@nestjs/common";
import {
  WeeklySummaryRowData,
  WeeklySummary,
} from "../templates/WeeklySummary";
import { UserDto, SlotDto, EntryDto, CreatePrefiledSlotsDto } from "@@types";
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
import { SlotPrefiledNotification } from "../templates/SlotPrefiledNotification";
import { EmailTransportService } from "../infrastructure/email-transport.service";
import { TwoFAEnabledNotification } from "../templates/2FAEnabledNotification";
import { TwoFADisabledNotification } from "../templates/2FADisabledNotification";

@Injectable()
export class EmailService {
  constructor(
    @Inject(EmailQueue)
    private readonly emailTransport: EmailTransportService
  ) {}

  private async dispatch(
    mail: { html: string; subject: string },
    recipients: UserDto[]
  ) {
    await Promise.all(
      recipients.map(async (recipient) => {
        await this.emailTransport.sendMail({
          recipients: [recipient.email],
          subject: mail.subject,
          body: {
            html: mail.html,
          },
        });
      })
    );
  }

  private async dispatchTemplate(
    getMail: (recipient: UserDto) => { html: string; subject: string },
    recipient: UserDto[]
  ) {
    await Promise.all(
      recipient.map((recipient) =>
        this.dispatch(getMail(recipient), [recipient])
      )
    );
  }

  async dispatch2FAEnabledNotification(user: UserDto) {
    await this.dispatchTemplate(
      (r) => TwoFAEnabledNotification(r.language, {}),
      [user]
    );
  }

  async dispatch2FADisabledNotification(user: UserDto) {
    await this.dispatchTemplate(
      (r) => TwoFADisabledNotification(r.language, {}),
      [user]
    );
  }

  async dispatchSignRequest(link: string, recipients: UserDto[]) {
    await this.dispatchTemplate(
      (r) => SignRequest(link, r.language),
      recipients
    );
  }

  async dispatchSignedInformation(link: string, recipients: UserDto[]) {
    await this.dispatchTemplate(
      (r) => SignedInformation(link, r.language),
      recipients
    );
  }

  async dispatchManagerSignedInformation(link: string, recipients: UserDto[]) {
    await this.dispatchTemplate(
      (r) => ManagerSignedInformation(link, r.language),
      recipients
    );
  }

  async dispatchManagerUnsignedInformation(
    link: string,
    recipients: UserDto[]
  ) {
    await this.dispatchTemplate(
      (r) => ManagerUnsignedInformation(link, r.language),
      recipients
    );
  }

  async dispatchEntryDeletedNotification(
    entry: EntryDto,
    recipients: UserDto[]
  ) {
    await this.dispatchTemplate(
      (r) => EntryDeletedNotification(entry, r, r.language),
      recipients
    );
  }

  async dispatchSlotPrefiledNotification(
    data: CreatePrefiledSlotsDto,
    students: UserDto[],
    teacher: UserDto
  ) {
    await this.dispatchTemplate(
      (r) =>
        SlotPrefiledNotification(
          teacher.displayname,
          data.date,
          data.hour_from,
          data.hour_to,
          r.language
        ),
      students
    );
  }

  async dispatchEntryStillUnsignedNotification(
    link: string,
    recipients: UserDto[]
  ) {
    await this.dispatchTemplate(
      (r) => EntryStillUnsignedNotification(link, r.language),
      recipients
    );
  }

  async dispatchPasswordResetLink(link: string, user: UserDto) {
    await this.dispatchTemplate(
      (r) => PasswordResetLink(link, r.username, r.language),
      [user]
    );
  }

  async dispatchInvitationLink(link: string, user: UserDto) {
    await this.dispatchTemplate(
      (r) => InvitationLink(link, user.role, r.language),
      [user]
    );
  }

  async dispatchPasswordResetSuccess(user: UserDto) {
    await this.dispatchTemplate(
      (r) => PasswordResetSuccess(r.username, r.language),
      [user]
    );
  }

  async dispatchWeeklySummary(teacher: UserDto, slots: SlotDto[]) {
    const data = slots.map<WeeklySummaryRowData>((s) => ({
      date: s.date,
      displayname: s.student.displayname,
      hour_from: s.from,
      hour_to: s.to,
      signed: s.signed,
      educational: s.forSchool,
    }));

    await this.dispatchTemplate((r) => WeeklySummary(data, teacher.language), [
      teacher,
    ]);
  }
}
