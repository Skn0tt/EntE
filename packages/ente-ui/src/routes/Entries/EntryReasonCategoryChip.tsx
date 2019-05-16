import * as React from "react";
import { EntryReasonCategory } from "ente-types";
import { Theme, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { EntryReasonCategoriesTranslation } from "../../entryReasonCategories.translation";

const useTranslation = makeTranslationHook(EntryReasonCategoriesTranslation);

const useStyles = makeStyles((theme: Theme) => ({
  [EntryReasonCategory.COMPETITION]: {
    backgroundColor: "rgb(222, 50, 21)",
    color: theme.palette.common.white
  },
  [EntryReasonCategory.EXAMEN]: {
    backgroundColor: "#f57c00",
    color: theme.palette.common.white
  },
  [EntryReasonCategory.FIELD_TRIP]: {
    backgroundColor: "rgb(14, 115, 198)",
    color: theme.palette.common.white
  },
  [EntryReasonCategory.ILLNESS]: {
    backgroundColor: "rgb(104, 159, 56)",
    color: theme.palette.common.white
  },
  [EntryReasonCategory.OTHER_EDUCATIONAL]: {
    backgroundColor: "rgb(69, 90, 100)",
    color: theme.palette.common.white
  },
  [EntryReasonCategory.OTHER_NON_EDUCATIONAL]: {
    backgroundColor: "rgb(40, 53, 147)",
    color: theme.palette.common.white
  }
}));

interface EntryReasonCategoryChipProps {
  reasonCategory: EntryReasonCategory;
}

export const EntryReasonCategoryChip: React.FC<
  EntryReasonCategoryChipProps
> = props => {
  const { reasonCategory } = props;

  const classes = useStyles();

  const translation = useTranslation();

  return (
    <Chip
      className={classes[reasonCategory]}
      label={translation[reasonCategory]}
    />
  );
};
