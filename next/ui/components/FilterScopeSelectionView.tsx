import * as React from "react";
import { FilterScope } from "../filter-scope";
import { MapStateToProps, MapDispatchToPropsParam, connect } from "react-redux";
import { AppState, getFilterScope, setFilterScope, getRole } from "../redux";
import { DropdownInput } from "../elements/DropdownInput";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { Roles } from "@@types";
import * as _ from "lodash";

const useTranslation = makeTranslationHook({
  en: {
    everything: "Alltime",
    this_year: "This year",
    this_month: "This month",
    last_two_weeks: "Last two weeks",
    this_week: "This week",
    today: "Today",
    label: "Timespan",
    not_reviewed: "Unreviewed"
  },
  de: {
    everything: "Alles",
    this_year: "Dieses Jahr",
    this_month: "Dieser Monat",
    last_two_weeks: "Zwei Wochen",
    this_week: "Diese Woche",
    today: "Heute",
    label: "Zeitspanne",
    not_reviewed: "Ausstehend"
  }
});

const ALL_FILTER_TYPES: FilterScope[] = [
  "everything",
  "this_year",
  "this_month",
  "last_two_weeks",
  "this_week",
  "today",
  "not_reviewed"
];

interface FilterScopeSelectionViewOwnProps {}

interface FilterScopeSelectionViewStateProps {
  filterScope: FilterScope;
  role: Roles;
}
const mapStateToProps: MapStateToProps<
  FilterScopeSelectionViewStateProps,
  FilterScopeSelectionViewOwnProps,
  AppState
> = state => ({
  filterScope: getFilterScope(state),
  role: getRole(state).some()
});

interface FilterScopeSelectionViewDispatchProps {
  setFilterScope: (FilterScope: FilterScope) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  FilterScopeSelectionViewDispatchProps,
  FilterScopeSelectionViewOwnProps
> = dispatch => ({
  setFilterScope: scope => dispatch(setFilterScope(scope))
});

type FilterScopeSelectionViewProps = FilterScopeSelectionViewOwnProps &
  FilterScopeSelectionViewDispatchProps &
  FilterScopeSelectionViewStateProps;

const FilterScopeSelectionView: React.FC<
  FilterScopeSelectionViewProps
> = props => {
  const translation = useTranslation();
  const { filterScope, setFilterScope, role } = props;

  const availableFilterTypes = [Roles.MANAGER, Roles.TEACHER].includes(role)
    ? ALL_FILTER_TYPES
    : _.without(ALL_FILTER_TYPES, "not_reviewed");

  return (
    <DropdownInput<FilterScope>
      options={availableFilterTypes}
      getOptionLabel={o => translation[o]}
      value={filterScope}
      onChange={setFilterScope}
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
)(FilterScopeSelectionView);
