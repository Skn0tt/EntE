import * as React from "react";
import { Roles } from "ente-types";
import { Chip, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { RoleTranslation } from "../../roles.translation";

const useStyles = makeStyles((theme: Theme) => ({
  [RoleTranslation.de.admin]: {
    backgroundColor: "rgb(222, 50, 21)",
    color: theme.palette.common.white
  },
  [RoleTranslation.de.manager]: {
    backgroundColor: "#f57c00",
    color: theme.palette.common.white
  },
  [RoleTranslation.de.parent]: {
    backgroundColor: "rgb(14, 115, 198)",
    color: theme.palette.common.white
  },
  [RoleTranslation.de.student]: {
    backgroundColor: "rgb(104, 159, 56)",
    color: theme.palette.common.white
  },
  [RoleTranslation.de.teacher]: {
    backgroundColor: "rgb(69, 90, 100)",
    color: theme.palette.common.white
  },
  [RoleTranslation.en.admin]: {
    backgroundColor: "rgb(222, 50, 21)",
    color: theme.palette.common.white
  },
  [RoleTranslation.en.manager]: {
    backgroundColor: "#f57c00",
    color: theme.palette.common.white
  },
  [RoleTranslation.en.parent]: {
    backgroundColor: "rgb(14, 115, 198)",
    color: theme.palette.common.white
  },
  [RoleTranslation.en.student]: {
    backgroundColor: "rgb(104, 159, 56)",
    color: theme.palette.common.white
  },
  [RoleTranslation.en.teacher]: {
    backgroundColor: "rgb(69, 90, 100)",
    color: theme.palette.common.white
  }
}));

interface RoleChipProps {
  translatedRole: string;
}

export const RoleChip: React.FC<RoleChipProps> = props => {
  const { translatedRole } = props;

  const classes = useStyles();

  return (
    <Chip
      label={translatedRole}
      classes={{
        root: classes[translatedRole]
      }}
    />
  );
};
