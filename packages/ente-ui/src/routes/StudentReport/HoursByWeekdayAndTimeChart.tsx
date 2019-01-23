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
      [Weekday.MONDAY]: "Monday",
      [Weekday.TUESDAY]: "Tuesday",
      [Weekday.WEDNESDAY]: "Wednesday",
      [Weekday.THURSDAY]: "Thursday",
      [Weekday.FRIDAY]: "Friday",
      [Weekday.SATURDAY]: "Saturday",
      [Weekday.SUNDAY]: "Sunday"
    } as Record<string, string>
  },
  de: {
    days: {
      [Weekday.MONDAY]: "Montag",
      [Weekday.TUESDAY]: "Dienstag",
      [Weekday.WEDNESDAY]: "Mittwoch",
      [Weekday.THURSDAY]: "Donnerstag",
      [Weekday.FRIDAY]: "Freitag",
      [Weekday.SATURDAY]: "Samstag",
      [Weekday.SUNDAY]: "Sonntag"
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
        const weekdayString = translation.days[weekday];

        return _.flatMap(values, (amount, hour) => {
          return {
            x: weekdayString.slice(0, 2),
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
