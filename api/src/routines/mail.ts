import { EntryModel } from '../models/Entry';
import * as mail from 'nodemailer';
import * as heml from 'heml';
import * as Handlebars from 'handlebars';
import * as templates from '../templates';
import { SignRequestOptions } from '../templates/SignRequest';
import User from '../models/User';
import { SignedInformationOptions } from '../templates/SignedInformation';
import { ROLES } from '../constants';
import Slot from '../models/Slot';
import WeeklySummary, { IRowData } from '../templates/WeeklySummary';

let mailConfig;
if (process.env.NODE_ENV === 'production') {
  mailConfig = {
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'real.user',
      pass: 'verysecret',
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
      link_address: 'https://simonknott.de',
      link_display: 'test',
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
      link_address: 'https://simonknott.de',
      link_display: 'test',
      subject: 'Entry #42 was signed.',
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

export const dispatchWeeklySummary = async () => {
  try {
    const teachers = await User.find({ role: ROLES.TEACHER });
    await teachers.forEach(async (teacher) => {
      try {
        const slots = await Slot.find({ teacher: teacher._id });

        const items: IRowData[] = slots.map(
          slot => ({ displayname: teacher.displayname, date: slot.date, signed: slot.signed }),
        );

        const email = teacher.email;

        const { html, metadata } = await WeeklySummary(items);

        transporter.sendMail({
          html,
          to: email,
          subject: metadata.subject,
        });
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};

