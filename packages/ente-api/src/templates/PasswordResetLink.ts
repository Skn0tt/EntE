/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import { Languages, getByLanguage } from "ente-types";
import { PasswordResetLinkEN } from "./PasswordResetLink.en";
import { PasswordResetLinkDE } from "./PasswordResetLink.de";
import { mjml2html } from "../helpers/mjml";

const getTemplate = getByLanguage({
  [Languages.ENGLISH]: PasswordResetLinkEN,
  [Languages.GERMAN]: PasswordResetLinkDE
});

export const PasswordResetLink = (
  linkAddress: string,
  username: string,
  lang: Languages
) => {
  const { template, title } = getTemplate(lang);
  const mjml = template({ linkAddress, username, linkDisplay: linkAddress });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
