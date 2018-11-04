import * as xl from "excel4node";

interface Sheet {
  title: string;
  headers: string[];
  rows: string[][];
}

export const createSpreadsheet = async (
  ...sheets: Sheet[]
): Promise<Buffer> => {
  const wb = new xl.Workbook();

  sheets.forEach(sheet => {
    const ws = wb.addWorksheet(sheet.title);
    sheet.headers.forEach((h, i) => {
      ws.cell(1, i + 1).string(h);
    });

    sheet.rows.forEach((row, x) => {
      row.forEach((cell, y) => {
        ws.cell(x + 2, y + 1).string(cell);
      });
    });
  });

  return await wb.writeToBuffer();
};
