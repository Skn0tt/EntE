import { Languages, Roles } from "@@types";
import { makeMultiLangTemplate } from "./makeMultiLangTemplate";
import * as Handlebars from "handlebars";

const DE = {
  title: "Sie wurden zu EntE eingeladen.",
  template: Handlebars.compile(`
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
            {{/ifEqual}}
            {{#ifEqual role "${Roles.STUDENT}"}}
            Sie wurden eingeladen, auf EntE ihre Fehlstunden zu verwalten.
            {{/ifEqual}}
            {{#ifEqual role "${Roles.MANAGER}"}}
            Sie wurden eingeladen, auf EntE die Fehlstunden ihrer Stufe zu verwalten.
            {{/ifEqual}}
            {{#ifEqual role "${Roles.TEACHER}"}}
            Sie wurden eingeladen, auf EntE die Fehlstunden ihrer Schüler einzusehen.
            {{/ifEqual}}
            Um EntE benutzen zu können, setzen Sie bitte ihr Passwort mithilfe des folgenden Links.
            
            <br /> <br />
            
            <a href="{{link}}">{{link}}</a>
            
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `),
};

const EN = {
  title: "You have been invited to EntE.",
  template: Handlebars.compile(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>

          <mj-divider border-color="black" />

          <mj-text font-size="20px" font-family="helvetica">
            You have been invited to EntE.
          </mj-text>
          
          <mj-text>
            {{#ifEqual role "${Roles.PARENT}"}}
            You have been invited to manage your children's missed lessons on EntE.
            {{/ifEqual}}
            {{#ifEqual role "${Roles.STUDENT}"}}
            You have been invited to manage your missed lessons on EntE.
            {{/ifEqual}}
            {{#ifEqual role "${Roles.MANAGER}"}}
            You have been invited to manage your students missed lessons on EntE.
            {{/ifEqual}}
            {{#ifEqual role "${Roles.TEACHER}"}}
            You have been invited to view your students missed lessons on EntE.
            {{/ifEqual}}
            In order to be able to use EntE, please set your password using the following link.

            <br /> <br />
            
            <a href="{{link}}">{{link}}</a>
            
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `),
};

interface InvitationLinkVariables {
  role: Roles;
  link: string;
}

export const InvitationLink = makeMultiLangTemplate<InvitationLinkVariables>({
  [Languages.GERMAN]: DE,
  [Languages.ENGLISH]: EN,
});
