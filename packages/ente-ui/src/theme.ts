/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

const theme = createMuiTheme({
  palette: {
    primary: blue
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MUIDataTable: {
      paper: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
      },
      responsiveScroll: {
        flexGrow: 1
      }
    }
  } as any
});

export default theme;
