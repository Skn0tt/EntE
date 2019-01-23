import * as React from "react";
import { EntrySummary } from "../reporting/reporting";
import {
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Tooltip
} from "@material-ui/core";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    total: "total",
    unexcused: "unexcused",
    entries: "Entries",
    absentDays: "Absent Days",
    absentHours: "Absent Hours",
    hourRate: "Hourrate",
    hourRateTooltip: "Absent Hours per Absent Day"
  },
  de: {
    total: "gesamt",
    unexcused: "unentschuldigt",
    entries: "Einträge",
    absentDays: "Abwesenheitstage",
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="right">{translation.total}</TableCell>
            <TableCell align="right">{translation.unexcused}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="left">{translation.entries}</TableCell>
            <TableCell align="right">{data.entries.total}</TableCell>
            <TableCell align="right">{data.entries.unexcused}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">{translation.absentDays}</TableCell>
            <TableCell align="right">{data.absentDays.unexcused}</TableCell>
            <TableCell align="right">{data.absentDays.unexcused}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">{translation.absentHours}</TableCell>
            <TableCell align="right">{data.absentSlots.unexcused}</TableCell>
            <TableCell align="right">{data.absentSlots.unexcused}</TableCell>
          </TableRow>
          <TableRow>
            <Tooltip title={translation.hourRateTooltip} placement="right">
              <TableCell align="left">{translation.hourRate}</TableCell>
            </Tooltip>
            <TableCell align="right">{data.slotsPerDay.toFixed(2)}</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};
