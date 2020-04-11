import * as Handlebars from "handlebars";

const title = "Ihr Stufenleiter hat einem Eintrag die Signatur entzogen.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Ihr Stufenleiter hat einem Eintrag die Signatur entzogen.
        </mj-text>

        <mj-text>
          Sie finden den Eintrag unter folgender Addresse:<br />
          
          <a href="{{linkAddress}}">{{linkDisplay}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const ManagerUnsignedInformationDE = {
  title,
  template,
};
