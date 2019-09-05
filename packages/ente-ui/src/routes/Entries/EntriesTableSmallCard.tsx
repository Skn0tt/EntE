import * as React from "react";
import { EntryN, UserN } from "../../redux";
import {
  Card,
  Theme,
  CardContent,
  Typography,
  Chip,
  ListItem,
  ListItemText,
  List
} from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { makeStyles } from "@material-ui/styles";
import { useLocalizedDateFormat } from "../../helpers/use-localized-date-format";
import { Roles } from "ente-types";
import { Maybe } from "monet";
import SignedAvatar from "../../elements/SignedAvatar";
import { EntryReasonCategoryChip } from "./EntryReasonCategoryChip";

const useTranslation = makeTranslationHook({
  en: {
    parent: "Parent",
    manager: "Manager"
  },
  de: {
    parent: "Eltern",
    manager: "Stufenleiter"
  }
});

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    margin: theme.spacing.unit
  },
  upRight: {
    float: "right",
    top: 0,
    right: 0
  },
  list: {
    paddingBottom: 0,
    paddingTop: theme.spacing.unit * 2
  }
}));

interface EntriesTableSmallCardProps {
  entry: EntryN;
  role: Roles;
  student: Maybe<UserN>;
  onClick: (entry: EntryN) => void;
}

export const EntriesTableSmallCard: React.FC<
  EntriesTableSmallCardProps
> = props => {
  const { entry, role, student, onClick } = props;

  const translation = useTranslation();

  const handleClick = React.useCallback(
    () => {
      onClick(entry);
    },
    [onClick, entry]
  );

  const format = useLocalizedDateFormat();

  const classes = useStyles();

  const startDate = entry.get("date");
  const endDate = entry.get("dateEnd");

  const dateText = !!endDate
    ? format(startDate, "PP") + " - " + format(endDate, "PP")
    : format(startDate, "PP");

  return (
    <Card className={classes.card} onClick={handleClick}>
      <CardContent>
        <div className={classes.upRight}>
          <EntryReasonCategoryChip
            reasonCategory={entry.get("reason").category}
          />
        </div>

        <Typography variant="h6" component="h2">
          {dateText}
        </Typography>

        {role !== Roles.STUDENT && (
          <Typography variant="body1" component="p">
            {student.map(s => s.get("displayname")).orSome("")}
          </Typography>
        )}

        <List className={classes.list}>
          <ListItem dense disableGutters>
            <SignedAvatar signed={entry.get("signedParent")} />
            <ListItemText primary={translation.parent} />
          </ListItem>
          <ListItem dense disableGutters>
            <SignedAvatar signed={entry.get("signedManager")} />
            <ListItemText primary={translation.manager} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};