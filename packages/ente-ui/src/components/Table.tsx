import * as React from "react";
import MUIDataTable from "mui-datatables";
import * as _ from "lodash";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { useSessionStorage } from "react-use";

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
    customBodyRender?: (v: T, meta: any) => string | JSX.Element;
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

  const [searchText = undefined, updateSearchText] = useSessionStorage<string>(
    `${persistenceKey}-searchText`
  );
  const [filterLists = [], updateFilterLists] = useSessionStorage<string>(
    `${persistenceKey}-filterLists`
  );
  const [sortedColumn = [-1, "asc"], updateSortedColumn] = useSessionStorage<
    [string, "asc" | "desc"]
  >(`${persistenceKey}-sortedColumn`);

  const columnsWithPersistedFilter = columns.map((column, i) => {
    const { name } = column;
    const filterList = filterLists[i + 1];
    const [sortedColName, direction] = sortedColumn;
    return {
      ...column,
      options: {
        ...(column.options || {}),
        filterList,
        sortDirection: sortedColName === name ? direction : "none"
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
      key={`mui-datatable-;${!!customRowRender ? "a" : "b"}`}
      columns={[idColumn, ...columnsWithPersistedFilter]}
      data={data}
      title={title as any}
      options={{
        searchText,
        rowsPerPage: 50,
        rowsPerPageOptions: [20, 50, 100],
        selectableRows: "none",
        responsive: "scrollMaxHeight",
        onRowClick: (d: any[]) => onClick(d[0]),
        textLabels: translation.textLabels,
        viewColumns: false,
        onSearchChange: (newSearchText: string) => {
          updateSearchText(newSearchText);
        },
        onFilterChange: (changedColumn: string, filterLists: any) => {
          console.log(filterLists);
          updateFilterLists(filterLists);
        },
        onColumnSortChange: (
          column: string,
          direction: "ascending" | "descending"
        ) => {
          updateSortedColumn([
            column,
            direction === "ascending" ? "asc" : "desc"
          ]);
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
