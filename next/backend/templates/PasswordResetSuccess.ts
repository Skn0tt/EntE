import { getByLanguage, Languages } from "ente-types";
import { PasswordResetSuccessDE } from "./PasswordResetSuccess.de";
import { PasswordResetSuccessEN } from "./PasswordResetSuccess.en";
import { mjml2html } from "../helpers/mjml";

/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
const getTemplate = getByLanguage({
  [Languages.GERMAN]: PasswordResetSuccessDE,
  [Languages.ENGLISH]: PasswordResetSuccessEN,
});

export const PasswordResetSuccess = (username: string, language: Languages) => {
  const { template, title } = getTemplate(language);
  const mjml = template({ username });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
