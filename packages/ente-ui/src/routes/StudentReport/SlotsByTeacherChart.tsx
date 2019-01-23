import * as React from "react";
import { UserN, AppState, getUser } from "../../redux";
import { connect, MapStateToPropsParam } from "react-redux";
import * as _ from "lodash";
import {
  XYPlot,
  VerticalBarSeries,
  YAxis,
  XAxis,
  makeVisFlexible
} from "react-vis";

const FlexibleXYPlot = makeVisFlexible(XYPlot);

interface SlotsByTeacherChartOwnProps {
  data: Record<string, number>;
}

interface SlotsByTeacherChartStateProps {
  dataWithTeachers: { teacher: UserN; amount: number }[];
}
const mapStateToProps: MapStateToPropsParam<
  SlotsByTeacherChartStateProps,
  SlotsByTeacherChartOwnProps,
  AppState
> = (state, props) => {
  const { data } = props;
  const dataWithTeachers = _.map(data, (amount, teacherId) => {
    const teacher = getUser(teacherId)(state);
    return {
      amount,
      teacher: teacher.some()
    };
  });

  return { dataWithTeachers };
};

type SlotsByTeacherChartProps = SlotsByTeacherChartOwnProps &
  SlotsByTeacherChartStateProps;

const SlotsByTeacherChart: React.FC<SlotsByTeacherChartProps> = props => {
  const { dataWithTeachers } = props;

  return (
    <FlexibleXYPlot height={250} yType="linear" xType="ordinal">
      <YAxis />
      <XAxis />
      <VerticalBarSeries
        color="#2196f3"
        barWidth={0.5}
        data={dataWithTeachers.map(v => ({
          x: v.teacher.get("displayname"),
          y: v.amount
        }))}
      />
    </FlexibleXYPlot>
  );
};

export default connect(mapStateToProps)(SlotsByTeacherChart);
