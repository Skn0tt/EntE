import * as React from "react";
import { SlotN } from "../../redux";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import * as _ from "lodash";
import { Reporting } from "../../reporting/reporting";
import {
  parseISO,
  format,
  addMonths,
  getMonth,
  setDate,
  startOfWeek,
  addWeeks,
} from "date-fns";

function getLastSeptember(date: number): number {
  const month = getMonth(date);
  const lastSeptemberDistance = 9 - (month + 12);
  return +setDate(addMonths(date, lastSeptemberDistance), 1);
}

function generateWeeksBetween(min: number, max: number) {
  const result: number[] = [];
  for (
    let current = min;
    current <= +addWeeks(max, 1);
    current = +addWeeks(current, 1)
  ) {
    result.push(+startOfWeek(current));
  }
  return result;
}

function computeTimeSeriesFromSlots(slots: SlotN[]) {
  const dates = slots.map((s) => +parseISO(s.get("date")));
  const minDate = _.min(dates) || Number.MAX_SAFE_INTEGER;

  const domainStart = Math.min(minDate, getLastSeptember(Date.now()));

  const slotsByWeek = _.groupBy(
    slots,
    (s) => +startOfWeek(parseISO(s.get("date")))
  );
  const hoursByWeek = _.mapValues(slotsByWeek, Reporting.countHours);

  for (const week of generateWeeksBetween(domainStart, Date.now())) {
    hoursByWeek[week] = hoursByWeek[week] || 0;
  }

  const xy = _.map(hoursByWeek, (hours, date) => ({
    x: +date,
    y: hours,
  }));

  return _.sortBy(xy, (p) => p.x);
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
            (dataMin) => Math.min(dataMin, getLastSeptember(Date.now())),
            Date.now(),
          ]}
          tickFormatter={(unixTime) => format(unixTime, "ww/yy")}
        />
        <YAxis />
        <Tooltip labelFormatter={(label) => format(+label, "ww/yy")} />
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
