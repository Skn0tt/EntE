import * as Handlebars from "handlebars";

const title = "Sie wurden zu EntE eingeladen.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Sie wurden zu EntE eingeladen.
        </mj-text>
        
        <mj-text>
          Sie wurden eingeladen, auf EntE die Fehlstunden ihrer Kinder zu verwalten.
          Um EntE benutzen zu können, setzen sie bitte ihr Passwort mithilfe des folgenden Links.
          
          <br /> <br />
          
          <a href="{{linkAddress}}">{{linkDisplay}}</a>

          <br /> <br />
          Dieser Link ist für sieben Tage gültig.
          Falls ihr Link schon abgelaufen ist, lesen sie in der <a href="https://skn0tt.gitlab.io/EntE/docs/">Dokumentation</a> nach,
          wie sie ihr Benutzerkonto trotzdem aktivieren können.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const InvitationLinkDE = {
  title,
  template
};
