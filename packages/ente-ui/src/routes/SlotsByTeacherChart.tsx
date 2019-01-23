import * as React from "react";
import { UserN, AppState, getUser } from "../redux";
import { connect, MapStateToPropsParam } from "react-redux";
import * as _ from "lodash";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { XYPlot, VerticalBarSeries, YAxis, XAxis } from "react-vis";

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
    <XYPlot height={250} width={500} yType="linear" xType="ordinal">
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
    </XYPlot>
  );
};

export default connect(mapStateToProps)(SlotsByTeacherChart);
