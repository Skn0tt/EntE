import * as React from "react";
import MUIDataTable from "mui-datatables";
import * as _ from "lodash";

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

interface TableProps<T> {
  items: ReadonlyArray<T>;
  extract: (item: T) => string[];
  headers: ReadonlyArray<ConfigItem>;
  extractId: (item: T) => string;
  onClick?: (id: string) => void;
}

export class Table<T> extends React.PureComponent<TableProps<T>> {
  render() {
    const { headers, items, extract, extractId, onClick } = this.props;
    const data = items.map(i => [extractId(i), ...extract(i)]);
    const columns = headers.map(
      h => (typeof h === "string" ? { name: h, options: { filter: false } } : h)
    );
    const idColumn = { name: "ID", options: { display: false, filter: false } };
    return (
      <MUIDataTable
        columns={[idColumn, ...columns]}
        data={data}
        options={{
          rowsPerPage: 50,
          rowsPerPageOptions: [20, 50, 100],
          selectableRows: false,
          responsive: "scroll",
          onRowClick: d => onClick(d[0])
        }}
      />
    );
  }
}

export default Table;
