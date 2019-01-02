import * as React from "react";
import {
  EntryReasonCategory,
  entryReasonCategoryArray,
  EntryReasonPayload,
  EntryReasonDto
} from "ente-types";
import { Grid, Typography } from "@material-ui/core";
import { DropdownInput } from "../../elements/DropdownInput";
import * as _ from "lodash";
import { OtherReasonInput } from "./OtherReasonInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { ExamenReasonInput } from "./ExamenReasonInput";
import FieldTripReasonInput from "./FieldTripReasonInput";
import { CompetitionReasonInput } from "./CompetitionReasonInput";

const useTranslation = makeTranslationHook({
  en: {
    type: "Type",
    typeLabels: {
      [EntryReasonCategory.OTHER]: "Other",
      [EntryReasonCategory.COMPETITION]: "Competition",
      [EntryReasonCategory.EXAMEN]: "Examen",
      [EntryReasonCategory.FIELD_TRIP]: "Field Trip"
    },
    title: "Reason",
    caption: "Enter the reason for the excuse."
  },
  de: {
    type: "Art",
    typeLabels: {
      [EntryReasonCategory.OTHER]: "Sonstiges",
      [EntryReasonCategory.COMPETITION]: "Wettbewerb",
      [EntryReasonCategory.EXAMEN]: "Klausur",
      [EntryReasonCategory.FIELD_TRIP]: "Exkursion"
    },
    title: "Grund des Fehlens",
    caption: "Geben Sie den Grund des Fehlens an."
  }
});

interface EntryReasonInputProps {
  onChange: (v: EntryReasonDto) => void;
  isRange: boolean;
}

export const EntryReasonInput: React.FC<EntryReasonInputProps> = props => {
  const trans = useTranslation();

  const { onChange, isRange } = props;

  const [category, setCategory] = React.useState<EntryReasonCategory>(
    EntryReasonCategory.EXAMEN
  );
  const [payload, setPayload] = React.useState<EntryReasonPayload | undefined>(
    undefined
  );

  React.useEffect(
    () => {
      const categoryIsMultidayAllowed = category === EntryReasonCategory.OTHER;
      if (isRange && !categoryIsMultidayAllowed) {
        setCategory(EntryReasonCategory.OTHER);
      }
    },
    [category, isRange, setCategory]
  );

  React.useEffect(
    () => {
      if (!!payload) {
        onChange({
          category,
          payload
        });
      }
    },
    [payload, category, onChange]
  );

  return (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Typography variant="h6">{trans.title}</Typography>
        <Typography variant="caption">{trans.caption}</Typography>
      </Grid>

      <Grid item>
        <DropdownInput<EntryReasonCategory>
          onChange={setCategory}
          options={
            isRange ? [EntryReasonCategory.OTHER] : entryReasonCategoryArray
          }
          getOptionKey={_.identity}
          getOptionLabel={k => trans.typeLabels[k]}
          value={category}
          fullWidth
          label={trans.type}
        />
      </Grid>

      <Grid item>
        {category === EntryReasonCategory.OTHER && (
          <OtherReasonInput onChange={setPayload} />
        )}
        {category === EntryReasonCategory.EXAMEN && (
          <ExamenReasonInput onChange={setPayload} />
        )}
        {category === EntryReasonCategory.FIELD_TRIP && (
          <FieldTripReasonInput onChange={setPayload} />
        )}
        {category === EntryReasonCategory.COMPETITION && (
          <CompetitionReasonInput onChange={setPayload} />
        )}
      </Grid>
    </Grid>
  );
};
