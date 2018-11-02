/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

// tslint:disable-next-line:no-var-requires
const mjml2html = require("mjml").default;
import * as Handlebars from "handlebars";

const title = "Passwort Zurücksetzen";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Password Zurücksetzen
        </mj-text>
        
        <mj-text>
          Jemand hat das Zurücksetzen des Passworts für folgendes Benutzerkonto angefordert:
        <br /> <br />
          {{ username }}
        <br /> <br />

          Falls dies nicht beabsichtigt war, ignorieren Sie einfach diese E-Mail.

        <br />
          Um Ihr Passwort zurückzusetzen, besuchen Sie folgende Adresse:
          
        <br /> <br />
          
        <a href="{{linkAddress}}">{{linkDisplay}}</a>
        
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const PasswordResetLink = (linkAddress: string, username: string) => {
  const mjml = template({ linkAddress, username, linkDisplay: linkAddress });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};

export default PasswordResetLink;
