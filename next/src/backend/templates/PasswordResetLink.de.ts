import * as Handlebars from "handlebars";

const title = "Passwort Zurücksetzen";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Password zurücksetzen
        </mj-text>
        
        <mj-text>
          Jemand hat das Zurücksetzen des Passworts für folgendes Benutzerkonto angefordert:
        <br /> <br />
          {{ username }}
        <br /> <br />

          Falls dies nicht beabsichtigt war, ignorieren Sie diese E-Mail einfach.

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

export const PasswordResetLinkDE = {
  title,
  template,
};
