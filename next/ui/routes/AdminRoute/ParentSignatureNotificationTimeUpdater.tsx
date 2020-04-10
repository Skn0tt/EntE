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
  getParentSignatureNotificationTime,
  setParentSignatureNotificationTimeRequest
} from "../../redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { isValidParentSignatureNotificationTime } from "@@types";

const useTranslation = makeTranslationHook({
  en: {
    title: "Delay"
  },
  de: {
    title: "Verzögerung"
  }
});

const day = 24 * 60 * 60 * 1000;

interface ParentSignatureNotificationTimeUpdaterStateProps {
  currentNotificationTime: number;
}
const mapStateToProps: MapStateToPropsParam<
  ParentSignatureNotificationTimeUpdaterStateProps,
  {},
  AppState
> = state => ({
  currentNotificationTime: getParentSignatureNotificationTime(state).some()
});

interface ParentSignatureNotificationTimeUpdaterDispatchProps {
  setNotificationTime: (v: number) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  ParentSignatureNotificationTimeUpdaterDispatchProps,
  {}
> = dispatch => ({
  setNotificationTime: v =>
    dispatch(setParentSignatureNotificationTimeRequest(v))
});

type ParentSignatureNotificationTimeUpdaterConnectedProps = ParentSignatureNotificationTimeUpdaterDispatchProps &
  ParentSignatureNotificationTimeUpdaterStateProps;

const ParentSignatureNotificationTimeUpdater: React.FC<
  ParentSignatureNotificationTimeUpdaterConnectedProps
> = props => {
  const translation = useTranslation();

  const { currentNotificationTime, setNotificationTime } = props;

  const currentNotificationTimeInDays = currentNotificationTime / day;

  const [input, setInput] = React.useState<number | undefined>(
    currentNotificationTimeInDays
  );

  const handleChange = React.useCallback(
    (v?: number) => {
      setInput(v);
      if (!_.isUndefined(v) && isValidParentSignatureNotificationTime(v)) {
        setNotificationTime(v * day);
      }
    },
    [setNotificationTime, setInput]
  );

  return (
    <NumberInput
      label={translation.title}
      onChange={handleChange}
      value={input}
      isValid={isValidParentSignatureNotificationTime}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParentSignatureNotificationTimeUpdater);
