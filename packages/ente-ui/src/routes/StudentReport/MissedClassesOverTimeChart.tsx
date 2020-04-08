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
import { parseISO, format } from "date-fns";

interface MissedClassesOverTimeChartProps {
  slots: SlotN[];
}

export const MissedClassesOverTimeChart = (
  props: MissedClassesOverTimeChartProps
) => {
  const { slots } = props;

  const slotsByDate = _.groupBy(slots, s => s.get("date"));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={_.sortBy(
          _.map(slotsByDate, (slots, date) => ({
            x: +parseISO(date),
            y: Reporting.countHours(slots)
          })),
          v => v.x
        )}
      >
        <CartesianGrid />
        <XAxis
          dataKey="x"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
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
