import * as Handlebars from "handlebars";

const title = "Ein Eintrag kann bald nicht mehr unterzeichnet werden.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Ein Eintrag kann bald nicht mehr unterzeichnet werden.
        </mj-text>

        <mj-text>
          Die Möglichkeit, diesen Eintrag zu unterzeichnen, wird in wenigen Tagen erlischen.

          <a href="{{linkAddress}}">{{linkDisplay}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const EntryStillUnsignedNotificationDE = {
  title,
  template,
};
