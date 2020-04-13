import Handlebars from "handlebars";
import { WeeklySummaryOptions, WeeklySummaryRowData } from "./WeeklySummary";
import deLocale from "date-fns/locale/de";
import { format, parseISO, getISOWeek } from "date-fns";

const tableRow = (data: WeeklySummaryRowData) => `
  <tr>
    <td>${data.displayname}</td>
    <td>${format(parseISO(data.date), "PP", { locale: deLocale })}</td>
    <td>${data.hour_from}</td>
    <td>${data.hour_to}</td>
    <td>${data.signed ? "Entschuldigt" : "Ausstehend"}</td>
    <td>${data.educational ? "Schulisch" : "Außerschulisch"}</td>
  </tr>
`;

const template: HandlebarsTemplateDelegate<WeeklySummaryOptions> = Handlebars.compile(`
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
            <th>Schüler*in</th>
            <th>Datum</th>
            <th>Von</th>
            <th>Bis</th>
            <th>Status</th>
            <th>(Außer-)schulisch</th>
          </tr>
          {{#each items}} {{{ this }}} {{/each}}
        </mj-table>
        {{else}}
        <mj-text>
          Während der letzten Woche ist in ihrem Unterricht nicht gefehlt worden.
        </mj-text>
        {{/if}}
      </mj-column>
    </mj-section>
    <mj-section background-color="#fbfbfb">
      <mj-column>
        <mj-text>
					Weitere Informationen über EntE: <a href="https://ente.app">ente.app</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`);

const getTitle = () =>
  `Wöchentliche Zusammenfassung KW${getISOWeek(Date.now())}`;

export const WeeklySummaryDE = {
  getTitle,
  template,
  tableRow,
};
