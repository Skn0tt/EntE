import { getByLanguage, Languages } from "ente-types";
import { ManagerSignedInformationDE } from "./ManagerSignedInformation.de";
import { ManagerSignedInformationEN } from "./ManagerSignedInformation.en";
import { mjml2html } from "../helpers/mjml";

/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
const getTemplate = getByLanguage({
  [Languages.GERMAN]: ManagerSignedInformationDE,
  [Languages.ENGLISH]: ManagerSignedInformationEN
});

export const ManagerSignedInformation = (
  linkAddress: string,
  lang: Languages
) => {
  const { template, title } = getTemplate(lang);
  const mjml = template({ linkAddress, linkDisplay: linkAddress });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
