import { EntryModel } from '../models/Entry';
import * as mail from 'nodemailer';
import * as heml from 'heml';
import * as Handlebars from 'handlebars';
import * as templates from '../templates';
import { SignRequestOptions } from '../templates/SignRequest';
import User from '../models/User';
import { SignedInformationOptions } from '../templates/SignedInformation';
import { ROLES } from '../constants';
import Slot, { SlotModel } from '../models/Slot';
import WeeklySummary, { IRowData } from '../templates/WeeklySummary';
import PasswortResetLink from '../templates/PasswortResetLink';
import PasswortResetSuccess from '../templates/PasswortResetSuccess';

let mailConfig;
if (process.env.NODE_ENV === 'production') {
  mailConfig = {
    host: 'mail.your-server.de',
    port: 587,
    auth: {
      user: 'ev@simonknott.de‚',
      pass: 't80bpG4676gUQ86z',
    },
  };
} else {
  mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'louf4yh5lnkyg2h3@ethereal.email',
      pass: 'mWgCFb9JcJxdeKa6RE',
    },
  };
}
const transporter = mail.createTransport(mailConfig);

/**
 * ## Handlebars Templates
 */
const signRequest: HandlebarsTemplateDelegate<SignRequestOptions>
  = Handlebars.compile(templates.signRequest);

export const dispatchSignRequest = async (entry: EntryModel) => {
  try {
    const hemlTemplate = await signRequest({
      preview: 'Sign the Request!',
      link_address: 'http://localhost/entries/' + entry._id,
      link_display: 'Show Entry',
      subject: 'You are requested to sign the Entry.',
    });
    const { html, metadata, errors } = await heml(hemlTemplate);

    const parents = await User.find({ children: entry.student }).select('email');
    
    const recipients = parents.map(parent => parent.email);
  
    transporter.sendMail({
      html,
      to: recipients,
      subject: metadata.subject,
    });
  } catch (error) {
    throw error;
  }
};

const signedInformation: HandlebarsTemplateDelegate<SignedInformationOptions>
  = Handlebars.compile(templates.signedInformation);

export const dispatchSignedInformation = async (entry: EntryModel) => {
  try {
    const hemlTemplate = await signRequest({
      preview: 'The Entry was signed.',
      link_address: 'http://localhost/entries/' + entry._id,
      link_display: 'View the Entry',
      subject: 'An Entry was signed.',
    });
    const { html, metadata, errors } = await heml(hemlTemplate);

    const parents = await User.find({ children: entry.student }).select('email');
    
    const recipients = parents.map(parent => parent.email);
  
    transporter.sendMail({
      html,
      to: recipients,
      subject: metadata.subject,
    });
  } catch (error) {
    throw error;
  }
};

const twoWeeksBefore: Date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
export const dispatchWeeklySummary = async (): Promise<void> => {
  try {
    const teachers = await User.find({ role: ROLES.TEACHER });
    teachers.forEach(async (teacher) => {
      try {
        const slots: SlotModel[] = await Slot.find({
          teacher: teacher._id,
          date: { $gte: twoWeeksBefore },
        });

        const items: IRowData[] = await Promise.all(slots.map(async (slot) => {
          const student = await User.findById(slot.student);

          return ({
            displayname: student.displayname,
            date: slot.date,
            signed: slot.signed,
            hour_from: slot.hour_from,
            hour_to: slot.hour_to,
          });
        }));

        const email = teacher.email;

        const { html, subject } = WeeklySummary(items);

        const info = await transporter.sendMail({
          html,
          subject,
          to: email,
          from: 'entschuldigungsverfahren@simonknott.de',
        });
        console.log('Mail: Dispatched WeeklySummary to', info.accepted);
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};

export const dispatchPasswortResetLink = async (token: string, username: string, email: string) => {
  try {
    const { html, subject } = PasswortResetLink(
      `http://localhost/forgot/${token}`,
      username,
    );

    const info = await transporter.sendMail({
      html,
      subject,
      to: email,
      from: 'entschuldigungsverfahren@simonknott.de',
    });
    console.log('Mail: Dispatched PasswortResetLink to', info.accepted);
  } catch (error) {
    throw error;
  }
};

export const dispatchPasswortResetSuccess = async (username: string, email: string) => {
  try {
    const { html, subject } = PasswortResetSuccess(username);

    const info = await transporter.sendMail({
      html,
      subject,
      to: email,
      from: 'entschuldigungsverfahren@simonknott.de',
    });
    console.log('Mail: Dispatched PasswortResetSuccess to', info.accepted);
  } catch (error) {
    throw error;
  }
};

