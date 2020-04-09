import * as React from "react";
import { SlotN } from "../../redux";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ResponsiveContainer
} from "recharts";
import * as _ from "lodash";
import { Reporting } from "../../reporting/reporting";
import {
  parseISO,
  format,
  addDays,
  subDays,
  addMonths,
  getMonth,
  setDate
} from "date-fns";

function getLastSeptember(date: number): number {
  const month = getMonth(date);
  const lastSeptemberDistance = 9 - (month + 12);
  console.log(lastSeptemberDistance, +addMonths(date, lastSeptemberDistance));
  return +setDate(addMonths(date, lastSeptemberDistance), 1);
}

function computeTimeSeriesFromSlots(slots: SlotN[]) {
  const slotsByDate = _.groupBy(slots, s => +parseISO(s.get("date")));
  const hoursByDate = _.mapValues(slotsByDate, Reporting.countHours);

  Object.keys(hoursByDate).forEach(date => {
    const dayBefore = +subDays(+date, 1);
    const dayAfter = +addDays(+date, 1);

    hoursByDate[dayBefore] = hoursByDate[dayBefore] || 0;
    hoursByDate[dayAfter] = hoursByDate[dayAfter] || 0;
  });

  const xy = _.map(hoursByDate, (hours, date) => ({ x: +date, y: hours }));

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
        <Line
          dataKey="y"
          type="monotone"
          stroke="rgb(33, 150, 243)"
          strokeWidth="4px"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
