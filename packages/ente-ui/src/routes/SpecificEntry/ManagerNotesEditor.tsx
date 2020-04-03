import * as React from "react";
import { UserN, AppState } from "../../redux/types";
import { isLoading, updateManagerNotesRequest } from "../../redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { fromEvent } from "rxjs";
import { tap, debounceTime } from "rxjs/operators";
import { EventEmitter } from "events";
import {
  Grid,
  TextField,
  CircularProgress,
  Typography
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  de: {
    title: "Notizen"
  },
  en: {
    title: "Notes"
  }
});

interface ManagerNotesEditorProps {
  student: UserN;
}

const mapStateToProps = (
  state: AppState,
  ownProps: ManagerNotesEditorProps
) => ({
  isUpdating: isLoading(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownState: ManagerNotesEditorProps
) => {
  const studentId = ownState.student.get("id");

  return {
    update: (value: string) =>
      dispatch(
        updateManagerNotesRequest({
          studentId,
          value
        })
      )
  };
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const ManagerNotesEditor = (
  props: ManagerNotesEditorProps & StateProps & DispatchProps
) => {
  const translation = useTranslation();
  const { student, update, isUpdating } = props;
  const [currentValue, setCurrentValue] = React.useState<string>(
    student.get("managerNotes") || ""
  );

  const isSynced = currentValue === student.get("managerNotes");

  const input = React.useMemo(
    () => {
      const events = new EventEmitter();
      const $ = fromEvent<string>(events, "next").pipe(
        tap(v => setCurrentValue(v))
      );

      return {
        $,
        next: (v: string) => events.emit("next", v)
      };
    },
    [setCurrentValue]
  );

  React.useEffect(
    () => {
      const subscription = input.$.pipe(debounceTime(500)).subscribe(value => {
        update(value);
      });

      return subscription.unsubscribe;
    },
    [input.$]
  );

  return (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Typography variant="h6">{translation.title}</Typography>
          </Grid>

          {isSynced ? <DoneIcon /> : <CircularProgress size={24} />}
        </Grid>
      </Grid>
      <Grid item>
        <TextField
          value={currentValue}
          multiline
          fullWidth
          variant="outlined"
          onChange={el => {
            const value = el.currentTarget.value;
            if (typeof value === "string") {
              input.next(value);
            }
          }}
        />
      </Grid>
    </Grid>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerNotesEditor);
