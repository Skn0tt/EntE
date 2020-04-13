import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { CheckboxInput } from "../elements/CheckboxInput";
import { Description } from "./Description";

interface CheckboxWithDescriptionProps {
  value?: boolean;
  onChange: (v: boolean) => void;
  title: string;
  caption: string;
}

export const CheckboxWithDescription: React.FC<CheckboxWithDescriptionProps> = (
  props
) => {
  const { caption, onChange, title, value } = props;

  return (
    <Grid container direction="row" justify="space-between">
      <Grid xs={11}>
        <Description title={title}>{caption}</Description>
      </Grid>

      <Grid xs={1} alignItems="flex-end">
        <CheckboxInput onChange={onChange} value={value} />
      </Grid>
    </Grid>
  );
};
