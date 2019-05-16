import * as React from "react";
import { UserN } from "../../redux";
import { Card, CardContent, Typography, Chip, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { RoleChip } from "./RoleChip";

const useStyles = makeStyles((theme: Theme) => ({
  roleDiv: {
    float: "right",
    top: 0,
    right: 0
  },
  card: {
    margin: theme.spacing.unit
  }
}));

interface UserTableSmallCardProps {
  user: UserN;
  onClick: (user: UserN) => void;
}

export const UserTableSmallCard: React.FC<UserTableSmallCardProps> = props => {
  const { user, onClick } = props;

  const classes = useStyles();

  const handleClick = React.useCallback(
    () => {
      onClick(user);
    },
    [onClick, user]
  );

  return (
    <Card onClick={handleClick} className={classes.card} elevation={1}>
      <CardContent>
        <div className={classes.roleDiv}>
          <RoleChip role={user.get("role")} />
        </div>

        <Typography color="textSecondary">{user.get("username")}</Typography>

        <Typography variant="h6">{user.get("displayname")}</Typography>

        <Typography component="p">{user.get("email")}</Typography>
      </CardContent>
    </Card>
  );
};
