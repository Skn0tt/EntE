/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { StyleRules } from "material-ui/styles/withStyles";
import { Theme } from "material-ui/styles/createMuiTheme";

const styles = (theme: Theme): StyleRules => ({
  center: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: "1.2em"
  }
});

export default styles;
