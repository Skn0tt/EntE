import * as React from "react";
import { NumberInput } from "../../elements/NumberInput";
import * as _ from "lodash";
import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  connect
} from "react-redux";
import {
  AppState,
  setEntryCreationDaysRequest,
  getEntryCreationDeadline
} from "../../redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    title: "Entry creation deadline"
  },
  de: {
    title: "Eintrags-Erstellungs-Frist"
  }
});

interface EntryCreationDaysUpdaterStateProps {
  currentDays: number;
}
const mapStateToProps: MapStateToPropsParam<
  EntryCreationDaysUpdaterStateProps,
  {},
  AppState
> = state => ({
  currentDays: getEntryCreationDeadline(state).some()
});

interface EntryCreationDaysUpdaterDispatchProps {
  setDays: (v: number) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  EntryCreationDaysUpdaterDispatchProps,
  {}
> = dispatch => ({
  setDays: v => dispatch(setEntryCreationDaysRequest(v))
});

type EntryCreationDaysUpdaterConnectedProps = EntryCreationDaysUpdaterDispatchProps &
  EntryCreationDaysUpdaterStateProps;

const EntryCreationDaysUpdater: React.FC<
  EntryCreationDaysUpdaterConnectedProps
> = props => {
  const translation = useTranslation();
  const { currentDays, setDays } = props;

  const [input, setInput] = React.useState<number | undefined>(currentDays);

  const handleChange = React.useCallback(
    (v?: number) => {
      setInput(v);
      if (!_.isUndefined(v)) {
        setDays(v);
      }
    },
    [setDays, setInput]
  );

  return (
    <NumberInput
      label={translation.title}
      onChange={handleChange}
      value={input}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryCreationDaysUpdater);
