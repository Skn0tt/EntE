import * as React from "react";
import { ListItemText, ListItem, ListItemIcon } from "@material-ui/core";
import { useSelector } from "react-redux";
import SettingsIcon from "@material-ui/icons/Settings";
import { getDisplayname } from "../redux";
import Link from "next/link";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  container: {
    height: "64px",
  },
  icon: {
    margin: "12px",
  },
});

/**
 * # Component
 */
export const LoginStatus = (props: {}) => {
  const displayname = useSelector(getDisplayname);

  const classes = useStyles();

  return (
    <Link href="/preferences" aria-label="logout">
      <ListItem className={classes.container} button>
        <ListItemIcon className={classes.icon}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={displayname.orSome("")} />
      </ListItem>
    </Link>
  );
};

export default LoginStatus;
