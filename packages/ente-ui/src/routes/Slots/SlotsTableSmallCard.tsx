import * as React from "react";
import { SlotN } from "../../redux";
import {
  Card,
  Theme,
  CardContent,
  Typography,
  IconButton
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { makeStyles } from "@material-ui/styles";
import { useLocalizedDateFormat } from "../../helpers/use-localized-date-format";
import { Roles } from "ente-types";
import SignedAvatar from "../../elements/SignedAvatar";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    educational: "Educational",
    yes: "Yes",
    no: "No"
  },
  de: {
    educational: "Schulisch",
    yes: "Ja",
    no: "Nein"
  }
});

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    margin: theme.spacing.unit
  },
  upRight: {
    position: "relative",
    float: "right"
  },
  upAlmostRight: {
    position: "relative",
    float: "right",
    top: "-4px"
  }
}));

interface SlotsTableSmallCardProps {
  slot: SlotN;
  role: Roles;
  teacherName: string;
  studentName: string;
  showAddToReviewed: boolean;
  addToReviewed(): void;
}

export const SlotsTableSmallCard: React.FC<
  SlotsTableSmallCardProps
> = props => {
  const {
    slot,
    teacherName,
    studentName,
    role,
    addToReviewed,
    showAddToReviewed
  } = props;

  const classes = useStyles();
  const format = useLocalizedDateFormat();
  const translation = useTranslation();

  return (
    <Card className={classes.card}>
      <CardContent>
        <span className={classes.upRight}>
          <SignedAvatar signed={slot.get("signed")} />
        </span>
        {showAddToReviewed && (
          <span className={classes.upAlmostRight}>
            <IconButton onClick={addToReviewed}>
              <DoneIcon />
            </IconButton>
          </span>
        )}

        <Typography color="textSecondary">
          {format(slot.get("date"), "PP")}; {slot.get("from")} -{" "}
          {slot.get("to")}
        </Typography>

        <Typography variant="h6">
          {role === Roles.STUDENT ? teacherName : studentName}
        </Typography>

        {role !== Roles.STUDENT && (
          <Typography variant="body1">{teacherName}</Typography>
        )}

        <Typography variant="body2">
          {translation.educational}:{" "}
          {slot.get("isEducational") ? translation.yes : translation.no}
        </Typography>
      </CardContent>
    </Card>
  );
};
