import { Languages } from "@@types";
import { makeMultiLangTemplate } from "./makeMultiLangTemplate";
import * as Handlebars from "handlebars";

const DE = {
  title: "Ihr Stufenleiter hat einen Eintrag gelöscht.",
  template: Handlebars.compile(`
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
  `),
};

const EN = {
  title: "Your manager deleted an entry.",
  template: Handlebars.compile(`
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
