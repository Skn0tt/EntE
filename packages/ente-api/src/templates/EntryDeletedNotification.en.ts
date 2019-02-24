import * as Handlebars from "handlebars";

const title = "Your manager deleted an entry.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Your manager deleted an entry.
        </mj-text>

        <mj-text>
          ID: '{{entryId}}'
          Date: '{{entryDate}}'
          Student: '{{entryStudentDisplayname}}'
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const EntryDeletedNotificationEN = {
  title,
  template
};
