import * as React from "react";
import { HourFromToInput } from "../../elements/HourFromToInput";
import { Grid } from "@material-ui/core";
import TextInput from "../../elements/TextInput";

interface TimeAndDescriptionInputProps {
  onChange: (time: { from?: number; to?: number }, description: string) => void;
  descriptionLabel: string;
}

export const TimeAndDescriptionInput: React.FC<TimeAndDescriptionInputProps> = (
  props
) => {
  const { onChange, descriptionLabel } = props;

  const [time, setTime] = React.useState<{ from?: number; to?: number }>({
    from: -1,
    to: -1,
  });
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    onChange(time, description);
  }, [time, description, onChange]);

  return (
    <Grid container direction="row" spacing={8}>
      <Grid item xs={2}>
        <HourFromToInput onChange={setTime} />
      </Grid>

      <Grid item xs={10}>
        <TextInput
          label={descriptionLabel}
          value={description}
          onChange={setDescription}
        />
      </Grid>
    </Grid>
  );
};
