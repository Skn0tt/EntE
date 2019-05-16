import * as React from "react";
import { Roles } from "ente-types";
import { Chip, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  [Roles.ADMIN]: {
    backgroundColor: "rgb(222, 50, 21)",
    color: theme.palette.common.white
  },
  [Roles.MANAGER]: {
    backgroundColor: "#f57c00",
    color: theme.palette.common.white
  },
  [Roles.PARENT]: {
    backgroundColor: "rgb(14, 115, 198)",
    color: theme.palette.common.white
  },
  [Roles.STUDENT]: {
    backgroundColor: "rgb(104, 159, 56)",
    color: theme.palette.common.white
  },
  [Roles.TEACHER]: {
    backgroundColor: "rgb(69, 90, 100)",
    color: theme.palette.common.white
  }
}));

interface RoleChipProps {
  role: Roles;
}

export const RoleChip: React.FC<RoleChipProps> = props => {
  const { role } = props;

  const classes = useStyles();

  return (
    <Chip
      label={role}
      classes={{
        root: classes[role]
      }}
    />
  );
};
