/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  StyleRules,
  StyleRulesCallback
} from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const drawerWidth = 240;

const styles: StyleRulesCallback = theme => ({
  root: {
    width: "100%",
    zIndex: 1,
    overflowX: "hidden"
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    position: "fixed",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  grow: {
    flex: "1 1 auto"
  },
  logo: {
    display: "block",
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
      left: "50%",
      marginLeft: "-62px"
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    },
    color: "white"
  },
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      position: "fixed",
      height: "100%"
    }
  },
  content: {
    width: "100%",
    marginTop: 64,
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth
    }
  },
  loadingIndicator: {
    position: "fixed",
    width: "100%"
  }
});

export default styles;
