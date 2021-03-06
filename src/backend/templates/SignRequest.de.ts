import * as Handlebars from "handlebars";

const title = "Ein Eintrag wurde erstellt.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Ein Eintrag wurde erstellt.
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

export const SignRequestDE = {
  title,
  template,
};
