/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { StyleRules } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const styles = (theme: Theme): StyleRules => ({
  searchBar: {
    padding: 10
  },
  fab: {
    margin: 0,
    top: "auto",
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    left: "auto",
    position: "fixed"
  },
  table: {
    overflowX: "auto"
  },
  mailAvatar: {
    width: theme.spacing.unit,
    height: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
});

export default styles;
