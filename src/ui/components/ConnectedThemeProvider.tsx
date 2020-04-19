import * as React from "react";
import { createTheme } from "../theme";
import { ThemeProvider as MuiStylesThemeProvider } from "@material-ui/styles";
import { MuiThemeProvider } from "@material-ui/core";
import { useSelector } from "react-redux";
import { getColorScheme } from "../redux";

const ConnectedThemeProvider = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;
  const colorScheme = useSelector(getColorScheme);
  const theme = createTheme(colorScheme);
  return (
    <MuiStylesThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </MuiStylesThemeProvider>
  );
};

export default ConnectedThemeProvider;
