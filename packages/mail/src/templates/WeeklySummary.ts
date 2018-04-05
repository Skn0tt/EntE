import { ISlot } from "ente-types";
import mjml2html from "mjml";
import * as handlebars from "handlebars";
import * as moment from "moment";

interface HEMLResults {
  html: string;
  subject: string;
}

interface WeeklySummaryOptions {
  subject: string;
  preview: string;
  items: string[];
}

interface IRowData {
  displayname: string;
  date: Date;
  hour_from: number;
  hour_to: number;
  signed: boolean;
}

const tableRow = (data: IRowData) => `
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
> = handlebars.compile(`
<mjml>
  <mj-body>
    <mj-container>
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
                {{ this }}
              {{/each}}
            </mj-table>
          {{else}}
            <mj-text>
              Diese Woche hatten hat es in ihren Stunden keine Entschuldigungsanträge gegeben.
            </mj-text>
          {{/if}}
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`);

const getTitle = () => `Wöchentliche Zusammenfassung KW${moment().week()}`;

export default (items: IRowData[]): HEMLResults => {
  try {
    const rows = items.map(item => tableRow(item));
    const title = getTitle();

    const mjml = template({
      items: rows,
      preview: title,
      subject: title
    });
    const { errors, html } = mjml2html(mjml);
    if (errors.length > 0) throw new Error("MJML Error");
    return { html, subject: title };
  } catch (error) {
    throw error;
  }
};
