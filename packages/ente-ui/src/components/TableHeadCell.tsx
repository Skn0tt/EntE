/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { TableCell, TableSortLabel, Tooltip } from "@material-ui/core";

/**
 * # Component Types
 */
interface TableHeadCellOwnProps {
  active: boolean;
  sortUp: boolean;
  tooltip: string;
  onClick(): void;
}
type TableHeadCellProps = TableHeadCellOwnProps;

/**
 * # Component
 */
export const TableHeadCell: React.SFC<TableHeadCellProps> = props => {
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

export default TableHeadCell;
