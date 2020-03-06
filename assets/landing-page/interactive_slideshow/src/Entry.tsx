import * as React from "react";
import { Card, CardContent, CardActions, IconButton } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

interface Slot {
  teacher: string;
  from: number;
  to: number;
}

interface Entry {
  date: string;
  reason: string;
  slots: Slot[];
}

interface EntryProps {
  stage: "date" | "reason" | "slots" | "send";
  onDateEntered: () => void;
  onReasonEntered: () => void;
  onSlotAdded: () => void;
  onSent: () => void;
}

export function Entry(props: EntryProps) {
  const {} = props;

  return (
    <Card
      style={{
        width: "40%",
        float: "right",
        marginTop: "5%",
        marginRight: "5%"
      }}
    >
      <CardContent>test</CardContent>
      <CardActions>
        <IconButton>
          <CheckCircleIcon style={{ color: "green" }} />
        </IconButton>
      </CardActions>
    </Card>
  );
}
