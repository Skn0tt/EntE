import * as React from "react";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { UserN, AppState, getTeachingUsers } from "../../redux";
import { connect, MapStateToPropsParam } from "react-redux";
import { FieldTripPayload } from "ente-types";
import { HourFromToInput } from "../../elements/HourFromToInput";
import { Grid } from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    teacher: "Teacher"
  },
  de: {
    teacher: "Lehrer"
  }
});

const getDisplayname = (v: UserN) => v.get("displayname");

const includeItem = (u: UserN, searchTerm: string) =>
  u
    .get("displayname")
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

interface FieldTripReasonInputOwnProps {
  onChange: (v: FieldTripPayload) => void;
}

interface FieldTripReasonInputStateProps {
  teachers: UserN[];
}
const mapStateToProps: MapStateToPropsParam<
  FieldTripReasonInputStateProps,
  FieldTripReasonInputOwnProps,
  AppState
> = state => ({
  teachers: getTeachingUsers(state)
});

type FieldTripReasonInputPropsConnected = FieldTripReasonInputOwnProps &
  FieldTripReasonInputStateProps;

const FieldTripReasonInput: React.FC<
  FieldTripReasonInputPropsConnected
> = props => {
  const translation = useTranslation();

  const { onChange, teachers } = props;

  const [time, setTime] = React.useState<{ from: number; to: number }>({
    from: -1,
    to: -1
  });
  const [teacherId, setTeacherId] = React.useState<string | undefined>(
    undefined
  );

  const payload: any = React.useMemo(
    () => ({
      ...time,
      teacherId
    }),
    [time, teacherId]
  );

  React.useEffect(
    () => {
      onChange(payload);
    },
    [payload, onChange]
  );

  const handleChangeTeacher = React.useCallback(
    (t?: UserN) => {
      setTeacherId(!!t ? t.get("id") : undefined);
    },
    [setTeacherId]
  );

  return (
    <Grid container direction="row" spacing={8}>
      <Grid item xs={2}>
        <HourFromToInput onChange={setTime} />
      </Grid>

      <Grid item xs={10}>
        <SearchableDropdown<UserN>
          items={teachers}
          onChange={handleChangeTeacher}
          itemToString={getDisplayname}
          includeItem={includeItem}
          label={translation.teacher}
        />
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps)(FieldTripReasonInput);
