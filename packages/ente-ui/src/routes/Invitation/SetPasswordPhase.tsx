import * as React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import { SetPasswordForm } from "../../components/SetPasswordForm";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam
} from "react-redux";
import {
  setPasswordRequest,
  AppState,
  isTypePending,
  SET_PASSWORD_REQUEST
} from "../../redux";

const useTranslation = makeTranslationHook({
  en: {
    title: "Please set your password.",
    submit: "OK"
  },
  de: {
    title: "Bitte setzen Sie ihr Passwort.",
    submit: "OK"
  }
});

interface SetPasswordPhaseOwnProps {
  token: string;
  onDone: () => void;
}

type SetPasswordPhaseProps = SetPasswordPhaseOwnProps;

interface SetPasswordPhaseStateProps {
  requestPending: boolean;
}
const mapStateToProps: MapStateToPropsParam<
  SetPasswordPhaseStateProps,
  SetPasswordPhaseOwnProps,
  AppState
> = state => ({
  requestPending: isTypePending(state)(SET_PASSWORD_REQUEST)
});

interface SetPasswordPhaseDispatchProps {
  setPassword: (p: string) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SetPasswordPhaseDispatchProps,
  SetPasswordPhaseProps
> = (dispatch, props) => {
  const { token } = props;
  return {
    setPassword: newPassword =>
      dispatch(setPasswordRequest({ token, newPassword }))
  };
};

type SetPasswordPhasePropsConnected = SetPasswordPhaseProps &
  SetPasswordPhaseDispatchProps &
  SetPasswordPhaseStateProps;

const SetPasswordPhase: React.FC<SetPasswordPhasePropsConnected> = props => {
  const { requestPending, setPassword, onDone } = props;
  const translation = useTranslation();
  const [newPassword, setNewPassword] = React.useState("");
  const [alreadyRequested, setAlreadyRequested] = React.useState(false);

  const requestReset = React.useCallback(
    () => {
      setPassword(newPassword);
      setAlreadyRequested(true);
    },
    [newPassword, setPassword]
  );

  if (!requestPending && alreadyRequested) {
    onDone();
  }

  return (
    <>
      <DialogTitle>{translation.title}</DialogTitle>
      <DialogContent>
        <SetPasswordForm onValidPassword={setNewPassword} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={requestPending || newPassword === ""}
          onClick={requestReset}
        >
          {translation.submit}
        </Button>
      </DialogActions>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetPasswordPhase);
