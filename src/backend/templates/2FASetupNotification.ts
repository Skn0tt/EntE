import { Languages } from "@@types";
import { makeMultiLangTemplate } from "./makeMultiLangTemplate";
import * as Handlebars from "handlebars";

const TwoFASetupNotificationDE = {
  title: "2-Faktor-Authentifizierung aktiviert",
  template: Handlebars.compile(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
  
          <mj-divider border-color="black" />
  
          <mj-text font-size="20px" font-family="helvetica">
            2-Faktor-Authentifizierung aktiviert
          </mj-text>
  
          <mj-text>
            Für ihren Account wurde die 2-Faktor-Authentifizierung aktiviert.
            Falls diese Aktion nicht durch Sie ausgelöst wurde, nehmen Sie bitte umgehend Kontakt
            zu ihrem Administrator auf.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `),
};

const TwoFASetupNotificationEN = {
  title: "2-Factor-Authentication activated",
  template: Handlebars.compile(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
  
          <mj-divider border-color="black" />
  
          <mj-text font-size="20px" font-family="helvetica">
            2-Factor-Authentication activated
          </mj-text>
  
          <mj-text>
            2-factor-authentication was activated for your account.
            If you didn't issue this, immedeately contact your administrator.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `),
};

export const TwoFASetupNotification = makeMultiLangTemplate({
  [Languages.GERMAN]: TwoFASetupNotificationDE,
  [Languages.ENGLISH]: TwoFASetupNotificationEN,
});
