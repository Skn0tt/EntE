import { Languages } from "@@types";
import { makeMultiLangTemplate } from "./makeMultiLangTemplate";
import * as Handlebars from "handlebars";

const DE = {
  title: "2-Faktor-Authentifizierung deaktiviert",
  template: Handlebars.compile(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
  
          <mj-divider border-color="black" />
  
          <mj-text font-size="20px" font-family="helvetica">
            2-Faktor-Authentifizierung deaktiviert
          </mj-text>
  
          <mj-text>
            Die 2-Faktor-Authentifizierung ihres Accounts wurde deaktiviert.
            Falls diese Aktion nicht durch Sie ausgelöst wurde, nehmen Sie bitte umgehend Kontakt
            zu ihrem Administrator auf.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `),
};

const EN = {
  title: "2-Factor-Authentication deactivated",
  template: Handlebars.compile(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
  
          <mj-divider border-color="black" />
  
          <mj-text font-size="20px" font-family="helvetica">
            2-Factor-Authentication deactivated
          </mj-text>
  
          <mj-text>
            2-factor-authentication was deactivated for your account.
            If you didn't issue this, immedeately contact your administrator.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `),
};

export const TwoFADisabledNotification = makeMultiLangTemplate({
  [Languages.GERMAN]: DE,
  [Languages.ENGLISH]: EN,
});
