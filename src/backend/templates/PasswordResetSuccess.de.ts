import * as Handlebars from "handlebars";

const title = "Passwort Erfolgreich Zurückgesetzt";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Passwort erfolgreich geändert
        </mj-text>
        
        <mj-text>
          Das Passwort für den Account "{{ username }}" wurde erfolgreich geändert.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const PasswordResetSuccessDE = {
  title,
  template,
};
