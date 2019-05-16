import * as React from "react";
import {
  EntryReasonCategory,
  entryReasonCategoryArray,
  EntryReasonPayload,
  entryReasonCategoryIsAllowedInMultiday,
  REASON_CATEGORIES_ALLOWED_IN_MULTIDAY
} from "ente-types";
import { Grid, Typography } from "@material-ui/core";
import { DropdownInput } from "../../elements/DropdownInput";
import * as _ from "lodash";
import { OtherReasonInput } from "./OtherReasonInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { ExamenReasonInput } from "./ExamenReasonInput";
import FieldTripReasonInput from "./FieldTripReasonInput";
import { CompetitionReasonInput } from "./CompetitionReasonInput";
import { EntryReasonCategoriesTranslation } from "../../entryReasonCategories.translation";

const useTranslation = makeTranslationHook({
  en: {
    type: "Type",
    typeLabels: EntryReasonCategoriesTranslation.en,
    title: "Reason",
    caption: "Enter the reason for the excuse."
  },
  de: {
    type: "Art",
    typeLabels: EntryReasonCategoriesTranslation.de,
    title: "Grund des Fehlens",
    caption: "Geben Sie den Grund des Fehlens an."
  }
});

interface EntryReasonInputProps {
  onChange: (
    v: { category: EntryReasonCategory; payload: Partial<EntryReasonPayload> }
  ) => void;
  isRange: boolean;
}

export const EntryReasonInput: React.FC<EntryReasonInputProps> = props => {
  const trans = useTranslation();

  const { onChange, isRange } = props;

  const [category, setCategory] = React.useState<EntryReasonCategory>(
    EntryReasonCategory.ILLNESS
  );
  const [payload, setPayload] = React.useState<
    Partial<EntryReasonPayload> | undefined
  >({});

  React.useEffect(
    () => {
      const categoryIsMultidayAllowed = entryReasonCategoryIsAllowedInMultiday(
        category
      );
      if (isRange && !categoryIsMultidayAllowed) {
        setCategory(EntryReasonCategory.ILLNESS);
        setPayload({});
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

  const handleChangeCategory = React.useCallback(
    (category: EntryReasonCategory) => {
      setCategory(category);
      if (category === EntryReasonCategory.ILLNESS) {
        setPayload({});
      }
    },
    [setCategory, setPayload]
  );

  return (
    <Grid container direction="column" spacing={8}>
      <Grid item>
        <Typography variant="h6">{trans.title}</Typography>
        <Typography variant="caption">{trans.caption}</Typography>
      </Grid>

      <Grid item>
        <DropdownInput<EntryReasonCategory>
          onChange={handleChangeCategory}
          options={
            isRange
              ? REASON_CATEGORIES_ALLOWED_IN_MULTIDAY
              : entryReasonCategoryArray
          }
          getOptionKey={_.identity}
          getOptionLabel={k => trans.typeLabels[k]}
          value={category}
          fullWidth
          label={trans.type}
        />
      </Grid>

      <Grid item>
        {category === EntryReasonCategory.OTHER_EDUCATIONAL && (
          <OtherReasonInput onChange={setPayload} />
        )}
        {category === EntryReasonCategory.OTHER_NON_EDUCATIONAL && (
          <OtherReasonInput onChange={setPayload} />
        )}
        {category === EntryReasonCategory.EXAMEN && (
          <ExamenReasonInput onChange={setPayload} />
        )}
        {category === EntryReasonCategory.FIELD_TRIP && (
          <FieldTripReasonInput onChange={setPayload} isRange={isRange} />
        )}
        {category === EntryReasonCategory.COMPETITION && (
          <CompetitionReasonInput onChange={setPayload} />
        )}
      </Grid>
    </Grid>
  );
};
