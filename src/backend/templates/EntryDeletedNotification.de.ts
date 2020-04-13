import * as Handlebars from "handlebars";

const title = "Ihr Stufenleiter hat einen Eintrag gelöscht.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Ihr Stufenleiter hat einen Eintrag gelöscht.
        </mj-text>

        <mj-text>
          ID: '{{entryId}}'
          Datum: '{{entryDate}}'
          Schüler: '{{entryStudentDisplayname}}'
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const EntryDeletedNotificationDE = {
  title,
  template,
};
