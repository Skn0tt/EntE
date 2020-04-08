import * as Handlebars from "handlebars";

const title = "Eine Fehlstundenvoranmeldung wurde getätigt.";

const template = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Eine Fehlstundenvoranmeldung wurde getätigt.
        </mj-text>

        <mj-text>
          {{teacherDisplayName}} hat eine Fehlstunde für dich eingetragen.<br/>
          
          Datum: {{date}}
          Beginn: {{from}}. Stunde
          Ende: {{to}}. Stunde

          Du kannst diese Fehlstunde entschuldigen, indem du einen
          neuen Eintrag für Sie erstellst.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

export const SlotPrefiledNotificationDE = {
  title,
  template
};
