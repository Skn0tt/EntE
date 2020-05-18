import * as React from "react";
import { UserN, getTeachingUsers } from "../../redux";
import { useSelector } from "react-redux";
import * as _ from "lodash";
import {
  XYPlot,
  VerticalBarSeries,
  YAxis,
  XAxis,
  makeVisFlexible,
} from "react-vis";

const FlexibleXYPlot = makeVisFlexible(XYPlot);

interface SlotsByTeacherChartOwnProps {
  data: Record<string, number>;
}

function SlotsByTeacherChart(props: SlotsByTeacherChartOwnProps) {
  const { data } = props;
  const teachers = useSelector(getTeachingUsers);
  const teachersById = _.keyBy(teachers, (teacher) => teacher.get("id"));
  const pointsInPlot = _.map(data, (amount, teacherId) => {
    const teacher =
      teachersById[teacherId] ??
      UserN({
        displayname: "N/A",
      });
    return {
      x: teacher.get("displayname"),
      y: amount,
    };
  });

  return (
    <FlexibleXYPlot
      margin={{ bottom: 100 }}
      height={400}
      yType="linear"
      xType="ordinal"
    >
      <YAxis />
      <XAxis tickLabelAngle={-45} />
      <VerticalBarSeries color="#2196f3" barWidth={0.5} data={pointsInPlot} />
    </FlexibleXYPlot>
  );
}

export default SlotsByTeacherChart;
