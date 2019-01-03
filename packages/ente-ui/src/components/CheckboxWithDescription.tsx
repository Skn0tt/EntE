import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { CheckboxInput } from "../elements/CheckboxInput";

interface CheckboxWithDescriptionProps {
  value?: boolean;
  onChange: (v: boolean) => void;
  title: string;
  caption: string;
}

export const CheckboxWithDescription: React.FC<
  CheckboxWithDescriptionProps
> = props => {
  const { caption, onChange, title, value } = props;

  return (
    <Grid container direction="row" justify="space-between">
      <Grid xs={11}>
        <Typography variant="body1">{title}</Typography>

        <Typography variant="body2">{caption}</Typography>
      </Grid>

      <Grid xs={1} alignItems="flex-end">
        <CheckboxInput onChange={onChange} value={value} />
      </Grid>
    </Grid>
  );
};
