/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

// tslint:disable-next-line:no-var-requires
import { Languages, getByLanguage, Roles } from "ente-types";
import { InvitationLinkEN } from "./InvitationLink.en";
import { InvitationLinkDE } from "./InvitationLink.de";
import { mjml2html } from "../helpers/mjml";

const getTemplate = getByLanguage({
  [Languages.ENGLISH]: InvitationLinkEN,
  [Languages.GERMAN]: InvitationLinkDE,
});

export const InvitationLink = (
  linkAddress: string,
  userRole: Roles,
  lang: Languages
) => {
  const { template, title } = getTemplate(lang);
  const mjml = template({
    linkAddress,
    linkDisplay: linkAddress,
    role: userRole,
  });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
