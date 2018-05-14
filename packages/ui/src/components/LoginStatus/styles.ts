/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { StyleRules } from "material-ui/styles/withStyles";
import { Theme } from "material-ui/styles";

const styles = (theme: Theme): StyleRules => ({
  container: theme.mixins.toolbar
});

export default styles;
