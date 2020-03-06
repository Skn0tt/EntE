import * as React from "react";
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Grid
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { DatePicker } from "./DatePicker";
import { Slot, SlotInput } from "./SlotInput";
import { Tooltip } from "./Tooltip";
import { useFullscreenContainer } from "./FullScreen";

export interface Entry {
  date: Date;
  reason: string;
  slots: Slot[];
}

export type EntryStage = "date" | "reason" | "slots" | "send";

const reasons = [
  "Wettbewerb",
  "Klausur",
  "Sonstiges (schulisch)",
  "Krankheit",
  "Sonstiges (außerschulisch)"
];

interface EntryProps {
  stage: EntryStage;
  onDateEntered: () => void;
  onReasonEntered: () => void;
  onSlotAdded: () => void;
  onSent: (entry: Entry) => void;
}

function isLaterThan(target: EntryStage, current: EntryStage) {
  const order: EntryStage[] = ["date", "reason", "slots", "send"];

  return order.indexOf(current) >= order.indexOf(target);
}

export function EntryCreationForm(props: EntryProps) {
  const { stage, onDateEntered, onReasonEntered, onSent, onSlotAdded } = props;

  const [date, setDate] = React.useState<Date>(undefined);
  const [reason, setReason] = React.useState<string>(undefined);
  const [slots, setSlots] = React.useState<Slot[]>(undefined);

  const container = useFullscreenContainer();

  return (
    <Card
      style={{
        width: "100%",
        float: "right",
        marginTop: "5%",
        marginRight: "5%"
      }}
    >
      <CardContent>
        <Typography
          style={{ fontSize: "1rem" }}
          color={stage === "date" ? "textPrimary" : "textSecondary"}
        >
          Neuer Eintrag
        </Typography>
        <Grid container direction="column">
          <Grid item>
            <Tooltip
              title="Wann hast du gefehlt?"
              open={stage === "date"}
              arrow
              placement="left-end"
            >
              <DatePicker
                enabled={stage === "date"}
                onPick={date => {
                  setDate(date);
                  onDateEntered();
                }}
              />
            </Tooltip>
          </Grid>

          {isLaterThan("reason", stage) && (
            <Grid item>
              <Tooltip
                title="Was war der Grund deines Fehlens?"
                open={stage === "reason"}
                arrow
                placement="left-end"
              >
                <TextField
                  select
                  disabled={stage !== "reason"}
                  label="Grund"
                  value={reason}
                  fullWidth
                  SelectProps={{
                    MenuProps: {
                      container
                    }
                  }}
                  onChange={evt => {
                    setReason(evt.target.value);
                    onReasonEntered();
                  }}
                >
                  {reasons.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>
            </Grid>
          )}

          {isLaterThan("slots", stage) && (
            <Grid item>
              <Tooltip
                title="In welchen Stunden hast du gefehlt?"
                open={stage === "slots"}
                arrow
                placement="left"
              >
                <SlotInput
                  onSlotAdded={slots => {
                    setSlots(slots);
                    onSlotAdded();
                  }}
                />
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </CardContent>
      {isLaterThan("send", stage) && (
        <CardActions style={{ position: "relative", marginTop: "10px" }}>
          <Tooltip
            title="Erstellen sie den Eintrag."
            open={stage === "send"}
            placement="left"
            arrow
          >
            <IconButton
              style={{
                padding: "0",
                position: "absolute",
                right: "10px",
                bottom: "10px"
              }}
              onClick={() => {
                onSent({
                  date,
                  reason,
                  slots
                });
              }}
            >
              <CheckCircleIcon style={{ color: "green", fontSize: "32" }} />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
}
