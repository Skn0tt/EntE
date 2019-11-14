import * as React from "react";
import MUIDataTable from "mui-datatables";
import * as _ from "lodash";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { useTableStatePersistence } from "../context/TableStatePersistence";

const useTranslation = makeTranslationHook({
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
  customRowRender?: (item: T) => JSX.Element;
  persistenceKey?: string;
}

type TableProps<T> = TableOwnProps<T>;

// tslint:disable-next-line:function-name
export function Table<T>(props: TableProps<T>) {
  const translation = useTranslation();
  const {
    columns,
    items,
    extractId,
    onClick = () => {},
    title,
    customRowRender,
    persistenceKey
  } = props;

  const [persistedState, updatePersistedState] = useTableStatePersistence(
    persistenceKey || "unknown"
  );

  const columnsWithPersistedFilter = !persistedState
    ? columns
    : columns.map((column, i) => {
        const filterList = persistedState[i + 1];
        return {
          ...column,
          options: {
            ...(column.options || {}),
            filterList
          }
        };
      });

  const visibleColumns = columnsWithPersistedFilter.filter(c => {
    const { options } = c;
    if (!options) {
      return true;
    }

    const { display } = options;
    if (_.isUndefined(display)) {
      return true;
    }

    return display;
  });

  const data = items.map(item => {
    const id = extractId(item);
    const cells = columnsWithPersistedFilter.map(columnOptions => {
      return columnOptions.extract(item);
    });
    return [id, ...cells];
  });
  const idColumn = { name: "ID", options: { display: false, filter: false } };

  return (
    <MUIDataTable
      key={"mui-datatable-" + ";" + (!!customRowRender ? "a" : "b")}
      columns={[idColumn, ...columnsWithPersistedFilter]}
      data={data}
      title={title as any}
      options={{
        rowsPerPage: 50,
        rowsPerPageOptions: [20, 50, 100],
        selectableRows: "none",
        responsive: "scrollFullHeight",
        onRowClick: (d: any[]) => onClick(d[0]),
        textLabels: translation.textLabels,
        viewColumns: false,
        onFilterChange: (changedColumn: string, filterList: any) => {
          updatePersistedState(filterList);
        },
        customRowRender: !!customRowRender
          ? (data: any[]) => {
              const [id] = data;
              const item = items.find(item => extractId(item) === id);
              return (
                <tr key={id}>
                  <td colSpan={visibleColumns.length}>
                    {!!item ? customRowRender(item) : null}
                  </td>
                </tr>
              );
            }
          : undefined
      }}
    />
  );
}

export default Table;
