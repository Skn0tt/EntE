import * as React from "react";
import { SlotN } from "ente-ui/src/redux";
import { Card, Theme, CardContent, Typography } from "@material-ui/core";
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
    float: "right",
    top: 0,
    right: 0
  },
  downRight: {
    float: "right",
    bottom: 0,
    right: 0
  }
}));

interface SlotsTableSmallCardProps {
  slot: SlotN;
  role: Roles;
  teacherName: string;
  studentName: string;
}

export const SlotsTableSmallCard: React.FC<
  SlotsTableSmallCardProps
> = props => {
  const { slot, teacherName, studentName, role } = props;

  const classes = useStyles();
  const format = useLocalizedDateFormat();
  const translation = useTranslation();

  return (
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.upRight}>
          <SignedAvatar signed={slot.get("signed")} />
        </div>

        <Typography color="textSecondary">
          {format(slot.get("date"), "PP")}; {slot.get("from")} -{" "}
          {slot.get("to")}
        </Typography>

        <Typography variant="h6">
          {role === Roles.STUDENT ? teacherName : studentName}
        </Typography>

        {role !== Roles.STUDENT && (
          <Typography component="p" variant="body1">
            {teacherName}
          </Typography>
        )}

        <Typography component="p" variant="body2">
          {translation.educational}:{" "}
          {slot.get("isEducational") ? translation.yes : translation.no}
        </Typography>
      </CardContent>
    </Card>
  );
};
