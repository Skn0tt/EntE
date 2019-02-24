import { getByLanguage, Languages, UserDto, EntryDto } from "ente-types";
import { mjml2html } from "../helpers/mjml";
import { EntryDeletedNotificationDE } from "./EntryDeletedNotification.de";
import { EntryDeletedNotificationEN } from "./EntryDeletedNotification.en";

/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
const getTemplate = getByLanguage({
  [Languages.GERMAN]: EntryDeletedNotificationDE,
  [Languages.ENGLISH]: EntryDeletedNotificationEN
});

export const EntryDeletedNotification = (
  entry: EntryDto,
  recipient: UserDto,
  lang: Languages
) => {
  const { template, title } = getTemplate(lang);
  const mjml = template({
    entryId: entry.id,
    entryDate: entry.date,
    entryStudentDisplayname: entry.student.displayname
  });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
