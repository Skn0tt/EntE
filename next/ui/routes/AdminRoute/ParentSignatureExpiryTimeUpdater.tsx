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
  getParentSignatureExpiryTime,
  setParentSignatureExpiryTimeRequest
} from "../../redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { isValidParentSignatureExpiryTime } from "@@types";

const useTranslation = makeTranslationHook({
  en: {
    title: "Expiration time"
  },
  de: {
    title: "Auslaufzeit"
  }
});

const day = 24 * 60 * 60 * 1000;

interface ParentSignatureExpiryTimeUpdaterStateProps {
  currentExpiryTime: number;
}
const mapStateToProps: MapStateToPropsParam<
  ParentSignatureExpiryTimeUpdaterStateProps,
  {},
  AppState
> = state => ({
  currentExpiryTime: getParentSignatureExpiryTime(state).some()
});

interface ParentSignatureExpiryTimeUpdaterDispatchProps {
  setExpiryTime: (v: number) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  ParentSignatureExpiryTimeUpdaterDispatchProps,
  {}
> = dispatch => ({
  setExpiryTime: v => dispatch(setParentSignatureExpiryTimeRequest(v))
});

type ParentSignatureExpiryTimeUpdaterConnectedProps = ParentSignatureExpiryTimeUpdaterDispatchProps &
  ParentSignatureExpiryTimeUpdaterStateProps;

const ParentSignatureExpiryTimeUpdater: React.FC<
  ParentSignatureExpiryTimeUpdaterConnectedProps
> = props => {
  const translation = useTranslation();
  const { currentExpiryTime, setExpiryTime } = props;

  const currentNotificationTimeInDays = currentExpiryTime / day;

  const [input, setInput] = React.useState<number | undefined>(
    currentNotificationTimeInDays
  );

  const handleChange = React.useCallback(
    (v?: number) => {
      setInput(v);
      if (!_.isUndefined(v) && isValidParentSignatureExpiryTime(v)) {
        setExpiryTime(v * day);
      }
    },
    [setExpiryTime, setInput]
  );

  return (
    <NumberInput
      label={translation.title}
      onChange={handleChange}
      value={input}
      isValid={isValidParentSignatureExpiryTime}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParentSignatureExpiryTimeUpdater);
