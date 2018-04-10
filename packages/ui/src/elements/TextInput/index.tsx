import * as React from "react";
import { Grid, Typography, TextField } from "material-ui";

/**
 * # Component Types
 */
interface OwnProps {
  validator: (s: string) => boolean;
  onChange: (s: string) => void;
  title?: string;
  value: string;
  type?: string;
  label?: string;
  required?: boolean;
}

type Props = OwnProps;

/**
 * # Component
 */
export const TextInput: React.SFC<Props> = props => {
  const { validator, onChange, title, value, type, label, required } = props;

  return (
    <Grid container direction="column">
      {!!title && (
        <Grid item>
          <Typography variant="title">{title}</Typography>
        </Grid>
      )}
      <Grid item>
        <TextField
          className="updateInput"
          fullWidth
          type={type}
          error={!!value && !validator(value)}
          value={value}
          label={label}
          required={required}
          onChange={e => onChange(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default TextInput;
