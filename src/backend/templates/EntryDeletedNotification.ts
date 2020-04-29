import { Languages } from "@@types";
import { makeMultiLangTemplate } from "./makeMultiLangTemplate";
import * as Handlebars from "handlebars";

const DE = {
  title: "Ein Eintrag wurde gelöscht.",
  template: Handlebars.compile(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>

          <mj-divider border-color="black" />

          <mj-text font-size="20px" font-family="helvetica">
            Ein Eintrag wurde gelöscht.
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
  `),
};

const EN = {
  title: "An entry was deleted.",
  template: Handlebars.compile(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
  
          <mj-divider border-color="black" />
  
          <mj-text font-size="20px" font-family="helvetica">
            An entry was deleted.
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
  `),
};

export const EntryDeletedNotification = makeMultiLangTemplate<{
  entryId: string;
  entryDate: string;
  entryStudentDisplayname: string;
}>({
  [Languages.GERMAN]: DE,
  [Languages.ENGLISH]: EN,
});
