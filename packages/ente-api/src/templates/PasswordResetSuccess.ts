/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import * as Handlebars from "handlebars";
// tslint:disable-next-line:no-var-requires
const mjml2html = require("mjml").default;

const title = "Passwort Erfolgreich Zurückgesetzt";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Password Erfolgreich Geändert
        </mj-text>
        
        <mj-text>
          Das Passwort für den Account "{{ username }}" wurde erfolgreich geändert.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const PasswordResetSuccess = (username: string) => {
  const mjml = template({ username });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};

export default PasswordResetSuccess;
