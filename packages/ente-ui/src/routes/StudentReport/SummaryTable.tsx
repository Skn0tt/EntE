import * as React from "react";
import { EntrySummary } from "../../reporting/reporting";
import {
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Tooltip
} from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    total: "Total",
    unexcused: "Unexcused",
    entries: "Entries",
    absentDays: "Absent Days",
    absentHours: "Absent Hours",
    hourRate: "Hourrate",
    hourRateTooltip: "Absent Hours per Absent Day"
  },
  de: {
    total: "Gesamt",
    unexcused: "Unentschuldigt",
    entries: "Einträge",
    absentDays: "Fehltage",
    absentHours: "Fehlstunden",
    hourRate: "Stundenrate",
    hourRateTooltip: "Fehlstunden pro Abwesenheitstag"
  }
});

interface SummaryTableProps {
  data: EntrySummary;
}

export const SummaryTable: React.FC<SummaryTableProps> = props => {
  const { data } = props;

  const translation = useTranslation();

  return (
    <Paper elevation={2}>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{translation.total}</TableCell>
            <TableCell>{translation.unexcused}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{translation.entries}</TableCell>
            <TableCell>{data.entries.total}</TableCell>
            <TableCell>{data.entries.unexcused}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{translation.absentDays}</TableCell>
            <TableCell>{data.absentDays.unexcused}</TableCell>
            <TableCell>{data.absentDays.unexcused}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{translation.absentHours}</TableCell>
            <TableCell>{data.absentSlots.unexcused}</TableCell>
            <TableCell>{data.absentSlots.unexcused}</TableCell>
          </TableRow>
          <TableRow>
            <Tooltip title={translation.hourRateTooltip} placement="right">
              <TableCell>{translation.hourRate}</TableCell>
            </Tooltip>
            <TableCell>{data.slotsPerDay.toFixed(2)}</TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};
