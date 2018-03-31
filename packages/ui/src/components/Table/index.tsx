import * as React from 'react';
import styles from './styles';
import withStyles from 'material-ui/styles/withStyles';
import {
  TableCell,
  Grid,
  TextField,
  TableHead,
  TableRow,
  TableBody,
  WithStyles,
  Table as MUITable,
} from 'material-ui';
import TableHeadCell from './elements/TableHeadCell';
import lang from '../../res/lang';

type AllowedValues = string | number | boolean;
type Item = ReadonlyArray<AllowedValues>;

interface OwnProps<T> {
  defaultSortField?: number;
  items: ReadonlyArray<T>;
  cellExtractor: (item: T) => Item;
  headers: ReadonlyArray<string>;
  onClick?: (item: T) => void;
  keyExtractor?: (item: T) => string | number;
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

const Table = withStyles(styles)(
  class Table<T> extends React.Component<Props<T>, State> {
    state: State = {
      searchTerm: '',
      sortField: this.props.defaultSortField || 0,
      sortUp: false,
    };

    // Handlers
    handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ searchTerm: event.target.value });
    handleChangeSort = (field: number) => {
      if (this.state.sortField !== field) {
        return this.setState({ sortField: field, sortUp: true });
      }
      return this.setState({ sortUp: !this.state.sortUp });
    };

    // Methods
    filter = (item: T): boolean => {
      const value = this.props.cellExtractor(item)[this.state.sortField];

      if (typeof value === 'boolean') {
        return true;
      }

      return ('' + value).includes(this.state.searchTerm);
    };
    sortMulti = () => (this.state.sortUp ? 1 : -1);
    sort = (a: T, b: T): number => {
      const valueA = this.props.cellExtractor(a)[this.state.sortField];
      const valueB = this.props.cellExtractor(b)[this.state.sortField];
      if (typeof valueA === 'boolean') {
        return valueA === valueB ? 0 : valueA ? -1 : 1;
      }

      if (typeof valueA === 'number') {
        return (valueA - (valueB as number)) * this.sortMulti();
      }

      return valueA.localeCompare(valueB as string) * this.sortMulti();
    };
    truncate = (str: string, length: number, ending: string) =>
      str.length > length ? str.substring(0, length - ending.length) + ending : str;
    show = (value: AllowedValues) => {
      if (typeof value === 'string') {
        return this.truncate(value, 20, '...');
      }
      if (typeof value === 'boolean') {
        return value ? this.props.trueElement : this.props.falseElement;
      }
      return value;
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
        cellExtractor,
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
                  {headers.map((item, index) => (
                    <TableHeadCell
                      key={item}
                      tooltip={lang().ui.table.sortTooltip(item)}
                      active={sortField === index}
                      sortUp={sortUp}
                      onClick={() => this.handleChangeSort(index)}
                    >
                      {item}
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
                      key={keyExtractor ? keyExtractor(item) : item[0]}
                      onClick={() => onClick && onClick(item)}
                      hover={!!onClick}
                    >
                      {cellExtractor(item).map((value, index) => (
                        <TableCell key={index}>{this.show(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </MUITable>
          </Grid>
        </Grid>
      );
    }
  },
);

export default Table;
