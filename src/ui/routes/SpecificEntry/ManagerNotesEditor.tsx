import * as React from "react";
import { UserN, AppState } from "../../redux/types";
import { isLoading, updateManagerNotesRequest } from "../../redux";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Grid, TextField, Typography } from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { useDebouncedCallback } from "use-debounce";

const useTranslation = makeTranslationHook({
  de: {
    title: "Notizen",
  },
  en: {
    title: "Notes",
  },
});

interface ManagerNotesEditorProps {
  student: UserN;
}

const mapStateToProps = (state: AppState) => ({
  isUpdating: isLoading(state),
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
          value,
        })
      ),
  };
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const ManagerNotesEditor = (
  props: ManagerNotesEditorProps & StateProps & DispatchProps
) => {
  const translation = useTranslation();
  const { student, update } = props;

  const currentValue = React.useRef<string>("");

  React.useEffect(() => {
    return () => {
      update(currentValue.current);
    };
  }, [currentValue]);

  const [debouncedUpdate] = useDebouncedCallback(update, 500);

  return (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Typography variant="h6">{translation.title}</Typography>
      </Grid>
      <Grid item>
        <TextField
          defaultValue={student.get("managerNotes")}
          multiline
          fullWidth
          variant="outlined"
          onChange={(el) => {
            const { value } = el.currentTarget;
            currentValue.current = value;
            debouncedUpdate(value);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerNotesEditor);
