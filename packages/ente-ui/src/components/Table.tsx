import * as React from "react";
import MUIDataTable from "mui-datatables";
import * as _ from "lodash";
import { LanguageProvider } from "../helpers/Language-Provider";
import { getByLanguage } from "ente-types";

export const translation = getByLanguage({
  en: {
    textLabels: {
      body: {
        noMatch: "Sorry, no matching records found",
        toolTip: "Sort"
      },
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of"
      },
      toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: "Print",
        viewColumns: "View Columns",
        filterTable: "Filter Table"
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET"
      },
      viewColumns: {
        title: "Show Columns",
        titleAria: "Show/Hide Table Columns"
      },
      selectedRows: {
        text: "rows(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows"
      }
    }
  },
  de: {
    textLabels: {
      body: {
        noMatch: "Es liegen keine Datensätze vor.",
        toolTip: "Sortieren"
      },
      pagination: {
        next: "Nächste Seite",
        previous: "Vorherige Seite",
        rowsPerPage: "Zeilen pro Seite:",
        displayRows: "von"
      },
      toolbar: {
        search: "Suchen",
        downloadCsv: "Als CSV herunterladen",
        print: "Drucken",
        viewColumns: "Spalten zeigen",
        filterTable: "Tabelle filtern"
      },
      filter: {
        all: "Alles",
        title: "Filter".toUpperCase(),
        reset: "Zurücksetzen".toUpperCase()
      },
      viewColumns: {
        title: "Spalten",
        titleAria: "Tabellenzeilen Zeigen/Verstecken"
      },
      selectedRows: {
        text: "Zeile(n) ausgewählt",
        delete: "Löschen",
        deleteAria: "Ausgewählte Zeilen löschen"
      }
    }
  }
});

interface ColumnConfig {
  name: string;
  options?: {
    display?: boolean;
    filter?: boolean;
    sort?: boolean;
    customBodyRender?: (v: string) => string | JSX.Element;
  };
}

type ConfigItem = ColumnConfig | string;

interface TableOwnProps<T> {
  items: ReadonlyArray<T>;
  extract: (item: T) => string[];
  headers: ReadonlyArray<ConfigItem>;
  extractId: (item: T) => string;
  onClick?: (id: string) => void;
}

type TableProps<T> = TableOwnProps<T>;

export class Table<T> extends React.PureComponent<TableProps<T>> {
  render() {
    const {
      headers,
      items,
      extract,
      extractId,
      onClick = () => {}
    } = this.props;
    const data = items.map(i => [extractId(i), ...extract(i)]);
    const columns = headers.map(h =>
      typeof h === "string" ? { name: h, options: { filter: false } } : h
    );
    const idColumn = { name: "ID", options: { display: false, filter: false } };
    return (
      <LanguageProvider>
        {lang => (
          <MUIDataTable
            columns={[idColumn, ...columns]}
            data={data}
            options={{
              rowsPerPage: 50,
              rowsPerPageOptions: [20, 50, 100],
              selectableRows: false,
              responsive: "scroll",
              onRowClick: (d: any[]) => onClick(d[0]),
              textLabels: translation(lang).textLabels
            }}
          />
        )}
      </LanguageProvider>
    );
  }
}

export default Table;
