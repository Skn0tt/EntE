import * as Handlebars from "handlebars";
import moment = require("moment");
import { WeeklySummaryOptions, WeeklySummaryRowData } from "./WeeklySummary";

const tableRow = (data: WeeklySummaryRowData) => `
  <tr>
    <td>${data.displayname}</td>
    <td>${data.date.toDateString()}</td>
    <td>${data.hour_from}</td>
    <td>${data.hour_to}</td>
    <td>${data.signed ? "Entschuldigt" : "Ausstehend"}</td>
  </tr>
`;

const template: HandlebarsTemplateDelegate<
  WeeklySummaryOptions
> = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Wöchentliche Zusammenfassung
        </mj-text>
        {{#if items.length}}    
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th>Schüler</th>
              <th>Datum</th>
              <th>Von</th>
              <th>Bis</th>
              <th>Status</th>
            </tr>
            {{#each items}}
              {{{ this }}}
            {{/each}}
          </mj-table>
        {{else}}
          <mj-text>
            Diese Woche hatten hat es in ihren Stunden keine Entschuldigungsanträge gegeben.
          </mj-text>
        {{/if}}
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

const getTitle = () => `Wöchentliche Zusammenfassung KW${moment().week()}`;

export const WeeklySummaryDE = {
  getTitle,
  template,
  tableRow
};
