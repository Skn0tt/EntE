import * as Handlebars from "handlebars";

const title = "Ihr Stufenleiter hat einen Eintrag signiert.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Ihr Stufenleiter hat einen Eintrag signiert.
        </mj-text>

        <mj-text>
          Sie finden diesen unter folgender Addresse:<br />
          
          <a href="{{linkAddress}}">{{linkDisplay}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const ManagerSignedInformationDE = {
  title,
  template,
};
