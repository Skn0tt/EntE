import * as React from "react";
import { Dialog, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

export const ResponsiveFullscreenDialog: typeof Dialog = (props) => {
  const theme = useTheme<Theme>();
  const isNarrow = useMediaQuery(theme.breakpoints.down("xs"));
  return <Dialog fullScreen={isNarrow} {...props} />;
};
