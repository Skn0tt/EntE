import * as mail from "nodemailer";
import * as Handlebars from "handlebars";
import * as templates from "ente-mail";
import { Roles, IEntry, ISlot } from "ente-types";
import { User, Slot } from "ente-db";
import * as _ from "lodash";
import { getConfig } from "./config";

const config = getConfig();

const transporter = mail.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.password
  }
});

const baseUrl = `https://${config.host}`;

/**
 * ## Handlebars Templates
 */
export const dispatchSignRequest = async (entry: IEntry) => {
  try {
    const { html, subject } = templates.SignRequest(
      `${baseUrl}/entries/${entry._id}`
    );

    const recipients = await User.findParentMail(entry.student);
    if (recipients === null) {
      console.log(`Mail: User ${entry.student} not found.`);
      return;
    }
    if (recipients.length === 0) {
      console.log("Mail: No Recipients defined");
      return;
    }

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

export const dispatchSignedInformation = async (entry: IEntry) => {
  try {
    const { html, subject } = templates.SignedInformation(
      `${baseUrl}/entries/${entry._id}`
    );

    const recipients = await User.findParentMail(entry.student);
    if (!recipients) {
      console.log("User not found");
      return;
    }
    if (recipients.length === 0) {
      console.log("Mail: No Recipients defined");
      return;
    }

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
  const slots: ISlot[] = await Slot.allTwoWeeksBefore();
  const groups = _.groupBy(slots, s => s.teacher);

  _.entries(groups).forEach(async ([teacherId, slots]) => {
    const items = await Promise.all(
      slots.map(async s => {
        const student = await User.findById(s.student);
        if (!student) {
          throw new Error("User not found");
        }

        return {
          displayname: student.displayname,
          date: s.date,
          signed: s.signed,
          hour_from: s.hour_from,
          hour_to: s.hour_to
        };
      })
    );

    const { html, subject } = templates.WeeklySummary(items);
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      throw new Error(`Teacher ${teacherId} not found`);
    }

    const info = await transporter.sendMail({
      html,
      subject,
      to: teacher.email,
      from: "EntE@simonknott.de"
    });
    console.log("Mail: Dispatched WeeklySummary to", info.accepted);
  });
};

export const dispatchPasswortResetLink = async (
  token: string,
  username: string,
  email: string
) => {
  try {
    const { html, subject } = templates.PasswordResetLink(
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
    const { html, subject } = templates.PasswordResetSuccess(username);

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
