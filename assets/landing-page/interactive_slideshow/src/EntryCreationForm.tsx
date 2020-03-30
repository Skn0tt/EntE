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
import { motion } from "framer-motion";

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
    <motion.div initial={{ x: 100 }} animate={{ x: 0 }}>
      <Card
        style={{
          width: "90%",
          maxHeight: "90%",
          float: "right",
          margin: "5%"
        }}
      >
        <CardContent style={{ padding: "12px" }}>
          <Typography
            style={{ fontSize: "1rem" }}
            color={stage === "send" ? "textSecondary" : "textPrimary"}
          >
            Neuer Eintrag
          </Typography>
          <Grid
            container
            direction="row"
            spacing={isLaterThan("slots", stage) ? 1 : undefined}
          >
            <Grid item xs={isLaterThan("slots", stage) ? 6 : 12}>
              <Tooltip
                title="Wann hast du gefehlt?"
                open={stage === "date"}
                arrow
                placement="left-end"
              >
                <DatePicker
                  enabled={stage === "date"}
                  showLabel={!isLaterThan("slots", stage)}
                  onPick={date => {
                    setDate(date);
                    onDateEntered();
                  }}
                />
              </Tooltip>
            </Grid>

            {isLaterThan("reason", stage) && (
              <Grid item xs={isLaterThan("slots", stage) ? 6 : 12}>
                <Tooltip
                  title="Was war der Grund deines Fehlens?"
                  open={stage === "reason"}
                  arrow
                  placement="left-end"
                >
                  <TextField
                    select
                    disabled={stage !== "reason"}
                    label={isLaterThan("slots", stage) ? undefined : "Grund"}
                    value={reason}
                    fullWidth
                    size="small"
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
          <CardActions style={{ position: "relative", marginTop: "10%" }}>
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
    </motion.div>
  );
}
