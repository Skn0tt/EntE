/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { green, red, common } from "@material-ui/core/colors";
import { StyleRules } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const styles = (theme: Theme): StyleRules => ({
  list: {
    width: "100%"
  },
  listItem: {
    width: "100%"
  },
  signEntryButton: {
    backgroundColor: green[500],
    color: common.white
  },
  unsignEntryButton: {
    color: red[500]
  }
});

export default styles;
