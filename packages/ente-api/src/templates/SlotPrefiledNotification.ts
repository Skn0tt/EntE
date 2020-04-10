import { getByLanguage, Languages } from "ente-types";
import { mjml2html } from "../helpers/mjml";
import { SlotPrefiledNotificationDE } from "./SlotPrefiledNotification.de";
import { SlotPrefiledNotificationEN } from "./SlotPrefiledNotification.en";

const getTemplate = getByLanguage({
  [Languages.GERMAN]: SlotPrefiledNotificationDE,
  [Languages.ENGLISH]: SlotPrefiledNotificationEN
});

export const SlotPrefiledNotification = (
  teacherName: string,
  date: string,
  from: number,
  to: number,
  lang: Languages
) => {
  const { title, template } = getTemplate(lang);
  const mjml = template({ teacherDisplayName: teacherName, date, from, to });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
