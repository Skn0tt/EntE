import * as React from "react";
import { ExamenPayload } from "ente-types";
import { Grid } from "@material-ui/core";
import { HourFromToInput } from "../../elements/HourFromToInput";
import TeacherInput from "./TeacherInput";
import { None, Maybe } from "monet";

interface ExamenReasonInputProps {
  onChange: (v: ExamenPayload) => void;
}

export const ExamenReasonInput: React.FC<ExamenReasonInputProps> = props => {
  const { onChange } = props;

  const [time, setTime] = React.useState<{ from: number; to: number }>({
    from: -1,
    to: -1
  });

  const [teacherId, setTeacherId] = React.useState<Maybe<string>>(None());

  React.useEffect(
    () => {
      onChange({
        ...time,
        teacherId: teacherId.orNull()
      });
    },
    [teacherId.orUndefined(), time]
  );

  return (
    <Grid container direction="row" spacing={8}>
      <Grid item xs={2}>
        <HourFromToInput onChange={setTime} />
      </Grid>

      <Grid item xs={10}>
        <TeacherInput onChange={setTeacherId} />
      </Grid>
    </Grid>
  );
};
