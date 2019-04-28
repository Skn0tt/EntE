/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createMuiTheme, Theme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import * as _ from "lodash";

export type ColorScheme = "light" | "dark";

export const createTheme = _.memoize(
  (scheme: ColorScheme): Theme => {
    return createMuiTheme({
      palette: {
        primary: blue,
        type: scheme
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
            flexGrow: 1,
            maxHeight: undefined
          }
        },
        MUIDataTablePagination: {
          toolbar: {
            marginRight: 56
          },
          root: {
            "&:last-child": {
              padding: 0
            }
          }
        },
        MuiTablePagination: {
          spacer: {
            display: "None"
          }
        }
      } as any
    });
  }
);
