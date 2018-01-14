import { ISlot } from '../models/Slot';
import * as heml from 'heml';
import * as handlebars from 'handlebars';
import * as moment from 'moment';

export interface HEMLResults {
  html: string;
  subject: string;
}

export interface WeeklySummaryOptions {
  subject: string;
  preview: string;
  items: string[];
}

export interface IRowData {
  displayname: string;
  date: Date;
  signed: boolean;
}

const tableRow = (data: IRowData) => `
  <tr>
    <td>${data.displayname}</td>
    <td>${data.date.toDateString()}</td>
    <td>${data.signed ? 'Entschuldigt' : 'Ausstehend'}</td>
  </tr>
`;

const template: HandlebarsTemplateDelegate<WeeklySummaryOptions> = handlebars.compile(`
<heml>
  <head>
    <subject>{{subject}}</subject>
    <preview>{{preview}}</preview>
  </head>
  <body>
    <container>
      <h1>Wöchtenliche Zusammenfassung</h1>
      
          {{#if items.length}}
            <table>
              <tb>
                {{#each items}}
                  {{ this }}
                {{/each}}
              </tb>
            </table>
          {{else}}
            <p>
              Diese Woche hatten hat es in ihren Stunden keine Entschuldigungsanträge gegeben.
            </p>
          {{/if}}
    </container>
  </body>
</heml>
`);

const getTitle = () => `Wöchentliche Zusammenfassung KW${moment().week()}`;

export default async (items: IRowData[]): Promise<HEMLResults> => {
  try {
    const rows = items.map(item => tableRow(item));
    const title = getTitle();
  
    const data = template({
      items: rows,
      preview: title,
      subject: title,
    });
    // const result = await heml(data);
    return { html: data, subject: title };
  } catch (error) {
    throw error;
  }
};
