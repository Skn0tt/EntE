import { EntryReasonCategory } from "@@types";

export const EntryReasonCategoriesTranslation = {
  en: {
    [EntryReasonCategory.ILLNESS]: "Illness / Doctor's Visit",
    [EntryReasonCategory.QUARANTINE]: "Quarantine",
    [EntryReasonCategory.OTHER_EDUCATIONAL]: "Other (educational)",
    [EntryReasonCategory.OTHER_NON_EDUCATIONAL]: "Other (non-educational)",
    [EntryReasonCategory.EXAMEN]: "Examen",
    [EntryReasonCategory.COMPETITION]: "Competition",
    [EntryReasonCategory.FIELD_TRIP]: "Field Trip",
    other_educational_sole: "Educational",
    other_non_educational_sole: "Non-educational",
  },
  de: {
    [EntryReasonCategory.ILLNESS]: "Krankheit / Arztbesuch",
    [EntryReasonCategory.QUARANTINE]: "Quarantäne",
    [EntryReasonCategory.OTHER_EDUCATIONAL]: "Sonstiges (Schulisch)",
    [EntryReasonCategory.OTHER_NON_EDUCATIONAL]: "Sonstiges (Außerschulisch)",
    [EntryReasonCategory.EXAMEN]: "Klausur",
    [EntryReasonCategory.COMPETITION]: "Wettbewerb",
    [EntryReasonCategory.FIELD_TRIP]: "Exkursion",
    other_educational_sole: "Schulisch",
    other_non_educational_sole: "Außerschulisch",
  },
};
