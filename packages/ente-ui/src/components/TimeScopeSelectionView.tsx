import * as React from "react";
import { TimeScope } from "../time-scope";
import { MapStateToProps, MapDispatchToPropsParam, connect } from "react-redux";
import { AppState, getTimeScope, setTimeScope } from "../redux";
import { DropdownInput } from "../elements/DropdownInput";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    everything: "Alltime",
    this_year: "This year",
    this_month: "This month",
    last_two_weeks: "Last two weeks",
    this_week: "This week",
    today: "Today",
    label: "Timespan"
  },
  de: {
    everything: "Alles",
    this_year: "Dieses Jahr",
    this_month: "Dieser Monat",
    last_two_weeks: "Zwei Wochen",
    this_week: "Diese Woche",
    today: "Heute",
    label: "Zeitspanne"
  }
});

const ALL_TIME_SCOPES: TimeScope[] = [
  "everything",
  "this_year",
  "this_month",
  "last_two_weeks",
  "this_week",
  "today"
];

interface TimeScopeSelectionViewOwnProps {}

interface TimeScopeSelectionViewStateProps {
  timeScope: TimeScope;
}
const mapStateToProps: MapStateToProps<
  TimeScopeSelectionViewStateProps,
  TimeScopeSelectionViewOwnProps,
  AppState
> = state => ({
  timeScope: getTimeScope(state)
});

interface TimeScopeSelectionViewDispatchProps {
  setTimeScope: (timeScope: TimeScope) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  TimeScopeSelectionViewDispatchProps,
  TimeScopeSelectionViewOwnProps
> = dispatch => ({
  setTimeScope: scope => dispatch(setTimeScope(scope))
});

type TimeScopeSelectionViewProps = TimeScopeSelectionViewOwnProps &
  TimeScopeSelectionViewDispatchProps &
  TimeScopeSelectionViewStateProps;

const TimeScopeSelectionView: React.FC<TimeScopeSelectionViewProps> = props => {
  const translation = useTranslation();
  const { timeScope, setTimeScope } = props;

  return (
    <DropdownInput<TimeScope>
      options={ALL_TIME_SCOPES}
      getOptionLabel={o => translation[o]}
      value={timeScope}
      onChange={setTimeScope}
      label={translation.label}
      fullWidth
      variant="outlined"
      margin="dense"
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeScopeSelectionView);
