import * as React from 'react';
import { withStyles, TableCell, TableSortLabel, Tooltip, WithStyles } from 'material-ui';
import styles from './styles';

interface OwnProps {
  active: boolean;
  sortUp: boolean;
  tooltip: string;
  onClick(): void;
}
type Props = OwnProps & WithStyles;

const TableHeadCell: React.SFC<Props> = props => (
  <TableCell>
    <Tooltip title={props.tooltip} enterDelay={300}>
      <TableSortLabel
        active={props.active}
        direction={props.sortUp ? 'asc' : 'desc'}
        onClick={props.onClick}
      >
        {props.children}
      </TableSortLabel>
    </Tooltip>
  </TableCell>
);

export default withStyles(styles)(TableHeadCell);
