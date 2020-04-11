import * as React from "react";
import { ValidationError } from "class-validator";
import {
  Typography,
  withStyles,
  createStyles,
  Theme,
  WithStyles,
} from "@material-ui/core";
import * as _ from "lodash";

const errorToString = (error: ValidationError): string => {
  const msg = _.values(error.constraints).join(" ");
  return `${msg} (${JSON.stringify(error.target)})`;
};

interface ErrorDisplayOwnProps {
  errors: (ValidationError | string)[];
}

type ErrorDisplayProps = ErrorDisplayOwnProps & WithStyles<"error">;

const ErrorDisplay: React.SFC<ErrorDisplayProps> = (props) => {
  const { errors, classes } = props;

  return (
    <Typography variant="body1" className={classes.error}>
      {errors.map((e) => (
        <p>{typeof e === "string" ? e : errorToString(e)}</p>
      ))}
    </Typography>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.secondary.main,
    },
  });

export default withStyles(styles)(ErrorDisplay);
