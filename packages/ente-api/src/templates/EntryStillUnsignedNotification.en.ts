import * as Handlebars from "handlebars";

const title = "An entry will become unsigneable soon.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          An entry will become unsigneable soon.
        </mj-text>

        <mj-text>
          You will not be able to sign this entry in a few days.

          <a href="{{linkAddress}}">{{linkDisplay}}</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const EntryStillUnsignedNotificationEN = {
  title,
  template
};
