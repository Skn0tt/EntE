import { EntryModel } from "../models/Entry";
import * as mail from "nodemailer";
import * as sgTransport from "nodemailer-sendgrid-transport";
import * as Handlebars from "handlebars";
import User from "../models/User";
import Slot, { SlotModel } from "../models/Slot";
import WeeklySummary, { IRowData } from "../templates/WeeklySummary";
import PasswordResetLink from "../templates/PasswordResetLink";
import PasswordResetSuccess from "../templates/PasswordResetSuccess";
import SignedInformation from "../templates/SignedInformation";
import SignRequest from "../templates/SignRequest";
import { Roles } from "ente-types";

const baseUrl = `https://${process.env.HOST}`;

const mailConfig =
  process.env.NODE_ENV === "production"
    ? sgTransport({
        auth: {
          api_key:
            "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"
        }
      })
    : {
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "louf4yh5lnkyg2h3@ethereal.email",
          pass: "mWgCFb9JcJxdeKa6RE"
        }
      };

const transporter = mail.createTransport(mailConfig);

/**
 * ## Handlebars Templates
 */
export const dispatchSignRequest = async (entry: EntryModel) => {
  try {
    const { html, subject } = SignRequest(`${baseUrl}/entries/${entry._id}`);

    const parents = await User.find({ children: entry.student }).select(
      "email"
    );

    const recipients = parents.map(parent => parent.email);

    const info = await transporter.sendMail({
      html,
      subject,
      to: recipients,
      from: "EntE@simonknott.de"
    });

    console.log("Mail: Dispatched SignRequest to", info.accepted);
  } catch (error) {
    throw error;
  }
};

export const dispatchSignedInformation = async (entry: EntryModel) => {
  try {
    const { html, subject } = SignedInformation(
      `${baseUrl}/entries/${entry._id}`
    );

    const parents = await User.find({ children: entry.student }).select(
      "email"
    );

    const recipients = parents.map(parent => parent.email);

    const info = await transporter.sendMail({
      html,
      subject,
      to: recipients,
      from: "EntE@simonknott.de"
    });

    console.log("Mail: Dispatched SignedInformation to", info.accepted);
  } catch (error) {
    throw error;
  }
};

const twoWeeksBefore: Date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
export const dispatchWeeklySummary = async (): Promise<void> => {
  try {
    const teachers = await User.find({ role: Roles.TEACHER });
    teachers.forEach(async teacher => {
      try {
        const slots: SlotModel[] = await Slot.find({
          teacher: teacher._id,
          date: { $gte: twoWeeksBefore }
        });

        const items: IRowData[] = await Promise.all(
          slots.map(async slot => {
            const student = await User.findById(slot.student);

            return {
              displayname: student.displayname,
              date: slot.date,
              signed: slot.signed,
              hour_from: slot.hour_from,
              hour_to: slot.hour_to
            };
          })
        );

        const email = teacher.email;

        const { html, subject } = WeeklySummary(items);

        const info = await transporter.sendMail({
          html,
          subject,
          to: email,
          from: "EntE@simonknott.de"
        });
        console.log("Mail: Dispatched WeeklySummary to", info.accepted);
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};

export const dispatchPasswortResetLink = async (
  token: string,
  username: string,
  email: string
) => {
  try {
    const { html, subject } = PasswordResetLink(
      `${baseUrl}/forgot/${token}`,
      username
    );

    const info = await transporter.sendMail({
      html,
      subject,
      to: email,
      from: "EntE@simonknott.de"
    });
    console.log("Mail: Dispatched PasswortResetLink to", info.accepted);
  } catch (error) {
    throw error;
  }
};

export const dispatchPasswortResetSuccess = async (
  username: string,
  email: string
) => {
  try {
    const { html, subject } = PasswordResetSuccess(username);

    const info = await transporter.sendMail({
      html,
      subject,
      to: email,
      from: "EntE@simonknott.de"
    });
    console.log("Mail: Dispatched PasswortResetSuccess to", info.accepted);
  } catch (error) {
    console.error(error);
  }
};

export const checkEmail = async (): Promise<void> => {
  try {
    const result = await transporter.verify();
    console.log("SMTP Connection Works.");
  } catch (error) {
    console.log("Error: SMTP couldn't connect.");
  }
};
