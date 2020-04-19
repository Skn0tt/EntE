import * as React from "react";
import * as _ from "lodash";
import { Weekday } from "../../reporting/reporting";
import {
  XYPlot,
  HeatmapSeries,
  MarkSeries,
  XAxis,
  YAxis,
  makeVisFlexible,
} from "react-vis";
import { useWeekdayTranslations } from "../../helpers/use-weekday-translations";

const FlexibleXYPlot = makeVisFlexible(XYPlot);

const defaultDay = _.fromPairs(_.times(12, (hour) => [hour + 1, 0]));

const defaultWeek = _.fromPairs(
  _.times(7, (weekday) => {
    return [weekday + 1, defaultDay];
  })
);

interface HoursByWeekdayAndTimeChartOwnProps {
  data: Record<Weekday, Record<number, number>>;
  variant: "scatterplot" | "heatmap";
}

export const HoursByWeekdayAndTimeChart: React.FC<HoursByWeekdayAndTimeChartOwnProps> = (
  props
) => {
  const weekdayTranslation = useWeekdayTranslations().twoCharacter;

  const { data, variant } = props;

  const dataWithDefaultDays = React.useMemo(
    () => _.defaultsDeep(data, defaultWeek),
    [data]
  );

  const transformedData = React.useMemo(() => {
    return _.flatMap(dataWithDefaultDays, (values, weekday) => {
      return _.flatMap(values, (amount, hour) => {
        return {
          x: weekdayTranslation[+weekday as Weekday],
          y: +hour,
          size: +amount,
        };
      });
    });
  }, [dataWithDefaultDays]);

  return (
    <FlexibleXYPlot height={250} xType="ordinal" yType="ordinal">
      <XAxis />
      <YAxis />
      {variant === "scatterplot" ? (
        <MarkSeries color="#2196f3" data={transformedData} />
      ) : (
        <HeatmapSeries
          colorRange={["#2196f3", "#ff9800"]}
          data={transformedData.map((d) => ({ ...d, color: d.size }))}
        />
      )}
    </FlexibleXYPlot>
  );
};
