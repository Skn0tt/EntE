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
import { motion } from "framer-motion";

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
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
      <Card
        style={{
          width: "70%",
          position: "absolute",
          margin: "auto",
          marginTop: "10%",
          right: "10%"
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

          <motion.div
            style={{ marginLeft: "auto" }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            initial={{ opacity: 0 }}
          >
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
          </motion.div>
        </CardActions>
      </Card>
    </motion.div>
  );
}
