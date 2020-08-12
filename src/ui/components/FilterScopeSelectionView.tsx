import * as React from "react";
import { FilterScope } from "../filter-scope";
import { useSelector, useDispatch } from "react-redux";
import { getFilterScope, setFilterScope, getRole } from "../redux";
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
    not_reviewed: "Unreviewed",
  },
  de: {
    everything: "Alles",
    this_year: "Dieses Jahr",
    this_month: "Dieser Monat",
    last_two_weeks: "Zwei Wochen",
    this_week: "Diese Woche",
    today: "Heute",
    label: "Zeitspanne",
    not_reviewed: "Ausstehend",
  },
});

const ALL_FILTER_TYPES: FilterScope[] = [
  "everything",
  "this_year",
  "this_month",
  "last_two_weeks",
  "this_week",
  "today",
  "not_reviewed",
];

function FilterScopeSelectionView() {
  const filterScope = useSelector(getFilterScope);
  const role = useSelector(getRole).some();
  const dispatch = useDispatch();
  const translation = useTranslation();

  const availableFilterTypes = [Roles.MANAGER, Roles.TEACHER].includes(role)
    ? ALL_FILTER_TYPES
    : _.without(ALL_FILTER_TYPES, "not_reviewed");

  return (
    <DropdownInput<FilterScope>
      options={availableFilterTypes}
      getOptionLabel={(o) => translation[o]}
      value={filterScope}
      onChange={(scope) => dispatch(setFilterScope(scope))}
      label={translation.label}
      fullWidth
      variant="outlined"
      margin="dense"
    />
  );
}

export default FilterScopeSelectionView;
