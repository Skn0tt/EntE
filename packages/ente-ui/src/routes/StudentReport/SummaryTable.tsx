import * as React from "react";
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
import { SlotN } from "../../redux";
import { Reporting } from "../../reporting/reporting";

const useTranslation = makeTranslationHook({
  en: {
    total: "Total",
    excused: "Excused",
    unexcused: "Unexcused",
    pendingEntry: "Entry pending",
    absentDays: "Absent Days",
    absentHours: "Absent Hours",
    hourRate: "Hourrate",
    hourRateTooltip: "Absent Hours per Absent Day"
  },
  de: {
    total: "Gesamt",
    excused: "Entschuldigt",
    unexcused: "Unentschuldigt",
    pendingEntry: "Eintrag ausstehend",
    absentDays: "Fehltage",
    absentHours: "Fehlstunden",
    hourRate: "Stundenrate",
    hourRateTooltip: "Fehlstunden pro Abwesenheitstag"
  }
});

interface SummaryTableProps {
  slots: SlotN[];
}

export const SummaryTable: React.FC<SummaryTableProps> = props => {
  const translation = useTranslation();

  const { slots } = props;
  const { created, prefiled, signed } = Reporting.partitionSlots(slots);

  return (
    <Paper elevation={2}>
      <Table padding="dense">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{translation.total}</TableCell>
            <TableCell>{translation.excused}</TableCell>
            <TableCell>{translation.unexcused}</TableCell>
            <TableCell>{translation.pendingEntry}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{translation.absentDays}</TableCell>
            <TableCell>{Reporting.countDays(slots)}</TableCell>
            <TableCell>{Reporting.countDays(signed)}</TableCell>
            <TableCell>{Reporting.countDays(created)}</TableCell>
            <TableCell>{Reporting.countDays(prefiled)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{translation.absentHours}</TableCell>
            <TableCell>{Reporting.countHours(slots)}</TableCell>
            <TableCell>{Reporting.countHours(signed)}</TableCell>
            <TableCell>{Reporting.countHours(created)}</TableCell>
            <TableCell>{Reporting.countHours(prefiled)}</TableCell>
          </TableRow>
          <TableRow>
            <Tooltip title={translation.hourRateTooltip} placement="right">
              <TableCell>{translation.hourRate}</TableCell>
            </Tooltip>
            <TableCell>{Reporting.calcHourRate(slots).toFixed(2)}</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};
