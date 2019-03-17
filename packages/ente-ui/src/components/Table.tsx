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

interface ColumnConfig<S, T> {
  name: string;
  extract: (v: S) => T;
  options?: {
    display?: boolean;
    filter?: boolean;
    sort?: boolean;
    customBodyRender?: (v: T) => string | JSX.Element;
  };
}

interface TableOwnProps<T> {
  items: ReadonlyArray<T>;
  columns: ReadonlyArray<ColumnConfig<T, any>>;
  extractId: (item: T) => string;
  onClick?: (id: string) => void;
  title?: string | JSX.Element;
}

type TableProps<T> = TableOwnProps<T>;

export class Table<T> extends React.PureComponent<TableProps<T>> {
  render() {
    const { columns, items, extractId, onClick = () => {}, title } = this.props;

    const data = items.map(item => {
      const id = extractId(item);
      const cells = columns.map(columnOptions => {
        return columnOptions.extract(item);
      });
      return [id, ...cells];
    });
    const idColumn = { name: "ID", options: { display: false, filter: false } };

    return (
      <LanguageProvider>
        {lang => (
          <MUIDataTable
            columns={[idColumn, ...columns]}
            data={data}
            title={title as any}
            options={{
              rowsPerPage: 50,
              rowsPerPageOptions: [20, 50, 100],
              selectableRows: false,
              elevation: 1,
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
