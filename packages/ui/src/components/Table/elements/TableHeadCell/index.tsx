import * as React from "react";
import {
  withStyles,
  TableCell,
  TableSortLabel,
  Tooltip,
  WithStyles
} from "material-ui";
import styles from "./styles";

/**
 * # Component Types
 */
interface OwnProps {
  active: boolean;
  sortUp: boolean;
  tooltip: string;
  onClick(): void;
}
type Props = OwnProps & WithStyles;

/**
 * # Component
 */
export const TableHeadCell: React.SFC<Props> = props => {
  const { tooltip, active, onClick, children, sortUp } = props;
  return (
    <TableCell>
      <Tooltip title={tooltip} enterDelay={300}>
        <TableSortLabel
          active={active}
          direction={sortUp ? "asc" : "desc"}
          onClick={onClick}
          className="tableSortLabel"
        >
          {children}
        </TableSortLabel>
      </Tooltip>
    </TableCell>
  );
};

export default withStyles(styles)(TableHeadCell);
