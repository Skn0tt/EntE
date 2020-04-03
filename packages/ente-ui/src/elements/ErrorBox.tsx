import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme, Typography } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

interface ErrorBoxProps {
  children: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
    borderStyle: "solid",
    borderWidth: "thin",
    borderRadius: "10px",
    borderColor: theme.palette.error.main,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    marginRight: "16px"
  }
}));

export const ErrorBox = (props: ErrorBoxProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ErrorOutlineIcon color="error" className={styles.icon} />
      <Typography color="error">{props.children}</Typography>
    </div>
  );
};
