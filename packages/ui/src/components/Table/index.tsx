import * as React from "react";
import styles from "./styles";
import withStyles from "material-ui/styles/withStyles";
import {
  TableCell,
  Grid,
  TextField,
  TableHead,
  TableRow,
  TableBody,
  WithStyles,
  Table as MUITable
} from "material-ui";
import TableHeadCell from "./elements/TableHeadCell";
import lang from "ente-lang";
import * as _ from "lodash";

/**
 * # Component Types
 */
type AllowedValues = string | number | boolean;
type Item = ReadonlyArray<AllowedValues>;

interface OwnProps<T> {
  defaultSortField?: number;
  items: ReadonlyArray<T>;
  cellExtractor: (item: T) => Item;
  headers: ReadonlyArray<string>;
  onClick?: (item: T) => void;
  keyExtractor: (item: T) => string | number;
  trueElement?: JSX.Element;
  falseElement?: JSX.Element;
  sort?: (a: T, b: T) => number;
  filter?: (item: T) => boolean;
}

type Props<T> = OwnProps<T> & WithStyles;

interface State {
  searchTerm: string;
  sortField: number;
  sortUp: boolean;
}

/**
 * # Logic
 */
export const changeSearch = (v: string) => (s: State): State => ({
  ...s,
  searchTerm: v
});

export const changeSortField = (i: number) => (s: State): State =>
  s.sortField === i
    ? { ...s, sortUp: !s.sortUp }
    : { ...s, sortField: i, sortUp: true };

/**
 * # Component
 */
export class Table<T> extends React.PureComponent<Props<T>, State> {
  /**
   * ## Intialization
   */
  state: State = {
    searchTerm: "",
    sortField: this.props.defaultSortField || 0,
    sortUp: false
  };

  /**
   * ## Handlers
   */
  handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState(changeSearch(event.target.value));
  handleChangeSort = (i: number) => this.setState(changeSortField(i));

  /**
   * Logic
   */
  filter = (item: T): boolean => {
    const value = this.props.cellExtractor(item)[this.state.sortField];

    if (typeof value === "boolean") {
      return true;
    }

    return ("" + value).indexOf(this.state.searchTerm) !== -1;
  };

  sortMulti = () => (this.state.sortUp ? 1 : -1);
  sort = (a: T, b: T): number => {
    const valueA = this.props.cellExtractor(a)[this.state.sortField];
    const valueB = this.props.cellExtractor(b)[this.state.sortField];
    if (typeof valueA === "boolean") {
      return valueA === valueB ? 0 : valueA ? -1 : 1;
    }

    if (typeof valueA === "number") {
      return (valueA - (valueB as number)) * this.sortMulti();
    }

    return valueA.localeCompare(valueB as string) * this.sortMulti();
  };
  truncate = (str: string, length: number, ending: string) =>
    str.length > length
      ? str.substring(0, length - ending.length) + ending
      : str;
  show = (v: AllowedValues) => {
    switch (typeof v) {
      case "string":
        return _.truncate(v as string, { length: 20 });
      case "boolean":
        return v ? this.props.trueElement : this.props.falseElement;
      default:
        return v;
    }
  };

  render(): JSX.Element {
    const {
      classes,
      keyExtractor,
      onClick,
      items,
      headers,
      sort,
      filter,
      cellExtractor
    } = this.props;
    const { sortField, sortUp } = this.state;

    return (
      <Grid container direction="column">
        <Grid item container direction="row">
          <Grid item xs={12}>
            <TextField
              placeholder={lang().ui.table.search}
              fullWidth
              className={classes.searchBar}
              onChange={this.handleChangeSearch}
            />
          </Grid>
        </Grid>
        <Grid item className={classes.table}>
          <MUITable>
            <TableHead>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHeadCell
                    key={header}
                    tooltip={lang().ui.table.sortTooltip(header)}
                    active={sortField === i}
                    sortUp={sortUp}
                    onClick={() => this.handleChangeSort(i)}
                  >
                    {header}
                  </TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items
                .filter(filter || this.filter)
                .sort(sort || this.sort)
                .map(item => (
                  <TableRow
                    key={keyExtractor(item)}
                    onClick={() => onClick && onClick(item)}
                    hover={!!onClick}
                  >
                    {cellExtractor(item).map((v, i) => (
                      <TableCell key={i}>{this.show(v)}</TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </MUITable>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Table);
