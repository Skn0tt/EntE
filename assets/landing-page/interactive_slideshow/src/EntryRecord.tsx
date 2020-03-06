import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { SlotRow } from "./SlotInput";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  CardActions,
  IconButton
} from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { Tooltip } from "./Tooltip";

interface EntryRecordProps {
  entry: Entry;
  parentCheck: boolean;
  managerCheck: boolean;
  onCheck: () => void;
  tooltip: string;
}

export function EntryRecord(props: EntryRecordProps) {
  const {
    entry: { date, reason, slots },
    parentCheck,
    tooltip,
    managerCheck,
    onCheck
  } = props;

  return (
    <Card
      style={{
        width: "80%"
      }}
    >
      <CardHeader
        title={date.toDateString()}
        titleTypographyProps={{
          variant: "body1"
        }}
        subheader={reason}
        subheaderTypographyProps={{
          variant: "body2"
        }}
        style={{
          paddingBottom: 0
        }}
      />
      <CardContent
        style={{
          padding: 0
        }}
      >
        <List>
          {slots.map(s => (
            <SlotRow slot={s} />
          ))}
        </List>
      </CardContent>
      <CardActions disableSpacing>
        {parentCheck &&
          (managerCheck ? (
            <DoneAllIcon style={{ color: "green" }} />
          ) : (
            <DoneIcon style={{ color: "green" }} />
          ))}

        {!(parentCheck && managerCheck) && (
          <Tooltip title={tooltip} open={!!tooltip} placement="left" arrow>
            <IconButton
              style={{
                marginLeft: "auto"
              }}
              onClick={onCheck}
            >
              <AssignmentTurnedInIcon style={{ color: "green" }} />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}
