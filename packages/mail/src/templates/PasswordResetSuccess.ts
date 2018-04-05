import mjml2html from "mjml";
import * as Handlebars from "handlebars";

const title = "Passwort Erfolgreich Zurückgesetzt";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-container>
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
    </mj-container>
  </mj-body>
</mjml>
`);

export default (username: string) => {
  const mjml = template({ username });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
