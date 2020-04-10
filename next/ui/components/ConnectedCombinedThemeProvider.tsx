import * as React from "react";
import { ColorScheme, createTheme } from "../theme";
import { ThemeProvider as MuiStylesThemeProvider } from "@material-ui/styles";
import { MuiThemeProvider } from "@material-ui/core";
import { MapStateToPropsParam, connect } from "react-redux";
import { AppState, getColorScheme } from "../redux";

interface ConnectedCombinedThemeProviderStateProps {
  colorScheme: ColorScheme;
}
const mapStateToProps: MapStateToPropsParam<
  ConnectedCombinedThemeProviderStateProps,
  {},
  AppState
> = state => ({
  colorScheme: getColorScheme(state)
});

const ConnectedCombinedThemeProvider: React.FC<
  ConnectedCombinedThemeProviderStateProps
> = props => {
  const { colorScheme, children } = props;
  const theme = createTheme(colorScheme);
  return (
    <MuiStylesThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </MuiStylesThemeProvider>
  );
};

export default connect(mapStateToProps)(ConnectedCombinedThemeProvider);
