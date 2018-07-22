/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as templates from "ente-mail";
import { IEntry, ISlot } from "ente-types";
import { User, Slot } from "ente-db";
import * as _ from "lodash";
import { getConfig } from "./config";
import Axios from "axios";

const config = getConfig();

const baseUrl = `https://${config.host}`;

type Envelope = {
  subject: string;
  recipients: string[];
  body: {
    text?: string;
    html?: string;
  };
};

const railmailClient = Axios.create({
  baseURL: "http://" + config.railmailHost
});

const sendMail = async (e: Envelope) => {
  await railmailClient.post("/mail", e);
};

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

    await sendMail({
      subject,
      recipients,
      body: {
        html
      }
    });

    console.log("Mail: Dispatched SignRequest to", recipients);
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

    await sendMail({
      subject,
      recipients,
      body: {
        html
      }
    });

    console.log("Mail: Dispatched SignedInformation to", recipients);
  } catch (error) {
    throw error;
  }
};

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

    await sendMail({
      subject,
      recipients: [teacher.email],
      body: {
        html
      }
    });

    console.log("Mail: Dispatched WeeklySummary to", teacher.email);
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

    await sendMail({
      subject,
      recipients: [email],
      body: {
        html
      }
    });

    console.log("Mail: Dispatched PasswortResetLink to", email);
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

    await sendMail({
      subject,
      recipients: [email],
      body: {
        html
      }
    });

    console.log("Mail: Dispatched PasswortResetSuccess to", email);
  } catch (error) {
    console.error(error);
  }
};
