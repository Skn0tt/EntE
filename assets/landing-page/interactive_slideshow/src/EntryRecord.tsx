import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Card, CardHeader, CardContent } from "@material-ui/core";

interface EntryRecordProps {
  entry: Entry;
  parentCheck: boolean;
  managerCheck: boolean;
  onCheck: () => void;
}

export function EntryRecord(props: EntryRecordProps) {
  const {
    entry: { date, reason, slots },
    parentCheck,
    managerCheck,
    onCheck
  } = props;

  return (
    <Card>
      <CardHeader>
        ${date.toDateString()}
        {reason}
      </CardHeader>
      <CardContent>
        {JSON.stringify(slots)}
        {parentCheck}
        {managerCheck}
      </CardContent>
    </Card>
  );
}
