import * as React from "react";
import * as _ from "lodash";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { Weekday } from "../../reporting/reporting";
import {
  XYPlot,
  HeatmapSeries,
  MarkSeries,
  XAxis,
  YAxis,
  makeVisFlexible
} from "react-vis";

const FlexibleXYPlot = makeVisFlexible(XYPlot);

const defaultDay = _.fromPairs(_.times(12, hour => [hour + 1, 0]));

const defaultWeek = _.fromPairs(
  _.times(7, weekday => {
    return [weekday + 1, defaultDay];
  })
);

const useTranslation = makeTranslationHook({
  en: {
    days: {
      [Weekday.MONDAY]: "Mo",
      [Weekday.TUESDAY]: "Tu",
      [Weekday.WEDNESDAY]: "We",
      [Weekday.THURSDAY]: "Thu",
      [Weekday.FRIDAY]: "Fri",
      [Weekday.SATURDAY]: "Sat",
      [Weekday.SUNDAY]: "Sun"
    } as Record<string, string>
  },
  de: {
    days: {
      [Weekday.MONDAY]: "Mo",
      [Weekday.TUESDAY]: "Di",
      [Weekday.WEDNESDAY]: "Mi",
      [Weekday.THURSDAY]: "Do",
      [Weekday.FRIDAY]: "Fr",
      [Weekday.SATURDAY]: "Sa",
      [Weekday.SUNDAY]: "So"
    } as Record<string, string>
  }
});

interface HoursByWeekdayAndTimeChartOwnProps {
  data: Record<Weekday, Record<number, number>>;
  variant: "scatterplot" | "heatmap";
}

export const HoursByWeekdayAndTimeChart: React.FC<
  HoursByWeekdayAndTimeChartOwnProps
> = props => {
  const translation = useTranslation();

  const { data, variant } = props;

  const dataWithDefaultDays = React.useMemo(
    () => _.defaultsDeep(data, defaultWeek),
    [data]
  );

  const transformedData = React.useMemo(
    () => {
      return _.flatMap(dataWithDefaultDays, (values, weekday) => {
        return _.flatMap(values, (amount, hour) => {
          return {
            x: translation.days[weekday],
            y: +hour,
            size: +amount
          };
        });
      });
    },
    [dataWithDefaultDays]
  );

  return (
    <FlexibleXYPlot height={250} xType="ordinal" yType="ordinal">
      <XAxis />
      <YAxis />
      {variant === "scatterplot" ? (
        <MarkSeries color="#2196f3" data={transformedData} />
      ) : (
        <HeatmapSeries
          colorRange={["#2196f3", "#ff9800"]}
          data={transformedData.map(d => ({ ...d, color: d.size }))}
        />
      )}
    </FlexibleXYPlot>
  );
};
