/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as mjml2html from "mjml";
import * as Handlebars from "handlebars";

const title = "Ein Eintrag wurde signiert.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Ein Eintrag wurde signiert.
        </mj-text>

        <mj-text>
          Sie finden diesen unter folgender Addresse:<br />
          
          <a href="{{linkAddress}}">{{linkDisplay}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export default (linkAddress: string) => {
  const mjml = template({ linkAddress, linkDisplay: linkAddress });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
