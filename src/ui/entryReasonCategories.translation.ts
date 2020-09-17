import { EntryReasonCategory } from "@@types";

export const EntryReasonCategoriesTranslation = {
  en: {
    [EntryReasonCategory.ILLNESS]: "Illness / Doctor's Visit",
    [EntryReasonCategory.OTHER_EDUCATIONAL]: "Other (educational)",
    [EntryReasonCategory.OTHER_NON_EDUCATIONAL]: "Other (non-educational)",
    [EntryReasonCategory.EXAMEN]: "Examen",
    [EntryReasonCategory.COMPETITION]: "Competition",
    [EntryReasonCategory.FIELD_TRIP]: "Field Trip",
  },
  de: {
    [EntryReasonCategory.ILLNESS]: "Krankheit / Arztbesuch",
    [EntryReasonCategory.OTHER_EDUCATIONAL]: "Sonstiges (Schulisch)",
    [EntryReasonCategory.OTHER_NON_EDUCATIONAL]: "Sonstiges (Außerschulisch)",
    [EntryReasonCategory.EXAMEN]: "Klausur",
    [EntryReasonCategory.COMPETITION]: "Wettbewerb",
    [EntryReasonCategory.FIELD_TRIP]: "Exkursion",
  },
};
