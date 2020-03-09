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
import { format } from "date-fns";
import deLocale from "date-fns/locale/de";

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
        width: "70%",
        position: "absolute",
        top: "10%",
        right: "10%",
        margin: "auto"
      }}
    >
      <CardHeader
        title={format(date, "dd. MMMM", { locale: deLocale })}
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
          paddingTop: 0,
          paddingBottom: 0
        }}
      >
        <List>
          {slots.map(s => (
            <SlotRow slot={s} />
          ))}
        </List>
      </CardContent>
      <CardActions disableSpacing style={{ paddingTop: 0, paddingBottom: 0 }}>
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
