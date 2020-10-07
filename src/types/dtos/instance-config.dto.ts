import { Languages } from "../languages";
import { EntryReasonCategory } from "./entry-reason.dto";

export class ParentSignatureTimesDto {
  expiry: number;
  notification: number;
}

export class InstanceConfigDto {
  defaultLanguage: Languages;
  loginBanners: Record<Languages, string | null>;
  parentSignatureTimes: ParentSignatureTimesDto;
  entryCreationDeadline: number;
  isWeeklySummaryDisabled: boolean;
  hiddenEntryReasonCategories: EntryReasonCategory[];
}

export const DEFAULT_ENTRY_CREATION_DEADLINE = 14;
