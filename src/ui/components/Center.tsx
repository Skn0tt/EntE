import * as React from "react";
import { Grid } from "@material-ui/core";

export const Center: React.FC = (props) => {
  const { children } = props;

  return (
    <Grid container alignItems="center" justify="center">
      {children}
    </Grid>
  );
};
