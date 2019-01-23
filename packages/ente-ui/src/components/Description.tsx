import * as React from "react";
import { Grid, Typography } from "@material-ui/core";

interface DescriptionProps {
  title: string;
  children: string;
}

export const Description: React.FC<DescriptionProps> = props => {
  const { title, children } = props;

  return (
    <Grid container direction="column" justify="space-between">
      <Grid>
        <Typography variant="body1">{title}</Typography>
      </Grid>
      <Grid>
        <Typography variant="body2">{children}</Typography>
      </Grid>
    </Grid>
  );
};
