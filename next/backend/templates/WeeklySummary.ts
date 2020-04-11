import { getByLanguage, Languages } from "ente-types";
import { WeeklySummaryEN } from "./WeeklySummary.en";
import { WeeklySummaryDE } from "./WeeklySummary.de";
import { mjml2html } from "../helpers/mjml";

/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
export interface WeeklySummaryOptions {
  subject: string;
  preview: string;
  items: string[];
}

export interface WeeklySummaryRowData {
  displayname: string;
  date: string;
  hour_from: number;
  hour_to: number;
  signed: boolean;
  educational: boolean;
}

const getTemplate = getByLanguage({
  [Languages.ENGLISH]: WeeklySummaryEN,
  [Languages.GERMAN]: WeeklySummaryDE,
});

export const WeeklySummary = (
  items: WeeklySummaryRowData[],
  lang: Languages
) => {
  const { template, getTitle, tableRow } = getTemplate(lang);
  const rows = items.map((item) => tableRow(item));
  const title = getTitle();

  const mjml = template({
    items: rows,
    preview: title,
    subject: title,
  });
  const { errors, html } = mjml2html(mjml);
  if (errors.length > 0) throw new Error("MJML Error");
  return { html, subject: title };
};
