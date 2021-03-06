import * as React from "react";
import { FieldTripPayload, dateToIsoString, daysBeforeNow } from "@@types";
import { Grid } from "@material-ui/core";
import TeacherInput from "./TeacherInput";
import { Maybe, None } from "monet";
import { useFromToInput } from "../../helpers/use-from-to-input";
import { NumberInput } from "../../elements/NumberInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { DateInput } from "../../elements/DateInput";
import { connect, MapStateToPropsParam } from "react-redux";
import { AppState, getEntryCreationDeadline } from "../../redux";

const useTranslation = makeTranslationHook({
  en: {
    from: "From",
    to: "To",
    slot: "Hour",
  },
  de: {
    from: "Von",
    to: "Bis",
    slot: "Stunde",
  },
});

interface FieldTripReasonInputOwnProps {
  onChange: (v: Partial<FieldTripPayload>) => void;
  isRange: boolean;
}

interface FieldTripInputStateProps {
  createEntryDeadline: number;
}
const mapStateToProps: MapStateToPropsParam<
  FieldTripInputStateProps,
  FieldTripReasonInputOwnProps,
  AppState
> = (state) => ({
  createEntryDeadline: getEntryCreationDeadline(state).some(),
});

type FieldTripReasonInputPropsConnected = FieldTripReasonInputOwnProps &
  FieldTripInputStateProps;

const FieldTripReasonInput: React.FC<FieldTripReasonInputPropsConnected> = (
  props
) => {
  const translation = useTranslation();

  const { onChange, isRange, createEntryDeadline } = props;

  const { from, to, setFrom, setTo } = useFromToInput(1, 1, isRange);
  const [startDate, setStartDate] = React.useState<string>(
    dateToIsoString(Date.now())
  );
  const [endDate, setEndDate] = React.useState<string>(
    dateToIsoString(Date.now())
  );

  const [teacherId, setTeacherId] = React.useState<Maybe<string>>(None());

  const payload = React.useMemo(
    (): Partial<FieldTripPayload> => ({
      to,
      from,
      teacherId: teacherId.orNull(),
      startDate: isRange ? startDate : undefined,
      endDate: isRange ? endDate : undefined,
    }),
    [from, to, startDate, endDate, teacherId]
  );

  React.useEffect(() => {
    onChange(payload);
  }, [payload, onChange]);

  return (
    <Grid container direction="row" spacing={8}>
      <Grid item xs={isRange ? 12 : 2}>
        <Grid container spacing={8}>
          {isRange && (
            <Grid item xs={4}>
              <DateInput
                label={translation.from}
                onChange={setStartDate}
                minDate={
                  isRange
                    ? undefined
                    : dateToIsoString(daysBeforeNow(createEntryDeadline))
                }
                value={startDate}
              />
            </Grid>
          )}

          <Grid item xs={isRange ? 2 : 6}>
            <NumberInput
              label={isRange ? translation.slot : translation.from}
              onChange={setFrom}
              value={from}
            />
          </Grid>

          {isRange && (
            <Grid item xs={4}>
              <DateInput
                label={translation.to}
                onChange={setEndDate}
                minDate={startDate}
                value={endDate}
              />
            </Grid>
          )}

          <Grid item xs={isRange ? 2 : 6}>
            <NumberInput
              label={isRange ? translation.slot : translation.to}
              onChange={setTo}
              value={to}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={isRange ? 12 : 10}>
        <TeacherInput onChange={setTeacherId} value={teacherId} />
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps)(FieldTripReasonInput);
