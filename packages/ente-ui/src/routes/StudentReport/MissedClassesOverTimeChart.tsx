import * as React from "react";
import { SlotN } from "../../redux";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import * as _ from "lodash";
import { Reporting } from "../../reporting/reporting";
import {
  parseISO,
  format,
  addDays,
  addMonths,
  getMonth,
  setDate,
  startOfDay
} from "date-fns";

function getLastSeptember(date: number): number {
  const month = getMonth(date);
  const lastSeptemberDistance = 9 - (month + 12);
  console.log(lastSeptemberDistance, +addMonths(date, lastSeptemberDistance));
  return +setDate(addMonths(date, lastSeptemberDistance), 1);
}

function generateDaysBetween(min: number, max: number) {
  const result: number[] = [];
  for (let current = min; current <= max; current = +addDays(current, 1)) {
    result.push(+startOfDay(current));
  }
  return result;
}

function computeTimeSeriesFromSlots(slots: SlotN[]) {
  const dates = slots.map(s => +parseISO(s.get("date")));
  const minDate = _.min(dates) || Number.MAX_SAFE_INTEGER;

  const domainStart = Math.min(minDate, getLastSeptember(Date.now()));

  const slotsByDate = _.groupBy(slots, s => +parseISO(s.get("date")));
  const hoursByDate = _.mapValues(slotsByDate, Reporting.countHours);

  for (const day of generateDaysBetween(domainStart, Date.now())) {
    hoursByDate[day] = hoursByDate[day] || 0;
  }

  const xy = _.map(hoursByDate, (hours, date) => ({
    x: +startOfDay(+date),
    y: hours
  }));

  return _.sortBy(xy, p => p.x);
}

interface MissedClassesOverTimeChartProps {
  slots: SlotN[];
}

export const MissedClassesOverTimeChart = (
  props: MissedClassesOverTimeChartProps
) => {
  const { slots } = props;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={computeTimeSeriesFromSlots(slots)}>
        <CartesianGrid />
        <XAxis
          dataKey="x"
          type="number"
          scale="time"
          domain={[
            dataMin => Math.min(dataMin, getLastSeptember(Date.now())),
            Date.now()
          ]}
          tickFormatter={unixTime => format(unixTime, "dd/MM/yyyy")}
        />
        <YAxis />
        <Tooltip labelFormatter={label => format(+label, "dd/MM/yyyy")} />
        <Line
          dataKey="y"
          type="monotone"
          dot={false}
          stroke="rgb(33, 150, 243)"
          strokeWidth="4px"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
