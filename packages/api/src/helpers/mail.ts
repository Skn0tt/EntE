import * as mail from "nodemailer";
import * as sgTransport from "nodemailer-sendgrid-transport";
import * as Handlebars from "handlebars";
import * as templates from "ente-mail";
import { Roles, MongoId, IEntry, ISlot } from "ente-types";
import { User, Slot } from "ente-db";
import * as _ from "lodash";

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

const findParentMail = async (student: MongoId): Promise<string[]> =>
  (await User.findByRoleAndId(Roles.PARENT, [student])).map(u => u.email);

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

    const recipients = await findParentMail(entry.student);
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
    const { email } = await User.findById(teacherId);

    const info = await transporter.sendMail({
      html,
      subject,
      to: email,
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
