import { ISlot } from '../models/Slot';
import * as heml from 'heml';
import * as handlebars from 'handlebars';

export interface HEMLResults {
  html: string;
  metadata: {
    subject: string;
  };
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
      
      <table>
        <th>
        </th>
        <tb>
          {{items}}
        </tb>
      </table>
    </container>
  </body>
</heml>
`);

const title = () => `Wöchentliche Zusammenfassung KW1`;

export default async (items: IRowData[]): Promise<HEMLResults> => {
  const rows = items.map(item => tableRow(item));
  const data = await template({ items: rows, preview: title(), subject: title() });
  return await heml(data);
};
