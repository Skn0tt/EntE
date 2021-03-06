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

function getSystemTheme(): "light" | "dark" {
  if (!window.matchMedia) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export type ColorScheme = "light" | "dark" | "system";

export const createTheme = _.memoize(
  (scheme: ColorScheme): Theme => {
    return createMuiTheme({
      palette: {
        primary: blue,
        type: scheme === "system" ? getSystemTheme() : scheme,
      },
      typography: {
        useNextVariants: true,
      },
      overrides: {
        MUIDataTable: {
          paper: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          },
          responsiveScrollMaxHeight: {
            maxHeight: "unset !important",
          },
          tableRoot: {
            tableLayout: "fixed",
          },
        },
        MUIDataTableHeadCell: {
          toolButton: { display: "flex" },
        },
        MuiTableCell: {
          root: {
            padding: "4px 4px 4px 24px",
          },
        },
        MUIDataTableToolbar: {
          root: { minHeight: "auto" },
        },
        MUIDataTablePagination: {
          toolbar: {
            marginRight: 56,
          },
          root: {
            "&:last-child": {
              padding: 0,
            },
          },
        },
        MuiTablePagination: {
          spacer: {
            display: "None",
          },
        },
      } as any,
    });
  }
);
