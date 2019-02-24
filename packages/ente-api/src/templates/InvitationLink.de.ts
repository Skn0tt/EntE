import * as Handlebars from "handlebars";
import "./register-helpers";
import { Roles } from "ente-types";

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
          {{#ifEqual role "${Roles.PARENT}"}}
          Sie wurden eingeladen, auf EntE die Fehlstunden ihrer Kinder zu verwalten.
          Um EntE benutzen zu können, setzen Sie bitte ihr Passwort mithilfe des folgenden Links.
          {{/ifEqual}}
          {{#ifEqual role "${Roles.STUDENT}"}}
          Sie wurden eingeladen, auf EntE ihre Fehlstunden zu verwalten.
          Um EntE benutzen zu können, setzen Sie bitte ihr Passwort mithilfe des folgenden Links.
          {{/ifEqual}}
          {{#ifEqual role "${Roles.MANAGER}"}}
          Sie wurden eingeladen, auf EntE die Fehlstunden ihrer Stufe zu verwalten.
          Um EntE benutzen zu können, setzen Sie bitte ihr Passwort mithilfe des folgenden Links.
          {{/ifEqual}}
          {{#ifEqual role "${Roles.TEACHER}"}}
          Sie wurden eingeladen, auf EntE die Fehlstunden ihrer Schüler einzusehen.
          Um EntE benutzen zu können, setzen Sie bitte ihr Passwort mithilfe des folgenden Links.
          {{/ifEqual}}
          {{#ifEqual role "${Roles.ADMIN}"}}
          Sie wurden eingeladen, eine EntE-Instanz zu administrieren.
          Um EntE benutzen zu können, setzen Sie bitte ihr Passwort mithilfe des folgenden Links.
          {{/ifEqual}}
          
          <br /> <br />
          
          <a href="{{linkAddress}}">{{linkDisplay}}</a>

          <br /> <br />
          Dieser Link ist für sieben Tage gültig.
          Falls ihr Link schon abgelaufen ist, lesen Sie in der <a href="https://skn0tt.gitlab.io/EntE/docs/">Dokumentation</a> nach,
          wie Sie ihr Benutzerkonto trotzdem aktivieren können.
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
