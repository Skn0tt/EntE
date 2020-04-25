import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { logout } from "ui/redux";
import { IconButton, Theme } from "@material-ui/core";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
}));

export function LogoutButton() {
  const classes = useStyles();

  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push("/login");
  }, [router, dispatch]);

  return (
    <IconButton onClick={handleLogout} className={classes.icon}>
      <PowerSettingsNewIcon style={{ color: "white" }} />
    </IconButton>
  );
}
