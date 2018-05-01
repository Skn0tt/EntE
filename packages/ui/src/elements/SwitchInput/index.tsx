import * as React from "react";
import { Grid, Typography, Switch } from "material-ui";

/**
 * # Component Types
 */
interface OwnProps {
  onChange(b: boolean): void;
  value: boolean;
  title: string;
}

type Props = OwnProps;

/**
 * # Component
 */
export const SwitchInput: React.SFC<Props> = props => {
  const { onChange, value, title } = props;

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="title">{title}</Typography>
      </Grid>
      <Grid item>
        <Switch
          className="updateSwitch"
          checked={value}
          onChange={e => onChange(e.target.checked)}
        />
      </Grid>
    </Grid>
  );
};

export default SwitchInput;
