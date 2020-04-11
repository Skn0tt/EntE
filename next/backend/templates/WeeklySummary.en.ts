import * as Handlebars from "handlebars";
import moment = require("moment");
import { WeeklySummaryOptions, WeeklySummaryRowData } from "./WeeklySummary";
import * as enLocale from "date-fns/locale/en-GB";
import { format, parseISO } from "date-fns";

const tableRow = (data: WeeklySummaryRowData) => `
  <tr>
    <td>${data.displayname}</td>
    <td>${format(parseISO(data.date), "PP", { locale: enLocale })}</td>
    <td>${data.hour_from}</td>
    <td>${data.hour_to}</td>
    <td>${data.signed ? "Excused" : "Pending"}</td>
    <td>${data.educational ? "Educational" : "Not Educational"}</td>
  </tr>
`;

const template: HandlebarsTemplateDelegate<WeeklySummaryOptions> = Handlebars.compile(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-divider border-color="black" />

        <mj-text font-size="20px" font-family="helvetica">
          Weekly Summary
        </mj-text>
        {{#if items.length}}
        <mj-table>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th>Student</th>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>State</th>
            <th>Educational</th>
          </tr>
          {{#each items}} {{{ this }}} {{/each}}
        </mj-table>
        {{else}}
        <mj-text>
          There have been no absences in your classes during the last week.
        </mj-text>
        {{/if}}
      </mj-column>
    </mj-section>
    <mj-section background-color="#fbfbfb">
      <mj-column>
        <mj-text>
					Further information on EntE: <a href="https://ente.app/en">ente.app</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

const getTitle = () => `Weekly Summary cw${moment().week()}`;

export const WeeklySummaryEN = {
  getTitle,
  template,
  tableRow,
};
