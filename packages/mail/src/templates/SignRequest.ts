import * as mjml2html from "mjml";
import * as Handlebars from "handlebars";

const title = "Ein Eintrag wurde erstellt.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>

          <mj-divider border-color="black" />

          <mj-text font-size="20px" font-family="helvetica">
            Ein Eintrag wurde erstellt.
          </mj-text>

          <mj-text>
            Sie finden diesen unter folgender Addresse:<br />
            
            <a href="{{linkAddress}}">{{linkDisplay}}</a>
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`);

export default (linkAddress: string) => {
  const mjml = template({ linkAddress, linkDisplay: linkAddress });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
