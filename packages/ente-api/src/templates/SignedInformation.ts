import { getByLanguage, Languages } from "ente-types";
import { SignedInformationDE } from "./SignedInformation.de";
import { SignedInformationEN } from "./SignedInformation.en";
import { mjml2html } from "../helpers/mjml";

/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
const getTemplate = getByLanguage({
  [Languages.GERMAN]: SignedInformationDE,
  [Languages.ENGLISH]: SignedInformationEN
});

export const SignedInformation = (linkAddress: string, lang: Languages) => {
  const { template, title } = getTemplate(lang);
  const mjml = template({ linkAddress, linkDisplay: linkAddress });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
