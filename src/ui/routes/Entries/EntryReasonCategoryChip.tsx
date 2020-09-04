import * as React from "react";
import { Theme, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { EntryReasonCategoriesTranslation } from "../../entryReasonCategories.translation";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: "100%",
  },
  label: {
    whiteSpace: "normal",
    textAlign: "center",
  },
  [EntryReasonCategoriesTranslation.en.competition]: {
    backgroundColor: "rgb(222, 50, 21)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.en.examen]: {
    backgroundColor: "#f57c00",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.en.field_trip]: {
    backgroundColor: "rgb(14, 115, 198)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.en.illness]: {
    backgroundColor: "rgb(104, 159, 56)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.en.other_educational]: {
    backgroundColor: "rgb(69, 90, 100)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.en.other_non_educational]: {
    backgroundColor: "rgb(40, 53, 147)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.de.competition]: {
    backgroundColor: "rgb(222, 50, 21)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.de.examen]: {
    backgroundColor: "#f57c00",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.de.field_trip]: {
    backgroundColor: "rgb(14, 115, 198)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.de.illness]: {
    backgroundColor: "rgb(104, 159, 56)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.de.other_educational]: {
    backgroundColor: "rgb(69, 90, 100)",
    color: theme.palette.common.white,
  },
  [EntryReasonCategoriesTranslation.de.other_non_educational]: {
    backgroundColor: "rgb(40, 53, 147)",
    color: theme.palette.common.white,
  },
}));

interface EntryReasonCategoryChipProps {
  reasonCategoryTranslated: string;
}

export const EntryReasonCategoryChip: React.FC<EntryReasonCategoryChipProps> = (
  props
) => {
  const { reasonCategoryTranslated } = props;
  const classes = useStyles({});

  return (
    <Chip
      className={classes.root + " " + classes[reasonCategoryTranslated]}
      classes={{
        label: classes.label,
      }}
      label={reasonCategoryTranslated}
    />
  );
};
