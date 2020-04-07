import * as Handlebars from "handlebars";

const title = "You missed a class.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          You missed a class.
        </mj-text>

        <mj-text>
          {{teacherDisplayName}} has prefiled a missed class for you.
          
          Date: {{date}}
          Begin: {{from}}.
          End: {{to}}.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const SlotPrefiledNotificationEN = {
  title,
  template
};
