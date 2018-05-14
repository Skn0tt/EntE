/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { StyleRules } from "material-ui/styles/withStyles";
import { Theme } from "material-ui/styles/createMuiTheme";
import pink from "material-ui/colors/pink";

const styles = (theme: Theme): StyleRules => ({
  avatar: {
    backgroundColor: pink[500]
  }
});

export default styles;
